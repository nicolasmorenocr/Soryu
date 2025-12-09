

const formulario = document.querySelector(".formulario");
const fuffy = document.querySelector("#fuffy");
const buttonRegister = document.querySelector("#button-register");
const RegisterPopup = document.querySelector("#RegistroPopup");
const buttonCancRegister = document.querySelector("#Cancel-Register");
const buttonLogin = document.querySelector("#button-login");
const buttonSendRegister = document.querySelector("#Send-Register");

// funciones para ocultar todo lo necesario cuando el login se completa, y para volver a mostrarlo al cerrar sesion 
function init(uid) {
    localStorage.setItem("uid", uid);
    window.location.href = "/api/cuentas/menu";
}
//función para logearse
buttonLogin.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        let CurrentUser = localStorage.getItem("uid");
        if (CurrentUser) {
            localStorage.removeItem("uid");
        }
        const usuario = await buscarUsuario();
        let contraseña = document.querySelector("#password").value;

        if (!usuario || contraseña !== usuario.password) {
            alert("Correo o contraseña incorrectas");
            return;
        }
        else {
            init(usuario.uid);
        }

    } catch (err) {
        console.error("Error al buscar usuario:", err);
    }
})
function reset() {
    formulario.classList.remove("hidden");
    fuffy.classList.add("hidden");
}
// funcion para hacer aparecer el popup de registro
buttonRegister.addEventListener("click", (e) => {

    e.preventDefault();
    RegisterPopup.classList.add("RegistroPopup");
    RegisterPopup.showModal();


})
//funcion para cerrar el popup de registro
buttonCancRegister.addEventListener("click", (e) => {
    e.preventDefault();
    RegisterPopup.classList.remove("RegistroPopup");
    RegisterPopup.close();
})

// funcion para enviar el los datos de registro a la base de datos
buttonSendRegister.addEventListener("click", (e) => {
    e.preventDefault();
    try {
        let username = document.querySelector("#Input-Username").value;
        let email = document.querySelector("#Input-Email").value;
        let password = document.querySelector("#Input-Password").value;
        if (!username || !email || !password) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const datosUsuario = {
            password: password,
            user_name: username,
            correo: email,
            edad: 3,
            genero_id: 1
        };

        guardarUsuario(datosUsuario);

    } catch (err) {
        console.error("Error al capturar datos del formulario:", err);
        mensajeRegistroDiv.textContent = 'Error interno del formulario.';
    }
})


// ----------------------------------------------------

// Funcion para buscar un usuario en la base de datos
async function buscarUsuario() {
    const CorreoUsuario = document.querySelector("#email").value
    const url = `http://localhost:4000/api/cuentas/${CorreoUsuario}`;


    try {
        console.log(`Intentando buscar usuario ${CorreoUsuario} en: ${url}`);

        const response = await fetch(url);

        const data = await response.json();
        if (data.body.length === 0) {
            return null
        }

        console.log(`--RESPUESTA DEL SERVER --`);
        if (data.error === false) {
            // Imprime los datos del usuario en la consola
            console.log('Datos recuperados correctamente:', data.body);
            console.log(data.body[0])
            return data.body[0];
        } else {
            // Imprime el mensaje de error del servidor
            console.error('Error del Servidor:', data.body);
        }

    } catch (error) {
        // Imprime cualquier error de conexión
        console.error('Error de conexión con el servidor.', error);
    }
}
// funcion para 
async function guardarUsuario(data) {
    const url = `http://localhost:4000/api/cuentas/`;

    try {
        console.log("Datos a guardar:", data);
        console.log();
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const respuestaServer = await response.json();

        if (respuestaServer.error === false) {

            RegisterPopup.classList.remove("RegistroPopup");
            RegisterPopup.close();
        } else {
            console.error('Error del Servidor:', data.body);
        }

    } catch (error) {

        console.error("Error en fetch:", error);
    }
}

