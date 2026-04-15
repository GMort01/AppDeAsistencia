const express = require('express');
const { crearClase, listarClasesProfesor, eliminarClase, actualizarEstadoClase, desvincularDispositivo } = require('../controllers/clasesController');

const router = express.Router();

router.post('/', crearClase);
router.get('/profesor/:profesorId', listarClasesProfesor);
router.patch('/:claseId/estado', actualizarEstadoClase);
router.delete('/:claseId', eliminarClase);
router.delete('/dispositivo/:estudianteId', desvincularDispositivo);

module.exports = router;
