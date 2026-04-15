const express = require('express'); 
const mysql = require('mysql2'); 
const cors = require('cors'); 
const helmet = require('helmet'); 
const authRoutes = require('./routes/authRoutes'); // 1. Importas rutas 
require('dotenv').config();

const app = express(); 

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

db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.message);
        return;
    }
    console.log('✅ Conexión exitosa a MySQL Local');
});

app.get('/', (req, res) => {
    res.send('Servidor Local de Smart Attendance funcionando 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});