const sql = require('mssql');

// Configuración de la conexión a SQL Server
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};
console.log("VALORES BD",dbConfig);


const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then((pool) => pool)
    .catch((err) => {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    });
console.log('POOOL PROMISE',poolPromise)
module.exports = {
    connect: () => poolPromise,
    sql,
};
