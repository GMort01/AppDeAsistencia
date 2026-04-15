// server/src/controllers/asistenciaController.js
const crypto = require('crypto');
const QR_SECRET = process.env.QR_SECRET || 'smartattendance_qr_fallback_2026';

const listarAsistentes = (db, claseId, cb) => {
    const query = `
        SELECT
            u.id AS userId,
            u.id_universitario AS id,
            u.nombre_completo AS nombre,
            MAX(a.fecha_hora) AS ultima_asistencia
        FROM asistencias a
        INNER JOIN usuarios u ON u.id = a.estudiante_id
        WHERE a.clase_id = ?
        GROUP BY u.id, u.id_universitario, u.nombre_completo
        ORDER BY ultima_asistencia DESC
    `;

    db.query(query, [claseId], (err, rows) => {
        if (err) return cb(err);
        const asistentes = rows.map((r) => ({
            id: String(r.id),
            nombre: r.nombre,
            userId: String(r.userId),
        }));
        return cb(null, asistentes);
    });
};

const registrarAsistencia = (req, res) => {
    const { claseId: claseIdBody, estudianteId, tokenQR, timestampQR } = req.body;
    const db = req.app.get('db');

    if (!estudianteId) {
        return res.status(400).json({ exito: false, mensaje: 'Datos incompletos para registrar asistencia.' });
    }

    // Lógica principal de registro (independiente del método de validación)
    const deviceId = String(req.body?.deviceId || '').trim();
    const deviceIdSecundario = String(req.body?.deviceIdSecundario || '').trim();

    if (!deviceId) {
        return res.status(400).json({
            exito: false,
            mensaje: 'No se pudo validar el dispositivo. Actualiza la app e intenta nuevamente.'
        });
    }

    // Lógica principal de registro (independiente del método de validación)
    const continuarConRegistro = (claseId) => {
        // 1) Validar clase existente
        db.query('SELECT id, nombre_clase FROM clases WHERE id = ? LIMIT 1', [claseId], (errClase, clases) => {
            if (errClase) {
                console.error(errClase);
                return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
            }
            if (!clases || clases.length === 0) {
                return res.status(404).json({ exito: false, mensaje: 'Clase no encontrada.' });
            }

            // 2) Validar estudiante existente y rol correcto
            db.query('SELECT id, rol, dispositivo_vinculado FROM usuarios WHERE id = ? LIMIT 1', [estudianteId], (errUser, users) => {
                if (errUser) {
                    console.error(errUser);
                    return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
                }
                if (!users || users.length === 0) {
                    return res.status(404).json({ exito: false, mensaje: 'Estudiante no encontrado.' });
                }
                if (users[0].rol !== 'estudiante') {
                    return res.status(403).json({ exito: false, mensaje: 'Solo estudiantes pueden registrar asistencia.' });
                }

                const continuarDespuesDispositivo = () => {
                    // 4) Evitar duplicado por estudiante-clase
                    const dupQuery = 'SELECT id FROM asistencias WHERE estudiante_id = ? AND clase_id = ? LIMIT 1';
                    db.query(dupQuery, [estudianteId, claseId], (errDup, duplicados) => {
                    if (errDup) {
                        console.error(errDup);
                        return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
                    }

                    const responderConLista = (mensaje) => {
                        listarAsistentes(db, claseId, (errList, asistentes) => {
                            if (errList) {
                                console.error(errList);
                                return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
                            }
                            return res.status(200).json({
                                exito: true,
                                mensaje,
                                clase: {
                                    id: String(clases[0].id),
                                    nombre: clases[0].nombre_clase,
                                },
                                asistentes,
                            });
                        });
                    };

                    if (duplicados && duplicados.length > 0) {
                        return responderConLista('Ya estabas registrado en esta clase.');
                    }

                    const insertQuery = `
                        INSERT INTO asistencias (estudiante_id, clase_id, dispositivo_usado)
                        VALUES (?, ?, ?)
                    `;
                    db.query(insertQuery, [estudianteId, claseId, req.ip || 'dispositivo'], (errInsert) => {
                        if (errInsert) {
                            console.error(errInsert);
                            return res.status(500).json({ exito: false, mensaje: 'No se pudo registrar asistencia.' });
                        }
                        return responderConLista('Asistencia registrada correctamente en el servidor.');
                    });
                });
                };

                // 3) Validación de dispositivo (Fase 2)
                const dispositivoRegistrado = users[0].dispositivo_vinculado;
                const coincidePrincipal = dispositivoRegistrado && dispositivoRegistrado === deviceId;
                const coincideSecundario = dispositivoRegistrado
                    && deviceIdSecundario
                    && dispositivoRegistrado === deviceIdSecundario;

                if (dispositivoRegistrado && !coincidePrincipal && !coincideSecundario) {
                    return res.status(403).json({
                        exito: false,
                        mensaje: 'Esta cuenta ya está vinculada a otro dispositivo. Contacta al profesor para desvincularlo.'
                    });
                }

                if (coincideSecundario && deviceId && deviceId !== dispositivoRegistrado) {
                    // Migración transparente: si el vínculo actual coincide con el ID legacy,
                    // actualizamos al ID principal más estable del dispositivo.
                    return db.query(
                        'UPDATE usuarios SET dispositivo_vinculado = ? WHERE id = ?',
                        [deviceId, estudianteId],
                        (errMigrate) => {
                            if (errMigrate) {
                                console.error('Error migrando dispositivo vinculado:', errMigrate.message);
                                return res.status(500).json({ exito: false, mensaje: 'No se pudo validar el dispositivo.' });
                            }
                            return continuarDespuesDispositivo();
                        }
                    );
                }

                if (!dispositivoRegistrado) {
                    // Primera vez: vincular este dispositivo y sólo después continuar
                    return db.query(
                        'UPDATE usuarios SET dispositivo_vinculado = ? WHERE id = ?',
                        [deviceId, estudianteId],
                        (errBind) => {
                            if (errBind) {
                                console.error('Error vinculando dispositivo:', errBind.message);
                                return res.status(500).json({ exito: false, mensaje: 'No se pudo vincular el dispositivo.' });
                            }
                            return continuarDespuesDispositivo();
                        }
                    );
                }

                return continuarDespuesDispositivo();
            });
        });
    };

    if (tokenQR) {
        // ============================================================
        // FASE 1: Validación con token HMAC firmado
        // ============================================================
        const partes = tokenQR.split('.');
        if (partes.length !== 2) {
            return res.status(400).json({ exito: false, mensaje: 'Token QR inválido.' });
        }
        const [payloadB64, firma] = partes;

        // 1. Verificar firma HMAC (timing-safe para evitar timing attacks)
        if (!/^[0-9a-f]{64}$/.test(firma)) {
            return res.status(400).json({ exito: false, mensaje: 'Token QR inválido.' });
        }
        const firmaEsperada = crypto.createHmac('sha256', QR_SECRET).update(payloadB64).digest('hex');
        const firmasCoinciden = crypto.timingSafeEqual(
            Buffer.from(firma, 'hex'),
            Buffer.from(firmaEsperada, 'hex')
        );
        if (!firmasCoinciden) {
            return res.status(400).json({ exito: false, mensaje: 'QR no auténtico. Escanea el código del profesor.' });
        }

        // 2. Decodificar payload
        let payload;
        try {
            payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));
        } catch {
            return res.status(400).json({ exito: false, mensaje: 'Token QR malformado.' });
        }
        const { claseId: claseIdToken, ts, nonce } = payload;
        if (!claseIdToken || !ts || !nonce) {
            return res.status(400).json({ exito: false, mensaje: 'Token QR incompleto.' });
        }

        // 3. Verificar ventana de tiempo (20 segundos)
        const difSeg = (Date.now() - Number(ts)) / 1000;
        if (difSeg > 20 || difSeg < -5) {
            return res.status(400).json({ exito: false, mensaje: 'El QR ha expirado. Escanea el código actual.' });
        }

        // 4. Verificar uso único (anti-replay)
        db.query('SELECT nonce FROM tokens_qr_usados WHERE nonce = ? LIMIT 1', [nonce], (errCheck, usados) => {
            if (errCheck) {
                console.error(errCheck);
                return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
            }
            if (usados && usados.length > 0) {
                return res.status(400).json({ exito: false, mensaje: 'Este código QR ya fue usado. Espera el siguiente.' });
            }
            // 5. Marcar nonce como usado y continuar
            db.query('INSERT INTO tokens_qr_usados (nonce) VALUES (?)', [nonce], (errNonce) => {
                if (errNonce) {
                    console.error(errNonce);
                    return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
                }
                continuarConRegistro(claseIdToken);
            });
        });

    } else if (timestampQR) {
        // ============================================================
        // LEGACY: token simple claseId|timestamp (compatibilidad)
        // ============================================================
        if (!claseIdBody) {
            return res.status(400).json({ exito: false, mensaje: 'Datos incompletos para registrar asistencia.' });
        }
        const tiempoQR = Number(timestampQR);
        if (Number.isNaN(tiempoQR)) {
            return res.status(400).json({ exito: false, mensaje: 'Formato de QR inválido.' });
        }
        const diferencia = (Date.now() - tiempoQR) / 1000;
        if (diferencia > 20) {
            return res.status(400).json({ exito: false, mensaje: 'El QR ha expirado. Escanea el codigo actual.' });
        }
        continuarConRegistro(claseIdBody);

    } else {
        return res.status(400).json({ exito: false, mensaje: 'Datos incompletos para registrar asistencia.' });
    }
};

const obtenerAsistenciasPorClase = (req, res) => {
    const { claseId } = req.params;
    const db = req.app.get('db');

    listarAsistentes(db, claseId, (err, asistentes) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
        }
        return res.status(200).json({ exito: true, asistentes });
    });
};

const obtenerClasesPorEstudiante = (req, res) => {
    const { estudianteId } = req.params;
    const db = req.app.get('db');

    const query = `
        SELECT
            c.id,
            c.nombre_clase AS nombre,
            COALESCE(c.hora_inicio, '--:--') AS horaInicio,
            COALESCE(c.hora_fin, '--:--') AS horaFin,
            COALESCE(c.fecha_clase, DATE_FORMAT(MAX(a.fecha_hora), '%Y-%m-%d')) AS fecha,
            MAX(a.fecha_hora) AS ultimoRegistro
        FROM asistencias a
        INNER JOIN clases c ON c.id = a.clase_id
        WHERE a.estudiante_id = ?
        GROUP BY c.id, c.nombre_clase, c.hora_inicio, c.hora_fin, c.fecha_clase
        ORDER BY ultimoRegistro DESC
    `;

    db.query(query, [estudianteId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
        }

        const clases = rows.map((row) => ({
            id: String(row.id),
            nombre: row.nombre,
            horaInicio: row.horaInicio,
            horaFin: row.horaFin,
            fecha: row.fecha,
            asistentes: [],
        }));

        return res.status(200).json({ exito: true, clases });
    });
};

const obtenerAsistenciasHoyPorClase = (req, res) => {
    const { claseId } = req.params;
    const db = req.app.get('db');

    const query = `
        SELECT
            u.id_universitario AS id,
            u.nombre_completo AS nombre,
            DATE_FORMAT(a.fecha_hora, '%H:%i:%s') AS horaRegistro,
            DATE(a.fecha_hora) AS fechaRegistro
        FROM asistencias a
        INNER JOIN usuarios u ON u.id = a.estudiante_id
        WHERE a.clase_id = ?
          AND DATE(a.fecha_hora) = CURDATE()
        ORDER BY a.fecha_hora ASC
    `;

    db.query(query, [claseId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
        }

        const asistentes = rows.map((r) => ({
            id: String(r.id),
            nombre: r.nombre,
            horaRegistro: r.horaRegistro,
            fechaRegistro: r.fechaRegistro,
        }));

        return res.status(200).json({ exito: true, asistentes });
    });
};

const generarTokenQR = (req, res) => {
    const { claseId } = req.params;
    const db = req.app.get('db');

    db.query('SELECT id, asistencia_abierta FROM clases WHERE id = ? LIMIT 1', [claseId], (err, clases) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ exito: false, mensaje: 'Error interno.' });
        }
        if (!clases || clases.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Clase no encontrada.' });
        }
        if (!clases[0].asistencia_abierta) {
            return res.status(403).json({ exito: false, mensaje: 'La asistencia está cerrada.' });
        }

        const payloadStr = JSON.stringify({
            claseId: String(claseId),
            ts: Date.now(),
            nonce: crypto.randomBytes(16).toString('hex')
        });
        const payloadB64 = Buffer.from(payloadStr).toString('base64');
        const firma = crypto.createHmac('sha256', QR_SECRET).update(payloadB64).digest('hex');
        const token = `${payloadB64}.${firma}`;

        return res.json({ exito: true, token });
    });
};

module.exports = { registrarAsistencia, obtenerAsistenciasPorClase, obtenerClasesPorEstudiante, obtenerAsistenciasHoyPorClase, generarTokenQR };