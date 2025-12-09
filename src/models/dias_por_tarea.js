const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dias_por_tarea', {
    dias_por_tarea_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dias',
        key: 'dia_id'
      }
    },
    tarea_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tareas',
        key: 'tarea_id'
      }
    }
  }, {
    sequelize,
    tableName: 'dias_por_tarea',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_dias_por_tarea",
        unique: true,
        fields: [
          { name: "dias_por_tarea_id" },
        ]
      },
    ]
  });
};
