const express = require('express');
const router = express.Router();
const cargoController = require('../controller/cargos.controller');

// Ruta para listar todos los cargos
router.get('/listar', cargoController.getCargos);


module.exports = router;
