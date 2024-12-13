const sql = require('mssql');
const config = require('../db/db');

// Listar todos los usuarios con sus datos de bombero
const getUsuarios = async (req, res) => {
  try {
    const pool = await config.connect();
    const result = await pool.request().query(`
      SELECT u.id, u.rut, u.email, u.password, b.nombres, b.apellidos, b.edad, c.nombre_cargo
      FROM Usuario u
      INNER JOIN Bombero b ON u.bombero_id = b.id
      INNER JOIN Cargo c ON b.cargo_id = c.id
    `);
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al listar usuarios' });
  }
};

// Crear un nuevo usuario
const createUsuario = async (req, res) => {
  const { rut, email, password, bombero_id } = req.body;
  if (!rut || !email || !password || !bombero_id) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
  }

  try {
    const pool = await config.connect();
    await pool.request()
      .input('rut', sql.VarChar, rut)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .input('bombero_id', sql.Int, bombero_id)
      .query(`
        INSERT INTO Usuario (rut, email, password, bombero_id)
        VALUES (@rut, @email, @password, @bombero_id)
      `);
    res.json({ success: true, message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ success: false, message: 'Error al crear usuario' });
  }
};

// Actualizar un usuario existente
const updateUsuario = async (req, res) => {
  const { id, rut, email, password, bombero_id } = req.body;
  if (!id || !rut || !email || !password || !bombero_id) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
  }

  try {
    const pool = await config.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .input('rut', sql.VarChar, rut)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .input('bombero_id', sql.Int, bombero_id)
      .query(`
        UPDATE Usuario
        SET rut = @rut, email = @email, password = @password, bombero_id = @bombero_id
        WHERE id = @id
      `);
    res.json({ success: true, message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
};

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await config.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Usuario WHERE id = @id');
    res.json({ success: true, message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
  }
};

module.exports = {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario
};
