const express = require('express');
const router = express.Router();
const controller = require('./tareasController');

router.post('/', async (req, res) => {
    try {
        const nuevaTarea = await controller.crearTarea(req.body);    
        res.status(201).json(nuevaTarea);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/usuario/:uid', async (req, res) => {
    try {
        const tareas = await controller.listarPorUsuario(req.params.uid);
        res.status(200).json(tareas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } 
});
router.get('/:tarea_id', async (req, res) => {
    try {
        const tarea = await controller.obtenerPorId(req.params.tarea_id);
        if (tarea) {
            res.status(200).json(tarea);
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); 

router.get('/dias/listar', async (req, res) => {
    try {
        const dias = await controller.listarDias();
        res.status(200).json(dias);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:tarea_id', async (req, res) => {
    try {
        const tareaActualizada = await controller.actualizar(req.params.tarea_id, req.body);
        if (tareaActualizada) {
            res.status(200).json(tareaActualizada);
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.delete('/:tarea_id', async (req, res) => {
    try {
        const borrados = await controller.eliminar(req.params.tarea_id);
        if (borrados > 0) {
            res.status(200).json({ message: 'Tarea eliminada' });
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        const borrados = await controller.eliminar(req.body.tarea_ids);
        res.status(200).json({ message: `${borrados} tareas eliminadas` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;