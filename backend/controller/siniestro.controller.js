'use strict';

const sql = require('mssql');

const moment = require('moment');
const config = require('../db/db'); // Archivo de configuración para `jwtSecretKey`

const addSiniestro = async (req, res) => {
  console.log("req.body", req.body);

  try {
    // Conectar a la base de datos
    const pool = await config.connect()
    const currentDate = new Date();

      req.body = req.body.body
    const result = await pool.request()
    .input('clave_referencia', sql.VarChar, req.body.clave_referencia)
    .input('fecha', sql.VarChar, req.body.fecha)  // Usamos la cadena para el campo DATETIME
    .input('hora', sql.VarChar, currentDate.toISOString() )
    .input('perdidas_materiales', sql.VarChar, req.body.perdidas_materiales)
    .input('afectados', sql.VarChar, req.body.afectados)
    .input('descripcion', sql.VarChar, req.body.descripcion)
    .input('implementos_utilizados', sql.VarChar, req.body.implementos_utilizados)
    .input('tipo_siniestro_id', sql.Int, req.body.tipo_siniestro_id)
    .input('comuna_id', sql.Int, req.body.comuna_id)
    .input('bombero_id', sql.Int, req.body.bombero_id)
    .input('usuario_id', sql.Int, req.body.usuario_id)

    .query(`
        INSERT INTO Siniestro(clave_referencia, fecha, hora, perdidas_materiales, 
            afectados, descripcion, implementos_utilizados, tipo_siniestro_id, comuna_id, bombero_id,usuario_id)
        VALUES (@clave_referencia, @fecha, @hora, @perdidas_materiales, 
                @afectados, @descripcion, @implementos_utilizados, @tipo_siniestro_id, @comuna_id, @bombero_id, @usuario_id)
    `);

    console.log('VALOR DE SINIESTRO',result)
    const dataResp = result.rowsAffected[0];





    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      msg: "Siniestro Creado Correctamente",
   
    });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).send({
      success: false,
      msg: "Ha ocurrido un problema al buscar el usuario, por favor intente más tarde",
    });
  }
};
const updateSiniestro = async (req, res) => {
    console.log("req.body", req.body);

    try {
      // Conectar a la base de datos
      const pool = await config.connect()
  
      // Realizar la consulta de actualización
      const result = await pool.request()
        .input('id', sql.Int, req.body.body.id) // Se asume que la columna `id` es la clave primaria
        .input('clave_referencia', sql.VarChar, req.body.body.clave_referencia)
        .input('fecha', sql.VarChar, req.body.body.fecha)  // Usamos la cadena para el campo DATETIME
        .input('hora', sql.VarChar, req.body.body.hora)
        .input('perdidas_materiales', sql.VarChar, req.body.body.perdidas_materiales)
        .input('afectados', sql.VarChar, req.body.body.afectados)
        .input('descripcion', sql.VarChar, req.body.body.descripcion)
        .input('implementos_utilizados', sql.VarChar, req.body.body.implementos_utilizados)
        .input('tipo_siniestro_id', sql.Int, req.body.body.tipo_siniestro_id)
        .input('comuna_id', sql.Int, req.body.body.comuna_id)
        .input('bombero_id', sql.Int, req.body.body.bombero_id)
        .input('usuario_id', sql.Int, req.body.bodys.usuario_id)
  
        
        .query(`
          UPDATE Siniestro
          SET
            clave_referencia = @clave_referencia,
            fecha = @fecha,
            hora = @hora,
            perdidas_materiales = @perdidas_materiales,
            afectados = @afectados,
            descripcion = @descripcion,
            implementos_utilizados = @implementos_utilizados,
            tipo_siniestro_id = @tipo_siniestro_id,
            comuna_id = @comuna_id,
            bombero_id = @bombero_id,
            usuario_id = @usuario_id
          WHERE id = @id
      `);
  // Verificar si se actualizó al menos una fila
  console.log('res',result)
  if (result.rowsAffected[0] > 0) {
    return res.status(200).json({
      success: true,
      msg: "Siniestro actualizado correctamente",
      data: req.body, // Retorna los datos enviados en la solicitud
    });
  } else {
    return res.status(404).json({
      success: false,
      msg: "No se encontró el siniestro con el ID proporcionado",
    });
  }

    } catch (error) {
      console.error("Error al actualizar siniestro:", error);
      return res.status(500).send({
        success: false,
        msg: "Ha ocurrido un problema al actualizar el siniestro, por favor intente más tarde",
      });
    }
  };
  
const deleteSiniestro = async (req, res) => {
  const { id } = req.body; // Obtén el parámetro 'id' desde el cuerpo de la solicitud
  console.log('ID recibido:', id);
    try {
      // Conectar a la base de datos
      const pool = await config.connect()
     console.log('req',req.id)
      // Realizar la consulta de eliminación
      const result = await pool.request()
        .input('id', sql.Int, id) // Se asume que la columna `id` es la clave primaria
        .query(`
          DELETE FROM Siniestro
          WHERE id = @id
      `);
  
      if (result.rowsAffected[0] === 0) {
        // Si no se encontraron filas afectadas, significa que el ID no existe
        return res.status(404).json({
          success: false,
          msg: "No se encontró un siniestro con el ID proporcionado"
        });
      }
  
      // Verificar si se actualizó al menos una fila
    if (result.rowsAffected[0] > 0) {
      return res.status(200).json({
        success: true,
        msg: "Siniestro actualizado correctamente",
        data: req.body, // Retorna los datos enviados en la solicitud
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "No se encontró el siniestro con el ID proporcionado",
      });
    }

  
    } catch (error) {
      console.error("Error al eliminar siniestro:", error);
      return res.status(500).send({
        success: false,
        msg: "Ha ocurrido un problema al eliminar el siniestro, por favor intente más tarde",
      });
    }
  };
  

  const getSiniestro = async (req, res) => {
    console.log("req.body", req.body);
  
    try {
      // Conectar a la base de datos
      const pool = await config.connect()
  
      // Realizar la consulta de eliminación
      const result = await pool.request()
        .query(`
          SELECT * FROM Siniestro
      `);
  
 
      console.log('Resultado de la eliminación', result.recordset);
  
      // Respuesta exitosa
      return res.status(200).json({
        success: true,
         body: result.recordset,
        msg: "Siniestro listado",
      });
  
    } catch (error) {
      console.error("Error al eliminar siniestro:", error);
      return res.status(500).send({
        success: false,
        msg: "Ha ocurrido un problema al eliminar el siniestro, por favor intente más tarde",
      });
    }
  };
  


module.exports = {
  addSiniestro,
  updateSiniestro,
  deleteSiniestro,
  getSiniestro
};
