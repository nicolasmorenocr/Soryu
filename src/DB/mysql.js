const mysql = require("mysql");

const config = require("../config");

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

let conexion;
//Funcion para crear la conexion con la base de datos
function ConexionMysql() {

    conexion = mysql.createConnection(dbconfig);
    //manejador de errores al intentar conectar
    conexion.connect((err) => {
        if (err) {
            console.log('[db err]', err);
            setTimeout(ConexionMysql, 200);
        } else {
            console.log("Conectado a la base de datos");
        }
    });
    //manejador de error durante la conexio
    conexion.on('error', (err) => {
        console.log('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION LOST') {
            ConexionMysql();
        } else {
            throw err;
        }
    })
}
// funciones de manejo de base de datos

function buscar(tabla, correo) {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM ' + tabla + ' WHERE Correo= ?', correo, (err, resultados) => {
            if (err) {
                reject(err);
            } else {
                resolve(resultados);
            }
        })

    })

}

function agregar(tabla, datos) {
    return new Promise((resolve, reject) => {
        conexion.query('INSERT INTO ' + tabla + ' SET ?', datos, (err, resultados) => {
            if (err) {
                console.log('Llegamos a la base de datos, pero hubo un error POST body:', datos);
                reject(err);
            } else {
                resolve(resultados);
            }
        })
    })

}

function eliminar(tabla, data) {
    return new Promise((resolve, reject) => {
        conexion.query('DELETE FROM ' + tabla + ' WHERE U_id= ?', data.id, (err, resultados) => {
            if (err) {
                reject(err);
            } else {
                resolve(resultados);
            }
        })

    })


}
ConexionMysql();
module.exports = {
    buscar,
    agregar,
    eliminar
}