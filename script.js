// alert("Puto el que lo lea");

// Año dinámico
document.getElementById("year").textContent = new Date().getFullYear();

// Menú móvil
const menuToggle = document.getElementById("menuToggle");
const navList = document.getElementById("navList");
if (menuToggle && navList) {
  menuToggle.addEventListener("click", () => {
    const shown = getComputedStyle(navList).display !== "none";
    navList.style.display = shown ? "none" : "flex";
    menuToggle.setAttribute("aria-expanded", String(!shown));
  });
}

// Comparador (contador simple)
let compareCount = 0;
const compareCountEl = document.getElementById("compareCount");
document.querySelectorAll(".btn-compare").forEach((btn) => {
  btn.addEventListener("click", () => {
    compareCount = Math.min(compareCount + 1, 3); // hasta 3
    if (compareCountEl) compareCountEl.textContent = String(compareCount);
    btn.classList.add("added");
    btn.textContent = "Añadido";
    setTimeout(() => {
      btn.classList.remove("added");
      btn.textContent = "Comparar";
    }, 1200);
  });
});

// Volver arriba
document.querySelectorAll(".to-top").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Mejora accesible: foco visible forzado en teclado
(function () {
  function handleFirstTab(e) {
    if (e.key === "Tab") {
      document.body.classList.add("user-is-tabbing");
      window.removeEventListener("keydown", handleFirstTab);
    }
  }
  window.addEventListener("keydown", handleFirstTab);
})();
