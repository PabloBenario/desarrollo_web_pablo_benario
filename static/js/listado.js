(function () {
  document.querySelectorAll("tr[data-href]").forEach(function (fila) {
    fila.addEventListener("click", function () {
      window.location.href = fila.dataset.href;
    });
    fila.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.location.href = fila.dataset.href;
      }
    });
  });
})();
