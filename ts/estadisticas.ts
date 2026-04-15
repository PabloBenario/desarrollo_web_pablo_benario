/// <reference path="types.ts" />
/// <reference path="datos.ts" />
/// <reference path="common.ts" />

// Gráficos de indicadores usando Chart.js (cargado vía CDN).
// - Torta: distribución de miembros por tipo.
// - Tendencia (línea): cantidad de horarios de actividad por día de la semana.

declare const Chart: any;

(function () {
  const porTipo: Record<TipoMiembro, number> = {
    "estudiante-pregrado": 0,
    "estudiante-postgrado": 0,
    funcionario: 0,
    academico: 0,
  };
  MIEMBROS.forEach((m) => {
    porTipo[m.tipo]++;
  });

  const porDia: Record<DiaSemana, number> = {
    lunes: 0,
    martes: 0,
    miercoles: 0,
    jueves: 0,
    viernes: 0,
    sabado: 0,
    domingo: 0,
  };
  MIEMBROS.forEach((m) => {
    m.actividades.forEach((a) => {
      a.horarios.forEach((h) => {
        porDia[h.dia]++;
      });
    });
  });

  const canvasTipos = document.getElementById("grafico-tipos") as HTMLCanvasElement;
  const canvasDias = document.getElementById("grafico-dias") as HTMLCanvasElement;

  new Chart(canvasTipos, {
    type: "pie",
    data: {
      labels: (Object.keys(porTipo) as TipoMiembro[]).map((k) => ETIQUETAS_TIPO[k]),
      datasets: [
        {
          data: Object.values(porTipo),
          backgroundColor: ["#1abc9c", "#3498db", "#e67e22", "#9b59b6"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Miembros por tipo" },
      },
    },
  });

  new Chart(canvasDias, {
    type: "line",
    data: {
      labels: (Object.keys(porDia) as DiaSemana[]).map((k) => ETIQUETAS_DIA[k]),
      datasets: [
        {
          label: "Horarios de actividad",
          data: Object.values(porDia),
          borderColor: "#1abc9c",
          backgroundColor: "rgba(26, 188, 156, 0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Tendencia: horarios reportados por día de la semana",
        },
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
      },
    },
  });

  const resumen = document.getElementById("resumen-indicadores");
  if (resumen) {
    const totalMiembros = MIEMBROS.length;
    const totalActividades = MIEMBROS.reduce((acc, m) => acc + m.actividades.length, 0);
    const promedio = (totalActividades / totalMiembros).toFixed(1);
    resumen.innerHTML = `
      <li><strong>${totalMiembros}</strong> miembros registrados</li>
      <li><strong>${totalActividades}</strong> actividades reportadas</li>
      <li><strong>${promedio}</strong> actividades promedio por miembro</li>
    `;
  }
})();
