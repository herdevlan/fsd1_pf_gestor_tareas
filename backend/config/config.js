require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USUARIO,
    password: process.env.DB_CONTRASENA,
    database: process.env.DB_NOMBRE,
    host: process.env.DB_HOST,
    port: process.env.DB_PUERTO,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Importante para Render
      },
    },
  }
};
