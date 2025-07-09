const formulario = document.getElementById("formulario");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let dibujando = false;

function ajustarCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = 150;
}
ajustarCanvas();

canvas.addEventListener("mousedown", () => dibujando = true);
canvas.addEventListener("mouseup", () => dibujando = false);
canvas.addEventListener("mouseout", () => dibujando = false);
canvas.addEventListener("mousemove", dibujar);

function dibujar(e) {
  if (!dibujando) return;
  const rect = canvas.getBoundingClientRect();
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function limpiarFirma() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function obtenerSerialDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  const serial = params.get("serial");
  if (serial) {
    document.getElementById("serial").value = serial;
  }
}

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const estado = document.getElementById("estado");
  estado.innerText = "Enviando datos...";

  const data = new FormData(formulario);
  const firmaDataURL = canvas.toDataURL("image/png");
  data.append("firma", firmaDataURL);

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbyWGmajERR-nO3ss9zbjOnUmgZrb5rEI2LXllVUfhZJFOhmtlOcKWSdQoKHgb958vx2/exec", {
      method: "POST",
      body: data,
    });

    if (response.ok) {
      estado.innerText = "✅ Datos enviados correctamente.";
      formulario.reset();
      limpiarFirma();
    } else {
      estado.innerText = "❌ Error al enviar: " + response.statusText;
    }
  } catch (error) {
    estado.innerText = "❌ Error al enviar: " + error.message;
  }
});

obtenerSerialDesdeURL();
