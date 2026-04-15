const express = require('express');
const { register, loginEstudiante, loginProfesor } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login/estudiante', loginEstudiante);
router.post('/login/profesor', loginProfesor);
// Compatibilidad con rutas antiguas usadas por versiones previas del mobile
router.post('/login-estudiante', loginEstudiante);
router.post('/login-profesor', loginProfesor);

module.exports = router;
