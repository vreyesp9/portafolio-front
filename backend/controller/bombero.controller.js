const sql = require('mssql');
const config = require('../db/db'); // Conexión a la base de datos

const getBomberoInfo = async (req, res) => {
  try {
    // RUT recibido en el cuerpo de la solicitud
    const bomberoRut = req.body.rut;

    if (!bomberoRut) {
      return res.status(400).json({ success: false, msg: 'El RUT es obligatorio' });
    }

    const pool = await config.connect(); // Conexión a la base de datos

    // Consulta para obtener los datos del bombero y su cargo
    const query = `
      SELECT 
        b.nombres,
        b.apellidos,
        c.nombre_cargo
      FROM Bombero b
      JOIN Cargo c ON b.cargo_id = c.id
      WHERE b.rut = @rut
    `;

    const result = await pool.request()
      .input('rut', sql.VarChar, bomberoRut)
      .query(query);

    const bombero = result.recordset[0]; // Toma el primer resultado

    if (!bombero) {
      return res.status(401).json({ success: false, msg: 'Bombero no encontrado' });
    }

    // Respuesta con la información del bombero
    return res.status(200).json({
      success: true,
      data: {
        nombres: bombero.nombres,
        apellidos: bombero.apellidos,
        cargo: bombero.nombre_cargo
      }
    });

  } catch (error) {
    console.error('Error al obtener información del bombero:', error);
    return res.status(500).json({ success: false, msg: 'Error interno del servidor' });
  }
};

module.exports = {
  getBomberoInfo
};
