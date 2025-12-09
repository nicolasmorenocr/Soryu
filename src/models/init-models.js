var DataTypes = require("sequelize").DataTypes;
var _dias = require("./dias");
var _dias_por_tarea = require("./dias_por_tarea");
var _entradas_de_usuarios = require("./entradas_de_usuarios");
var _tareas = require("./tareas");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var dias = _dias(sequelize, DataTypes);
  var dias_por_tarea = _dias_por_tarea(sequelize, DataTypes);
  var entradas_de_usuarios = _entradas_de_usuarios(sequelize, DataTypes);
  var tareas = _tareas(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);

  dias_por_tarea.belongsTo(dias, { as: "dium", foreignKey: "dia_id"});
  dias.hasMany(dias_por_tarea, { as: "dias_por_tareas", foreignKey: "dia_id"});
  dias_por_tarea.belongsTo(tareas, { as: "tarea", foreignKey: "tarea_id"});
  tareas.hasMany(dias_por_tarea, { as: "dias_por_tareas", foreignKey: "tarea_id"});
  entradas_de_usuarios.belongsTo(usuarios, { as: "uid_usuario", foreignKey: "uid"});
  usuarios.hasMany(entradas_de_usuarios, { as: "entradas_de_usuarios", foreignKey: "uid"});
  tareas.belongsTo(usuarios, { as: "uid_usuario", foreignKey: "uid"});
  usuarios.hasMany(tareas, { as: "tareas", foreignKey: "uid"});

  return {
    dias,
    dias_por_tarea,
    entradas_de_usuarios,
    tareas,
    usuarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
