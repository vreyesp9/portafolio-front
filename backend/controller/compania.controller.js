const sql = require('mssql');
const config = require('../db/db');

// Listar todas las compañías
const getCompanias = async (req, res) => {
  try {
    const pool = await config.connect();
    const result = await pool.request().query(`
      SELECT id, nombre_compania, ciudad_id
      FROM Compania
    `);
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error al listar compañías:', error);
    res.status(500).json({ success: false, message: 'Error al listar compañías' });
  }
};

module.exports = {
  getCompanias
};
