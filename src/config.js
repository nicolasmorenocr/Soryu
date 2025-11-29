//configuracion de variables de entorno con dotenv
require("dotenv").config();
//configuraciones
//las variables estan en .env
module.exports = {
    app: {
        port: process.env.PORT,
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'ejemplo',
    }
};