const express = require("express");
const router = express.Router();
const controlador = require("./controlador");

// Crear entrada
router.post("/crear", async (req, res) => {
  try {
    const nueva = await controlador.crearEntrada(req.body);

    res.json({
      ok: true,
      entrada: nueva,
    });
  } catch (err) {
    console.error("Error creando entrada:", err);
    res.json({ ok: false, error: err.message });
  }
});

// Listar entradas por usuario
router.get("/:uid", async (req, res) => {
  try {
    const uid = parseInt(req.params.uid);
    const entradas = await controlador.listarEntradas(uid);

    res.json({
      ok: true,
      entradas,
    });
  } catch (err) {
    console.error("Error listando entradas:", err);
    res.json({
      ok: false,
      error: err.message,
    });
  }
});

module.exports = router;
