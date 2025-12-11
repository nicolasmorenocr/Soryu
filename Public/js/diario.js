// Obtener UID guardado en el login
const uid = localStorage.getItem("uid");

function setTodayDate() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("entryDate").value = today;
}

function setupEntryForm() {
  const btn = document.getElementById("addEntryBtn");
  btn.addEventListener("click", guardarEntrada);
}

async function guardarEntrada() {
  const fecha = document.getElementById("entryDate").value;
  const contenido = document.getElementById("entryContent").value;

  const titulo = document.getElementById("titleInput").value; // Puedes cambiarlo si quieres permitir títulos

  if (!contenido.trim()) {
    alert("La entrada no puede estar vacía.");
    return;
  }

  const res = await fetch("/api/diario/crear", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, fecha, contenido, titulo }),
  });

  const data = await res.json();

  if (data.ok) {
    alert("Entrada guardada");
    document.getElementById("entryContent").value = "";
    loadEntries();
  } else {
    alert("Error al guardar");
  }
}

async function loadEntries() {
  const res = await fetch(`/api/diario/${uid}`);
  const data = await res.json();

  const container = document.getElementById("entriesList");
  container.innerHTML = "";

  if (!data.ok) return;

  data.entradas.forEach((entry) => {
    const div = document.createElement("div");
    div.classList.add("entry-item");

    div.innerHTML = `
            <h3>${entry.titulo}</h3>
            <p><strong>${entry.fecha}</strong></p>
            <p>${entry.contenido}</p>
            <hr>
        `;
    container.appendChild(div);
  });
}
