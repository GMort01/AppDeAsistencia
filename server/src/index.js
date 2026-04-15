const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes'); // 1. Importas rutas
const asistenciaRoutes = require('./routes/asistenciaRoutes'); // Nueva ruta de asistencia
const clasesRoutes = require('./routes/clasesRoutes');
require('dotenv').config();

const app = express(); 

const aplicarMigraciones = (db) => {
    const migraciones = [
        'ALTER TABLE clases ADD COLUMN hora_inicio VARCHAR(20) DEFAULT NULL',
        'ALTER TABLE clases ADD COLUMN hora_fin VARCHAR(20) DEFAULT NULL',
        'ALTER TABLE clases ADD COLUMN fecha_clase VARCHAR(20) DEFAULT NULL',
        'ALTER TABLE clases ADD COLUMN asistencia_abierta TINYINT(1) NOT NULL DEFAULT 1',
        `CREATE TABLE IF NOT EXISTS tokens_qr_usados (
            nonce VARCHAR(32) NOT NULL,
            usado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (nonce),
            INDEX idx_usado_en (usado_en)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
        'ALTER TABLE usuarios ADD COLUMN dispositivo_vinculado VARCHAR(64) DEFAULT NULL'
    ];

    migraciones.forEach((sql) => {
        db.query(sql, (err) => {
            if (err && err.code !== 'ER_DUP_FIELDNAME' && err.code !== 'ER_TABLE_EXISTS_ERROR') {
                console.error('Error aplicando migracion:', err.message);
            }
        });
    });

    // Limpiar tokens usados de hace más de 1 hora para evitar crecimiento infinito
    db.query("DELETE FROM tokens_qr_usados WHERE usado_en < DATE_SUB(NOW(), INTERVAL 1 HOUR)", (err) => {
        if (err) console.error('Error limpiando tokens QR expirados:', err.message);
    });
};

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// 2. Definir la conexión PRIMERO
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// 3. Ahora que 'db' existe, lo pasamos a la app
app.set('db', db); 

// 4. Ahora sí, usamos las rutas
app.use('/api/auth', authRoutes);
app.use('/api/asistencia', asistenciaRoutes); // Nueva ruta de asistencia
app.use('/api/clases', clasesRoutes);

db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.message);
        return;
    }
    aplicarMigraciones(db);
    console.log('✅ Conexión exitosa a MySQL Local');
});

app.get('/', (req, res) => {
    res.send('Servidor Local de Smart Attendance funcionando 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});