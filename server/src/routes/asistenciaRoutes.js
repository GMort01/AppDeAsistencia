const express = require('express');
const { registrarAsistencia, obtenerAsistenciasPorClase, obtenerClasesPorEstudiante, obtenerAsistenciasHoyPorClase, generarTokenQR } = require('../controllers/asistenciaController');

const router = express.Router();

router.post('/registrar', registrarAsistencia);
router.get('/qr-token/:claseId', generarTokenQR);
router.get('/estudiante/:estudianteId/clases', obtenerClasesPorEstudiante);
router.get('/clase/:claseId', obtenerAsistenciasPorClase);
router.get('/clase/:claseId/hoy', obtenerAsistenciasHoyPorClase);

module.exports = router;
