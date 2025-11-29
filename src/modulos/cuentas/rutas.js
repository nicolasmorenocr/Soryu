const express = require("express");

const respuesta = require("../../red/respuestas")

const controlador = require("./controlador");

//Las rutas pe
const router = express.Router();
//ruta para buscar los usuarios
router.get("/:correo", buscar);
//ruta para registrar los usuarios
router.post("/", agregar);

async function buscar(req, res) {
    try {
        const items = await controlador.buscar(req.params.correo);
        respuesta.succes(req, res, items, 200);

    } catch (err) {

        respuesta.error(req, res, err, 500);
    }
}

async function agregar(req, res) {
    const datosrecibidos = req.body;
    try {
        const agregados = await controlador.agregar(datosrecibidos);
        respuesta.succes(req, res, agregados, 201);
    } catch (err) {
        respuesta.error(req, res, err, 500);
    }
}
module.exports = router;