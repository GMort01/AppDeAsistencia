const generarCodigoAcceso = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo;
};

exports.crearClase = (req, res) => {
    const { nombre_clase, profesor_id, hora_inicio, hora_fin, fecha_clase } = req.body;
    const db = req.app.get('db');

    if (!nombre_clase || !profesor_id || !hora_inicio || !hora_fin) {
        return res.status(400).json({ exito: false, mensaje: 'nombre_clase, profesor_id, hora_inicio y hora_fin son obligatorios.' });
    }

    const codigo_acceso = generarCodigoAcceso();
    const query = `
        INSERT INTO clases (nombre_clase, profesor_id, hora_inicio, hora_fin, fecha_clase, asistencia_abierta, codigo_acceso)
        VALUES (?, ?, ?, ?, ?, 1, ?)
    `;

    db.query(query, [nombre_clase, profesor_id, hora_inicio, hora_fin, fecha_clase || null, codigo_acceso], (err, result) => {
        if (err) {
            console.error('Error creando clase:', err);
            return res.status(500).json({ exito: false, mensaje: 'Error al crear la clase.' });
        }

        return res.status(201).json({
            exito: true,
            mensaje: 'Clase creada correctamente.',
            clase: {
                id: String(result.insertId),
                nombre: nombre_clase,
                horaInicio: hora_inicio,
                horaFin: hora_fin,
                fecha: fecha_clase || '',
                asistenciaAbierta: true,
                codigo_acceso,
            },
        });
    });
};

// El profesor puede desvincular el dispositivo de un estudiante
// (útil si el estudiante cambia de teléfono)
// DELETE /api/clases/dispositivo/:estudianteId?profesor_id=xxx
exports.desvincularDispositivo = (req, res) => {
    const { estudianteId } = req.params;
    const profesor_id = req.body?.profesor_id || req.query?.profesor_id;
    const db = req.app.get('db');

    if (!profesor_id) {
        return res.status(400).json({ exito: false, mensaje: 'profesor_id requerido.' });
    }

    // Verificar que el estudiante haya asistido al menos a una clase del profesor
    const verificarQuery = `
        SELECT DISTINCT u.id
        FROM usuarios u
        INNER JOIN asistencias a ON a.estudiante_id = u.id
        INNER JOIN clases c ON c.id = a.clase_id
        WHERE u.id = ? AND c.profesor_id = ?
        LIMIT 1
    `;
    db.query(verificarQuery, [estudianteId, profesor_id], (errVerif, rows) => {
        if (errVerif) {
            console.error(errVerif);
            return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
        }
        if (!rows || rows.length === 0) {
            return res.status(403).json({ exito: false, mensaje: 'No tienes permiso para desvincular este estudiante.' });
        }
        db.query(
            'UPDATE usuarios SET dispositivo_vinculado = NULL WHERE id = ?',
            [estudianteId],
            (errUpdate) => {
                if (errUpdate) {
                    console.error(errUpdate);
                    return res.status(500).json({ exito: false, mensaje: 'Error al desvincular dispositivo.' });
                }
                return res.json({ exito: true, mensaje: 'Dispositivo desvinculado correctamente.' });
            }
        );
    });
};

exports.listarClasesProfesor = (req, res) => {
    const { profesorId } = req.params;
    const db = req.app.get('db');

    const query = `
        SELECT id, nombre_clase, codigo_acceso, hora_inicio, hora_fin, fecha_clase, asistencia_abierta
        FROM clases
        WHERE profesor_id = ?
        ORDER BY id DESC
    `;

    db.query(query, [profesorId], (err, rows) => {
        if (err) {
            console.error('Error listando clases:', err);
            return res.status(500).json({ exito: false, mensaje: 'Error al listar clases.' });
        }

        const clases = rows.map((row) => ({
            id: String(row.id),
            nombre: row.nombre_clase,
            horaInicio: row.hora_inicio || '--:--',
            horaFin: row.hora_fin || '--:--',
            fecha: row.fecha_clase || '',
            asistenciaAbierta: Boolean(row.asistencia_abierta),
            codigo_acceso: row.codigo_acceso,
        }));

        return res.status(200).json({ exito: true, clases });
    });
};

exports.eliminarClase = (req, res) => {
    const { claseId } = req.params;
    const profesor_id =
        (req.body && req.body.profesor_id) ||
        req.query.profesor_id ||
        req.headers['x-profesor-id'];
    const db = req.app.get('db');

    if (!profesor_id) {
        return res.status(400).json({ exito: false, mensaje: 'profesor_id es obligatorio.' });
    }

    db.query('SELECT id FROM clases WHERE id = ? AND profesor_id = ? LIMIT 1', [claseId, profesor_id], (errClase, clases) => {
        if (errClase) {
            console.error('Error validando propietario de la clase:', errClase);
            return res.status(500).json({ exito: false, mensaje: 'Error al eliminar la clase.' });
        }

        if (!clases || clases.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Clase no encontrada para este profesor.' });
        }

        db.query('DELETE FROM asistencias WHERE clase_id = ?', [claseId], (errAsistencias) => {
        if (errAsistencias) {
            console.error('Error eliminando asistencias de la clase:', errAsistencias);
            return res.status(500).json({ exito: false, mensaje: 'Error al eliminar la clase.' });
        }

        db.query('DELETE FROM sesiones_clase WHERE clase_id = ?', [claseId], (errSesiones) => {
            if (errSesiones) {
                console.error('Error eliminando sesiones de la clase:', errSesiones);
                return res.status(500).json({ exito: false, mensaje: 'Error al eliminar la clase.' });
            }

            db.query('DELETE FROM clases WHERE id = ? AND profesor_id = ?', [claseId, profesor_id], (errDelete, result) => {
                if (errDelete) {
                    console.error('Error eliminando clase:', errDelete);
                    return res.status(500).json({ exito: false, mensaje: 'Error al eliminar clase.' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ exito: false, mensaje: 'Clase no encontrada.' });
                }

                return res.status(200).json({ exito: true, mensaje: 'Clase eliminada correctamente.' });
            });
        });
        });
    });
};

exports.actualizarEstadoClase = (req, res) => {
    const { claseId } = req.params;
    const { profesor_id, asistencia_abierta } = req.body;
    const db = req.app.get('db');

    if (!profesor_id) {
        return res.status(400).json({ exito: false, mensaje: 'profesor_id es obligatorio.' });
    }

    const query = 'UPDATE clases SET asistencia_abierta = ? WHERE id = ? AND profesor_id = ?';

    db.query(query, [asistencia_abierta ? 1 : 0, claseId, profesor_id], (err, result) => {
        if (err) {
            console.error('Error actualizando estado de clase:', err);
            return res.status(500).json({ exito: false, mensaje: 'Error al actualizar el estado de la clase.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Clase no encontrada para este profesor.' });
        }

        return res.status(200).json({ exito: true, mensaje: 'Estado de la clase actualizado.' });
    });
};
