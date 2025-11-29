exports.succes = function (req, res, mensaje, status) {
    const statuscode = status || 200;
    const mensajeok = mensaje || "Ok";
    res.status(statuscode).send({

        error: false,
        status: statuscode,
        body: mensaje
    });
}
exports.error = function (req, res, mensaje, status) {
    const statuscode = status || 200;
    const mensajeerror = mensaje || "Error interno";
    res.status(statuscode).send({
        error: true,
        status: statuscode,
        body: mensaje
    });
}