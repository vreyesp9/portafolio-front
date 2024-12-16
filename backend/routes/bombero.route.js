'use strict';

const express = require('express');
const bomberoController = require('../controller/bombero.controller'); // Importa el controlador
const api = express.Router();

// Ruta para obtener información de un bombero por RUT
api.post('/info', bomberoController.getBomberoInfo);

// Exporta el router
module.exports = api;
