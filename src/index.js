const app = require("./app");
//la plena no entendi bien esto para que, supongo que es para iniciar el servidor en el puerto que es
app.listen(app.get("port"), () => {
    console.log("Servidor escuchando en el puerto", app.get("port"));
});