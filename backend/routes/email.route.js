const express = require('express');
const router = express.Router();
const emailController = require('../controller/email.controller');

// Ruta para enviar el código de verificación
router.post('/send-reset-code', emailController.sendVerificationEmail);

// Ruta para verificar el código
router.post('/verify-reset-code', emailController.verifyResetCode);

// Ruta para restablecer la contraseña
router.post('/reset-password', emailController.resetPassword);

module.exports = router;
