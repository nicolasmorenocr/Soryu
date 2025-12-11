const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tareas', {
    tarea_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fecha_creacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'uid'
      }
    },
    repetible: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    fecha_limite: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    frecuencia: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tareas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_tareas",
        unique: true,
        fields: [
          { name: "tarea_id" },
        ]
      },
    ]
  });
};
