const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuarioMantenedor.controller');


router.get('/usuariosL', usuarioController.getUsuarios); // Listar
router.post('/usuariosC', usuarioController.createUsuario); // Crear
router.put('/usuariosA', usuarioController.updateUsuario); // Actualizar
router.delete('/usuarios/:id', usuarioController.deleteUsuario); // Eliminar

module.exports = router;
