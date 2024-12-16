'use strict';

const sql = require('mssql');

const moment = require('moment');
const config = require('../db/db'); // Archivo de configuración para jwtSecretKey
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  console.log("req.body", req.body);
  req.body = req.body.body;

  const { rut, password } = req.body;

  try {
    const pool = await config.connect();
    const result = await pool.request()
    .input('rut', sql.VarChar, rut)
    .query(`
      SELECT u.id AS usuario_id, u.rut, u.email, u.password, b.id AS bombero_id, b.cargo_id
      FROM Usuario u
      INNER JOIN Bombero b ON u.bombero_id = b.id
      WHERE u.rut = @rut
    `);
  

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ success: false, msg: "Usuario o contraseña incorrectos" });
    }

    if (password !== user.password) {
      return res.status(401).json({ success: false, msg: "Usuario o contraseña incorrectos" });
    }

    const payload = {
      id: user.usuario_id,
      rut: user.rut,
      cargo_id: user.cargo_id,
      iat: moment().unix(),
      die: moment().add(24, 'hours').unix(),
    };

    const token = jwt.sign(payload, process.env.JWTSECRETKEY);

    return res.status(200).json({
      success: true,
      msg: "Usuario encontrado",
      data: {
        token,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ success: false, msg: "Error interno del servidor" });
  }
};



const revalidarToken = async (req, resp = response) => {
  const { uid, name } = req;
  //Generar un nuevo JWT
  const token = generarJWT(uid, name);

  return resp.json({
    ok: true,
    uid,
    name,
    token,
  });
};
module.exports = {
  login
};