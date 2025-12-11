const db = require("../../DB/mysql");

const TABLA = "entradas_de_usuarios";

function crearEntrada({ uid, fecha, contenido, titulo }) {
  const datos = { uid, fecha, contenido, titulo };
  return db.agregar(TABLA, datos);
}

function listarEntradas(uid) {
  const query = `
        SELECT * FROM ${TABLA}
        WHERE uid = $1
        ORDER BY fecha DESC
    `;

  return db.pool.query(query, [uid]).then((res) => res.rows);
}

module.exports = {
  crearEntrada,
  listarEntradas,
};
