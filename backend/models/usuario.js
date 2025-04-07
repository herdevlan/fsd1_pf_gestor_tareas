'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Relación: un usuario tiene muchas tareas
      Usuario.hasMany(models.Tarea, { foreignKey: 'usuarioId' });
    }
  }

  Usuario.init({
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuario',
  });

  return Usuario;
};
