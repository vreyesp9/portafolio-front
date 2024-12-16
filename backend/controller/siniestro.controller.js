const sql = require('mssql');
const config = require('../db/db');

// Listar todos los siniestros
const getSiniestros = async (req, res) => {
  try {
    const pool = await config.connect();
    const result = await pool.request().query(`
SELECT 
    s.id, 
    s.clave_referencia, 
    s.fecha, 
    s.hora, 
    s.perdidas_materiales, 
    s.afectados, 
    s.implementos_utilizados,
    s.tipo_siniestro_id, 
    t.nombre_tipo_siniestro, 
    c.nombre_comuna AS nombre_comuna, 
    b.nombres AS nombres, 
    u.rut AS rut, 
    s.descripcion
FROM Siniestro s
JOIN TipoSiniestro t ON s.tipo_siniestro_id = t.id
JOIN Comuna c ON s.comuna_id = c.id
JOIN Bombero b ON s.bombero_id = b.id
JOIN Usuario u ON s.usuario_id = u.id;
    `);
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error al listar siniestros:', error);
    res.status(500).json({ success: false, message: 'Error al listar siniestros' });
  }
};

// Crear un nuevo siniestro
const createSiniestro = async (req, res) => {
  const {
    clave_referencia,
    fecha,
    hora,
    perdidas_materiales,
    afectados,
    implementos_utilizados,
    tipo_siniestro_id,
    comuna_id,
    bombero_id,
    usuario_id,
    descripcion,
  } = req.body;

  if (
    !clave_referencia ||
    !fecha ||
    !hora ||
    !perdidas_materiales ||
    !afectados ||
    !implementos_utilizados ||
    !tipo_siniestro_id ||
    !comuna_id ||
    !bombero_id ||
    !usuario_id ||
    !descripcion
  ) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
  }

  try {
    const pool = await config.connect();
    await pool.request()
      .input('clave_referencia', sql.VarChar, clave_referencia)
      .input('fecha', sql.Date, fecha)
      .input('hora', sql.VarChar, hora)
      .input('perdidas_materiales', sql.VarChar, perdidas_materiales)
      .input('afectados', sql.VarChar, afectados)
      .input('implementos_utilizados', sql.VarChar, implementos_utilizados)
      .input('tipo_siniestro_id', sql.Int, tipo_siniestro_id)
      .input('comuna_id', sql.Int, comuna_id)
      .input('bombero_id', sql.Int, bombero_id)
      .input('usuario_id', sql.Int, usuario_id)
      .input('descripcion', sql.VarChar, descripcion)
      .query(`
        INSERT INTO Siniestro (
          clave_referencia, 
          fecha, 
          hora, 
          perdidas_materiales, 
          afectados, 
          implementos_utilizados, 
          tipo_siniestro_id, 
          comuna_id, 
          bombero_id, 
          usuario_id, 
          descripcion
        )
        VALUES (
          @clave_referencia, 
          @fecha, 
          @hora, 
          @perdidas_materiales, 
          @afectados, 
          @implementos_utilizados, 
          @tipo_siniestro_id, 
          @comuna_id, 
          @bombero_id, 
          @usuario_id, 
          @descripcion
        )
      `);
    res.json({ success: true, message: 'Siniestro creado exitosamente' });
  } catch (error) {
    console.error('Error al crear siniestro:', error);
    res.status(500).json({ success: false, message: 'Error al crear siniestro' });
  }
};

// Actualizar un siniestro existente
const updateSiniestro = async (req, res) => {
  const {
    id,
    clave_referencia,
    fecha,
    hora,
    perdidas_materiales,
    afectados,
    implementos_utilizados,
    tipo_siniestro_id,
    comuna_id,
    bombero_id,
    usuario_id,
    descripcion,
  } = req.body;

  if (
    !id ||
    !clave_referencia ||
    !fecha ||
    !hora ||
    !perdidas_materiales ||
    !afectados ||
    !implementos_utilizados ||
    !tipo_siniestro_id ||
    !comuna_id ||
    !bombero_id ||
    !usuario_id ||
    !descripcion
  ) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
  }

  try {
    const pool = await config.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .input('clave_referencia', sql.VarChar, clave_referencia)
      .input('fecha', sql.Date, fecha)
      .input('hora', sql.VarChar, hora)
      .input('perdidas_materiales', sql.VarChar, perdidas_materiales)
      .input('afectados', sql.VarChar, afectados)
      .input('implementos_utilizados', sql.VarChar, implementos_utilizados)
      .input('tipo_siniestro_id', sql.Int, tipo_siniestro_id)
      .input('comuna_id', sql.Int, comuna_id)
      .input('bombero_id', sql.Int, bombero_id)
      .input('usuario_id', sql.Int, usuario_id)
      .input('descripcion', sql.VarChar, descripcion)
      .query(`
        UPDATE Siniestro
        SET 
          clave_referencia = @clave_referencia,
          fecha = @fecha,
          hora = @hora,
          perdidas_materiales = @perdidas_materiales,
          afectados = @afectados,
          implementos_utilizados = @implementos_utilizados,
          tipo_siniestro_id = @tipo_siniestro_id,
          comuna_id = @comuna_id,
          bombero_id = @bombero_id,
          usuario_id = @usuario_id,
          descripcion = @descripcion
        WHERE id = @id
      `);
    res.json({ success: true, message: 'Siniestro actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar siniestro:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar siniestro' });
  }
};

// Eliminar un siniestro
const deleteSiniestro = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID es requerido' });
  }

  try {
    const pool = await config.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Siniestro WHERE id = @id');
    res.json({ success: true, message: 'Siniestro eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar siniestro:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar siniestro' });
  }
};

const getTiposSiniestro = async (req, res) => {
  try {
    const pool = await config.connect();
    const result = await pool.request().query(`
      SELECT id, nombre_tipo_siniestro
      FROM TipoSiniestro
    `);
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error al listar tipos de siniestro:', error);
    res.status(500).json({ success: false, message: 'Error al listar tipos de siniestro' });
  }
};

const getComunas = async (req, res) => {
  try {
    const pool = await config.connect();
    const result = await pool.request().query('SELECT id, nombre_comuna FROM Comuna');
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error al obtener comunas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener comunas' });
  }
};

const getBomberos = async (req, res) => {
  try {
    const pool = await config.connect();
    const result = await pool.request().query(`
      SELECT id, nombres, apellidos FROM Bombero
    `);
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error al obtener bomberos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener bomberos' });
  }
};

const getUsuarios = async (req, res) => {
  try {
    const pool = await config.connect();
    const result = await pool.request().query('SELECT id, email FROM Usuario');
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
  }
};

module.exports = {
  getSiniestros,
  createSiniestro,
  updateSiniestro,
  deleteSiniestro,
  getTiposSiniestro,
  getComunas,
  getBomberos,
  getUsuarios,
};
