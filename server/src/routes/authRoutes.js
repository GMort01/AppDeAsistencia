const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para registro: POST http://localhost:3000/api/auth/register
router.post('/register', authController.register); 

// Ruta para login de estudiantes: POST http://localhost:3000/api/auth/login-estudiante
router.post('/login-estudiante', authController.loginEstudiante);

// Ruta para login de profesores: POST http://localhost:3000/api/auth/login-profesor
router.post('/login-profesor', authController.loginProfesor);

module.exports = router;