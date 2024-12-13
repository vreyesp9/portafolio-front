const sql = require('mssql');
const config = require('../db/db');

// Listar todos los bomberos
const getBomberos = async (req, res) => {
  try {
    const pool = await config.connect();
    const result = await pool.request().query(`
      SELECT id, rut, nombres, apellidos, edad, cargo_id, compania_id
      FROM Bombero
    `);
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error al listar bomberos:', error);
    res.status(500).json({ success: false, message: 'Error al listar bomberos' });
  }
};

// Crear un nuevo bombero
const createBombero = async (req, res) => {
  const { rut, nombres, apellidos, edad, cargo_id, compania_id } = req.body;

  if (!rut || !nombres || !apellidos || !edad || !cargo_id || !compania_id) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
  }

  try {
    const pool = await config.connect();
    await pool.request()
      .input('rut', sql.VarChar, rut)
      .input('nombres', sql.VarChar, nombres)
      .input('apellidos', sql.VarChar, apellidos)
      .input('edad', sql.Int, edad)
      .input('cargo_id', sql.Int, cargo_id)
      .input('compania_id', sql.Int, compania_id)
      .query(`
        INSERT INTO Bombero (rut, nombres, apellidos, edad, cargo_id, compania_id)
        VALUES (@rut, @nombres, @apellidos, @edad, @cargo_id, @compania_id)
      `);
    res.json({ success: true, message: 'Bombero creado exitosamente' });
  } catch (error) {
    console.error('Error al crear bombero:', error);
    res.status(500).json({ success: false, message: 'Error al crear bombero' });
  }
};

// Actualizar un bombero existente
const updateBombero = async (req, res) => {
  const { id, rut, nombres, apellidos, edad, cargo_id, compania_id } = req.body;

  if (!id || !rut || !nombres || !apellidos || !edad || !cargo_id || !compania_id) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
  }

  try {
    const pool = await config.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .input('rut', sql.VarChar, rut)
      .input('nombres', sql.VarChar, nombres)
      .input('apellidos', sql.VarChar, apellidos)
      .input('edad', sql.Int, edad)
      .input('cargo_id', sql.Int, cargo_id)
      .input('compania_id', sql.Int, compania_id)
      .query(`
        UPDATE Bombero
        SET rut = @rut, nombres = @nombres, apellidos = @apellidos, edad = @edad, 
            cargo_id = @cargo_id, compania_id = @compania_id
        WHERE id = @id
      `);
    res.json({ success: true, message: 'Bombero actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar bombero:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar bombero' });
  }
};

// Eliminar un bombero
const deleteBombero = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID es requerido' });
  }

  try {
    const pool = await config.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Bombero WHERE id = @id');
    res.json({ success: true, message: 'Bombero eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar bombero:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar bombero' });
  }
};

module.exports = {
  getBomberos,
  createBombero,
  updateBombero,
  deleteBombero
};
