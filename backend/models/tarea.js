'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tarea extends Model {
    static associate(models) {
      // Relación: una tarea pertenece a un usuario
      Tarea.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    }
  }

  Tarea.init({
    titulo: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    estado: DataTypes.STRING,
    fechaLimite: DataTypes.DATE,
    usuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tarea',
  });

  return Tarea;
};