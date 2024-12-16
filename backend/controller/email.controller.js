const nodemailer = require('nodemailer');
const sql = require('mssql');
const config = require('../db/db');

// Objeto temporal para almacenar códigos de verificación
const verificationCodes = {};

// Función para enviar el correo con el código de verificación
const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, msg: 'El correo es obligatorio' });
  }

  try {
    const pool = await config.connect();
    const query = `
      SELECT email
      FROM Usuario
      WHERE email = @correo
    `;

    const result = await pool.request()
      .input('correo', sql.VarChar, email)
      .query(query);

    if (!result.recordset.length) {
      return res.status(401).json({ success: false, msg: 'Correo no encontrado' });
    }

    // Generar un código de verificación aleatorio de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Almacenar el código temporalmente en memoria
    verificationCodes[email] = verificationCode;

    // Configurar el transportador de Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '6.5labsinfo@gmail.com',
        pass: 'kyzsqehxtwelthfs',
      },
    });

    // Configurar el correo
    const mailOptions = {
      from: '6.5labsinfo@gmail.com',
      to: email,
      subject: 'Código de verificación',
      html: `
<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
  <h2 style="color: #444; text-align: center;">Hola,</h2>
  <p style="font-size: 16px; text-align: center;">Tu código de verificación para cambiar tu contraseña es:</p>
  <p style="font-size: 28px; font-weight: bold; color: #ff0000; text-align: center; margin: 20px 0;">${verificationCode}</p>
  <p style="font-size: 14px; text-align: center; color: #555;">Si no solicitaste este código, por favor ignora este mensaje.</p>
  <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #666;">Saludos,<br><strong>Equipo de soporte</strong></p>
  <div style="text-align: center; margin-top: 20px;">
    <img src="https://i.ibb.co/ZTVwK0g/Logo-65.png" alt="Logo de la Empresa" style="width: 80px; border-radius: 4px;">
  </div>
</div>
      `,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, msg: 'Código de verificación enviado' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ success: false, msg: 'Error al enviar el correo', error });
  }
};

// Función para verificar el código de verificación
const verifyResetCode = (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, msg: 'Correo y código son obligatorios' });
  }

  const storedCode = verificationCodes[email];


  if (!storedCode) {
    return res.status(401).json({ success: false, msg: 'Código no encontrado o expirado' });
  }

  if (parseInt(code, 10) !== storedCode) {
    return res.status(400).json({ success: false, msg: 'El código ingresado no es válido' });
  }

  // Eliminar el código tras la verificación exitosa
  delete verificationCodes[email];

  res.status(200).json({ success: true, msg: 'Código verificado correctamente' });
};

// Función para restablecer la contraseña
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, msg: 'Correo y nueva contraseña son obligatorios' });
  }

  try {
    const pool = await config.connect();
    const query = `
      UPDATE Usuario
      SET password = @nueva_contrasena
      WHERE email = @correo
    `;

    const result = await pool.request()
      .input('nueva_contrasena', sql.VarChar, newPassword) // Recuerda encriptar la contraseña en una implementación real
      .input('correo', sql.VarChar, email)
      .query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(401).json({ success: false, msg: 'Correo no encontrado' });
    }

    res.status(200).json({ success: true, msg: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({ success: false, msg: 'Error al actualizar la contraseña', error });
  }
};

module.exports = {
  sendVerificationEmail,
  verifyResetCode,
  resetPassword,
};
