(async function () {
  if (typeof Chart === "undefined" || typeof axios === "undefined") return;
  if (!document.getElementById("grafico-miembros-dia")) return;

  var resp = await axios.get("/api/estadisticas");
  var datos = resp.data;
  var colores = ["#1abc9c", "#3498db", "#e67e22", "#9b59b6", "#e74c3c", "#f1c40f"];

  new Chart(document.getElementById("grafico-miembros-dia"), {
    type: "line",
    data: {
      labels: datos.miembrosPorDia.labels,
      datasets: [{
        label: "Miembros registrados",
        data: datos.miembrosPorDia.data,
        borderColor: "#1abc9c",
        backgroundColor: "rgba(26, 188, 156, 0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Miembros registrados por día" }
      },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });

  new Chart(document.getElementById("grafico-actividades-tipo"), {
    type: "pie",
    data: {
      labels: datos.actividadesPorTipo.labels,
      datasets: [{
        data: datos.actividadesPorTipo.data,
        backgroundColor: colores
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Actividades por tipo" }
      }
    }
  });

  new Chart(document.getElementById("grafico-actividades-comuna"), {
    type: "bar",
    data: {
      labels: datos.actividadesPorComuna.labels,
      datasets: [{
        label: "Actividades",
        data: datos.actividadesPorComuna.data,
        backgroundColor: "#3498db"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Actividades por comuna" }
      },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
})();
