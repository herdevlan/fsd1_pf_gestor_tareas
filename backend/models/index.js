'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  // Si use_env_variable está presente, usa la variable de entorno para conectarse
  const databaseUrl = process.env[config.use_env_variable];
  if (databaseUrl) {
    sequelize = new Sequelize(databaseUrl, config);
  } else {
    console.error('❌ DATABASE_URL no está definida en las variables de entorno');
    process.exit(1); // Detiene la ejecución si no se puede obtener la URL de la base de datos
  }
} else {
  // Si no se usa una variable de entorno, usa las credenciales proporcionadas directamente
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Verificar la conexión a la base de datos
sequelize.authenticate()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch((err) => console.error('❌ Error al conectar a PostgreSQL:', err));

// Cargar los modelos desde la carpeta actual
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Establecer las asociaciones entre los modelos
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
