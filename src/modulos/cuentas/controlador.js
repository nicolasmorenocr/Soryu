const db = require("../../DB/mysql")
//aqui e
// Aqui el controlador de las operaciones para todo el tema del login
const TABLA = 'cuentas';



function buscar(correo) {
    return db.buscar(TABLA, correo);
}
function eliminar(body) {
    return db.eliminar(TABLA, body);
}
function agregar(body) {
    return db.agregar(TABLA, body);
}
module.exports = {
    buscar,
    eliminar,
    agregar
}

