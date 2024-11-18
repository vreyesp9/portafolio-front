require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/usuario.route');
const siniestroRoute = require('./routes/siniestro.route');
const cors = require('cors');


const db = require('./db/db');

// Inicializar la aplicación
const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY,X-Auth-Token, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});
app.use(express.json()); // Middleware para parsear cuerpos JSON

app.use(cors())
app.options('*', cors());  // Esto maneja las solicitudes OPTIONS

// Rutas
app.use('/usuario/', userRoutes);
app.use('/siniestro/', siniestroRoute);


// Verificar conexión a la base de datos
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
