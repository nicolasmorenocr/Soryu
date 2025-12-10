const express = require("express");
//lo usé para poder cargar public
const path = require("path");

const config = require("./config");
//llame cuentas al directorio donde esta todo lo de rutas y el controlador, 
// pq lo estoy usando para gestionar las rutas que tienen que ver con la
//base de datos y que tales
const cuentas = require("./modulos/cuentas/rutas");
const tareas = require("./modulos/cuentas/tareasRoutes");

app = express();


// configuración 
app.set("port", config.app.port);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//rutas
app.use('/api/cuentas', cuentas)
app.use('/api/tareas', tareas)
app.use('/Public', express.static(path.join(__dirname, 'Public')));
app.use(express.static(path.join(__dirname, '../Public'), {
    index: 'login.html'
}));
module.exports = app;