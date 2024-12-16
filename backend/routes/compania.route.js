const express = require('express');
const router = express.Router();
const companiaController = require('../controller/compania.controller');

// Ruta para listar todas las compañías
router.get('/listar', companiaController.getCompanias);

module.exports = router;
