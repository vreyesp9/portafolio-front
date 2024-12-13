require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Rutas
const userRoutes = require('./routes/usuario.route');
const siniestroRoute = require('./routes/siniestro.route');
const bomberoRoutes = require('./routes/bombero.route');
const usuarioMantenedorRoutes = require('./routes/usuarioMantedor.route');
const bomberoMatenedorRoutes = require('./routes/bomberoMantenedor.route');
const cargoRoute = require('./routes/cargo.route');
const companiaRoute = require('./routes/compania.route');
const emailRoutes = require('./routes/email.route');
const pythonRoutes = require('./routes/python.route');
const { runPythonScript } = require('./controller/python.controller');

// Base de datos
const db = require('./db/db');

// Inicializar la aplicación
const app = express();
const port = 3000;

// Middlewares
app.use(cors()); // Habilitar CORS para todas las solicitudes
app.use(bodyParser.json()); // Parsear cuerpos JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parsear cuerpos URL-encoded

// Servir archivos estáticos
const staticDir = path.join(__dirname, 'static');
app.use('/static', express.static(staticDir));

// Rutas
app.use('/usuario/', userRoutes);
app.use('/siniestro/', siniestroRoute);
app.use('/bombero/', bomberoRoutes);
app.use('/api/mantenedor', usuarioMantenedorRoutes);
app.use('/api/mantenedor2', bomberoMatenedorRoutes);
app.use('/api/cargos', cargoRoute);
app.use('/api/companias', companiaRoute);
app.use('/api/email', emailRoutes);
app.use('/api/python', pythonRoutes);
app.get('/api/python/run-python', runPythonScript);

// Base de datos: Verificar conexión y arrancar servidor
db.connect()
  .then(() => {
    console.log('Conectado a SQL Server');
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });
