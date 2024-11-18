'use strict';

const sql = require('mssql');

const moment = require('moment');
const config = require('../db/db'); // Archivo de configuración para `jwtSecretKey`
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  console.log("req.body", req.body);
  req.body=req.body.body

  let { rut, password } = req.body;
  if (!rut) return res.send({ success: false, msg: "El rut es requerido" });
  if (!password) return res.send({ success: false, msg: "La contraseña es requerida" });



  console.log(rut, password);

  try {
    // Conectar a la base de datos
    const pool = await config.connect()

    // Buscar el usuario por RUT en la base de datos
    const result = await pool.request()
      .input('rut', sql.VarChar, rut)
      .query('SELECT * FROM Usuario WHERE rut = @rut');

    const user = result.recordset[0];

    console.log("Usuario encontrado:", user);

    if (!user) {
      return res.status(400).json({ success: false, msg: "Usuario o contraseña incorrectos" });
    }

    // Comparar contraseñas
    if (password.toString() === user.password.toString()) {
      var matchClave = true;
      
    } else {
      var matchClave = false;
    }

    console.log("Comparar contraseña:", matchClave);

    if (!matchClave) {
  
      return res.status(401).json({ success: false, msg: "Usuario o contraseña incorrecta" });
    }

    const payload = {
      id: user._id,
      rut: user.rut,
      iat: moment().unix(),
      die: moment().add(24, "hours").unix(),
    };
    const token = jwt.sign(payload, process.env.JWTSECRETKEY);


    return res.status(200).json({
      success: true,
      msg: "Usuario encontrado",
      data: {
        token: token,
        user: user.nombre,
      },
    });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).send({
      success: false,
      msg: "Ha ocurrido un problema al buscar el usuario, por favor intente más tarde",
    });
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
