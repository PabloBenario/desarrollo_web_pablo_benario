(function () {
  if (typeof Chart === "undefined" || !window.DATOS_ESTADISTICAS) return;

  var datos = window.DATOS_ESTADISTICAS;
  var clavesTipo = Object.keys(datos.tipos);
  var clavesDia = Object.keys(datos.dias);

  new Chart(document.getElementById("grafico-tipos"), {
    type: "pie",
    data: {
      labels: clavesTipo.map(function (k) { return datos.etiquetasTipos[k]; }),
      datasets: [{
        data: clavesTipo.map(function (k) { return datos.tipos[k]; }),
        backgroundColor: ["#1abc9c", "#3498db", "#e67e22", "#9b59b6"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Miembros por tipo" }
      }
    }
  });

  new Chart(document.getElementById("grafico-dias"), {
    type: "line",
    data: {
      labels: clavesDia.map(function (k) { return datos.etiquetasDias[k]; }),
      datasets: [{
        label: "Horarios de actividad",
        data: clavesDia.map(function (k) { return datos.dias[k]; }),
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
        title: { display: true, text: "Tendencia: horarios reportados por día de la semana" }
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  });
})();
