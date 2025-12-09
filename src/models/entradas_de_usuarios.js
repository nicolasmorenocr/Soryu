const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('entradas_de_usuarios', {
    entrada_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'uid'
      }
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    contenido: {
      type: DataTypes.STRING(15000),
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'entradas_de_usuarios',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_entradas_de_usuarios",
        unique: true,
        fields: [
          { name: "entrada_id" },
        ]
      },
    ]
  });
};
