const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dias', {
    dia_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dia: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'dias',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_dias",
        unique: true,
        fields: [
          { name: "dia_id" },
        ]
      },
    ]
  });
};
