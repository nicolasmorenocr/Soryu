const express = require("express");

const respuesta = require("../../red/respuestas")

const controlador = require("./controlador");

const path = require('path');

//Las rutas pe
const router = express.Router();
//ruta para buscar los usuarios

//ruta para registrar los usuarios
router.post("/", agregar);

router.get("/menu", function (req, res) {
    // Ajusta los '../' según qué tan profundo esté este archivo respecto a 'public'
    const rutaDelArchivo = path.join(__dirname, '../../../public/menu.html');
    res.sendFile(rutaDelArchivo);
});

router.get("/:correo", buscar);
async function buscar(req, res) {
    try {
        const items = await controlador.buscar(req.params.correo);
        respuesta.succes(req, res, items, 200);

    } catch (err) {

        respuesta.error(req, res, err, 500);
    }
}

async function agregar(req, res) {
    console.log("Chamo 1")
    const datosrecibidos = req.body;
    console.log("Chamo 1")
    try {
        const agregados = await controlador.agregar(datosrecibidos);
        respuesta.succes(req, res, agregados, 201);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
}

module.exports = router;