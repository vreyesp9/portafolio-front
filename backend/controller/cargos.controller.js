const sql = require('mssql');
const config = require('../db/db');

// Listar todos los cargos
const getCargos = async (req, res) => {
  try {
    const pool = await config.connect();
    const result = await pool.request().query(`
      SELECT id, nombre_cargo
      FROM Cargo
    `);
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error al listar cargos:', error);
    res.status(500).json({ success: false, message: 'Error al listar cargos' });
  }
};

module.exports = {
  getCargos
};
