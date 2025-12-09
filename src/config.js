//configuracion de variables de entorno con dotenv
require("dotenv").config();
//configuraciones
//las variables estan en .env
module.exports = {
    app: {
        port: process.env.PORT,
    },
    postgres: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT, // Asegúrate de que el puerto sea el correcto (6543)
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
    }
};