const express = require('express');
const router = express.Router();
const bomberoController = require('../controller/bomberoMantenedor.controller');

// Rutas para el CRUD de bomberos
router.get('/bomberosL', bomberoController.getBomberos); // Listar bomberos
router.post('/bomberosC', bomberoController.createBombero); // Crear bombero
router.put('/bomberosA', bomberoController.updateBombero); // Actualizar bombero
router.delete('/bomberos/:id', bomberoController.deleteBombero); // Eliminar bombero

module.exports = router;
