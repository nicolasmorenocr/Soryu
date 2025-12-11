const { Pool } = require("pg");
const config = require("../config");

// Configuración de la conexión
const dbconfig = {
  host: config.postgres.host,
  user: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
  port: config.postgres.port,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Crear el Pool
const pool = new Pool(dbconfig);

// Función para verificar conexión
function ConexionPostgres() {
  pool.connect((err, client, release) => {
    if (err) {
      console.error("[db err] Error conectando a Supabase:", err.stack);
      setTimeout(ConexionPostgres, 2000);
    } else {
      console.log("Conectado a la base de datos PostgreSQL/Supabase");
      release();
    }
  });
}

ConexionPostgres();

// --- FUNCIONES CRUD ---

async function agregar(tabla, datos) {
  // Generar columnas y placeholders ($1, $2, etc.)
  const columnas = Object.keys(datos).join(", ");
  const placeholders = Object.keys(datos)
    .map((_, i) => `$${i + 1}`)
    .join(", ");
  const valores = Object.values(datos);

  const query = `INSERT INTO ${tabla} (${columnas}) VALUES (${placeholders}) RETURNING *`;

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (err) {
    console.error("[db agregar] Error:", err.message);
    throw err;
  }
}

async function buscar(tabla, correo) {
  const query = `SELECT * FROM ${tabla} WHERE "correo" = $1`;
  const values = [correo];
  await pool.query(query, values);

  try {
    const resultado = await pool.query(query, [correo]);
    return resultado.rows;
  } catch (err) {
    console.error("[db buscar] Error:", err.message);
    throw err;
  }
}

async function eliminar(tabla, data) {
  const query = `DELETE FROM ${tabla} WHERE "uid" = $1`;

  try {
    const resultado = await pool.query(query, [data.id]);
    return resultado.rowCount;
  } catch (err) {
    console.error("[db eliminar] Error:", err.message);
    throw err;
  }
}

module.exports = {
  pool,
  agregar,
  buscar,
  eliminar,
};
