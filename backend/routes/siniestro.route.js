'use strict'

const { check } = require('express-validator');
const siniestroController = require('../controller/siniestro.controller');
var express = require('express');
var api = express.Router();
 const {validarJWT}=require('../middlewares/validar-jwt')
// Login de usuario
api.post('/addSiniestro' ,siniestroController.addSiniestro);
api.post('/deleteSiniestro', siniestroController.deleteSiniestro);
api.post('/updateSiniestro', siniestroController.updateSiniestro);

api.get('/getSiniestro', siniestroController.getSiniestro);


module.exports = api;