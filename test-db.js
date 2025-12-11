require("dotenv").config();
const cuentas = require("./src/modulos/cuentas/controlador");

async function probar() {
  try {
    console.log("---- Probando agregar usuario ----");

    const nuevo = await cuentas.agregar({
      user_name: "Usuario Test",
      correo: "test@example.com",
      password: "12345",
    });

    console.log("Usuario insertado correctamente:");
    console.log(nuevo);
  } catch (err) {
    console.error("ERROR DURANTE PRUEBA >>>", err);
  }
}

probar();
