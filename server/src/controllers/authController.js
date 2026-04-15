const bcrypt = require('bcryptjs');

// --- REGISTRO ---
exports.register = async (req, res) => {
    const { nombre_completo, correo_institucional, password, rol, id_universitario } = req.body;
    const db = req.app.get('db');

    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const query = `INSERT INTO usuarios (nombre_completo, correo_institucional, password_hash, rol, id_universitario) 
                       VALUES (?, ?, ?, ?, ?)`;
        
        // Asignamos 'estudiante' por defecto si no viene un rol
        db.query(query, [nombre_completo, correo_institucional, password_hash, rol || 'estudiante', id_universitario], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ mensaje: "Error al registrar usuario", error: err.code });
            }
            res.status(201).json({ mensaje: "Usuario registrado con éxito", id: result.insertId });
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// --- LOGIN ESTUDIANTES ---
exports.loginEstudiante = (req, res) => {
    const { correo_institucional, password } = req.body;
    const db = req.app.get('db');

    const query = 'SELECT * FROM usuarios WHERE correo_institucional = ?';
    
    db.query(query, [correo_institucional], async (err, results) => {
        if (err) return res.status(500).json({ mensaje: "Error en el servidor" });

        if (results.length === 0) {
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        const usuario = results[0];

        // VALIDACIÓN: ¿Es estudiante?
        if (usuario.rol !== 'estudiante') {
            return res.status(403).json({ mensaje: "Esta cuenta no es de estudiante. Usa el acceso de profesores." });
        }

        const passwordCorrecto = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordCorrecto) {
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        res.status(200).json({
            mensaje: "Login Estudiante exitoso",
            usuario: {
                id: usuario.id, // Corregido según tu tabla (era 'id', no 'id_usuario')
                nombre: usuario.nombre_completo,
                rol: usuario.rol
            }
        });
    });
};

// --- LOGIN PROFESORES ---
exports.loginProfesor = (req, res) => {
    const { correo_institucional, password } = req.body;
    const db = req.app.get('db');

    const query = 'SELECT * FROM usuarios WHERE correo_institucional = ?';
    
    db.query(query, [correo_institucional], async (err, results) => {
        if (err) return res.status(500).json({ mensaje: "Error en el servidor" });

        if (results.length === 0) {
            return res.status(401).json({ mensaje: "Credenciales de profesor incorrectas" });
        }

        const usuario = results[0];

        // VALIDACIÓN: ¿Es profesor? (Aquí está el bloqueo al tramposillo)
        if (usuario.rol !== 'profesor') {
            return res.status(403).json({ mensaje: "¡Acceso denegado! No tienes permisos de profesor." });
        }

        const passwordCorrecto = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordCorrecto) {
            return res.status(401).json({ mensaje: "Credenciales de profesor incorrectas" });
        }

        res.status(200).json({
            mensaje: "Bienvenido, Profesor",
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre_completo,
                rol: usuario.rol
            }
        });
    });
};