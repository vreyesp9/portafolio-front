'use strict';

const siniestroController = require('../controller/siniestro.controller');
const express = require('express');
const api = express.Router();

api.post('/addSiniestro', siniestroController.createSiniestro); // Cambiado
api.delete('/deleteSiniestro/:id', siniestroController.deleteSiniestro);
api.put('/updateSiniestro', siniestroController.updateSiniestro);
api.get('/getSiniestros', siniestroController.getSiniestros); // Cambiado
api.get('/getTiposSiniestro', siniestroController.getTiposSiniestro);
api.get('/getComunas', siniestroController.getComunas);
api.get('/getBomberos', siniestroController.getBomberos);
api.get('/getUsuarios', siniestroController.getUsuarios);


module.exports = api;
