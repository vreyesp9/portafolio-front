'use strict'

const { check } = require('express-validator');
const usuarioController = require('../controller/usuario.controller');
var express = require('express');
var api = express.Router();

// Login de usuario
api.post('/login', usuarioController.login);


module.exports = api;