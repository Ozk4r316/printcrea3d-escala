
/* =====================================
   PRINTCREA3D SCALE
   Motor de cálculo actualizado
===================================== */

// ELEMENTOS PRINCIPALES
const realValue = document.getElementById("realValue");
const realUnit = document.getElementById("realUnit");
const scaleSelect = document.getElementById("scaleSelect");
const customScale = document.getElementById("customScale");
const customScaleGroup = document.getElementById("customScaleGroup");

const directResult = document.getElementById("directResult");
const directDetail = document.getElementById("directDetail");

const reductionResult = document.getElementById("reductionResult");
const reductionBarFill = document.getElementById("reductionBarFill");

const modelValue = document.getElementById("modelValue");
const inverseScale = document.getElementById("inverseScale");
const inverseResult = document.getElementById("inverseResult");
const inverseDetail = document.getElementById("inverseDetail");

const themeToggle = document.getElementById("themeToggle");
const connectionStatus = document.getElementById("connectionStatus");

// FORMATO DE NÚMEROS
function formatNumber(value, decimals = 2) {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

// OBTENER ESCALA DIRECTA
function getDirectScale() {
  return scaleSelect.value === "custom"
    ? Number(customScale.value)
    : Number(scaleSelect.value);
}

// =====================================
// CÁLCULO DIRECTO
// =====================================

function calculateDirect() {
  const value = Number(realValue.value);
  const scale = getDirectScale();

  if (
    realValue.value.trim() === "" ||
    !Number.isFinite(value) ||
    value <= 0 ||
    !Number.isFinite(scale) ||
    scale <= 0
  ) {
    directResult.textContent = "0,00";
    directDetail.textContent = "Introduce una medida y una escala válidas";
    reductionResult.textContent = "0 %";
    reductionBarFill.style.width = "0%";
    return;
  }

  // Convertir a milímetros
  const realMillimeters = value * (
    realUnit.value === "m" ? 1000 : 10
  );

  // Aplicar escala
  const result = realMillimeters / scale;

  // Calcular porcentaje de reducción
  const reduction = (1 - (1 / scale)) * 100;

  directResult.textContent = formatNumber(result);
  directDetail.textContent =
    `${formatNumber(realMillimeters)} mm reales ÷ ${scale} = ${formatNumber(result)} mm`;

  reductionResult.textContent = `${formatNumber(reduction)} %`;
  reductionBarFill.style.width =
    `${Math.max(0, Math.min(100, reduction))}%`;
}

realValue.addEventListener("input", calculateDirect);
realUnit.addEventListener("change", calculateDirect);

scaleSelect.addEventListener("change", () => {
  customScaleGroup.classList.toggle(
    "hidden",
    scaleSelect.value !== "custom"
  );

  calculateDirect();
});

customScale.addEventListener("input", calculateDirect);

// =====================================
// CÁLCULO INVERSO
// =====================================

function calculateInverse() {
  const value = Number(modelValue.value);
  const scale = Number(inverseScale.value);

  if (
    modelValue.value.trim() === "" ||
    inverseScale.value.trim() === "" ||
    !Number.isFinite(value) ||
    value <= 0 ||
    !Number.isFinite(scale) ||
    scale <= 0
  ) {
    inverseResult.textContent = "0,00";
    inverseDetail.textContent = "Introduce una medida y una escala válidas";
    return;
  }

  const realMillimeters = value * scale;
  const result = realMillimeters / 1000;

  inverseResult.textContent = formatNumber(result);
  inverseDetail.textContent =
    `${formatNumber(value)} mm × ${scale} = ${formatNumber(result)} m`;
}

modelValue.addEventListener("input", calculateInverse);
inverseScale.addEventListener("input", calculateInverse);

// =====================================
// CAMBIAR ENTRE PESTAÑAS
// =====================================

const tabs = document.querySelectorAll(".tab");
const directPanel = document.getElementById("directPanel");
const inversePanel = document.getElementById("inversePanel");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const mode = tab.dataset.mode;

    tabs.forEach(item => item.classList.remove("active"));
    tab.classList.add("active");

    directPanel.classList.toggle("hidden", mode !== "direct");
    inversePanel.classList.toggle("hidden", mode !== "inverse");
  });
});

// =====================================
// LIMPIAR ESCALA DIRECTA
// =====================================

document.getElementById("clearDirect").addEventListener("click", () => {
  realValue.value = "";
  customScale.value = "";

  calculateDirect();
  realValue.focus();
});

// =====================================
// LIMPIAR ESCALA INVERSA
// =====================================

document.getElementById("clearInverse").addEventListener("click", () => {
  modelValue.value = "";

  calculateInverse();
  modelValue.focus();
});

// =====================================
// TEMA CLARO Y OSCURO
// =====================================

function updateThemeButton() {
  themeToggle.textContent =
    document.body.classList.contains("light") ? "☾" : "☀";
}

const savedTheme = localStorage.getItem("printcrea-theme");

if (savedTheme === "light") {
  document.body.classList.add("light");
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  const theme = document.body.classList.contains("light")
    ? "light"
    : "dark";

  localStorage.setItem("printcrea-theme", theme);
  updateThemeButton();
});

// =====================================
// ESTADO DE CONEXIÓN
// =====================================

function updateConnectionStatus() {
  connectionStatus.textContent = navigator.onLine
    ? "● En línea"
    : "● Modo sin conexión";
}

window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);

updateConnectionStatus();

// =====================================
// REGISTRO PWA
// =====================================

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js");
      console.log("Printcrea3D Scale: PWA registrada correctamente");
    } catch (error) {
      console.error("Error al registrar la PWA:", error);
    }
  });
}

// CÁLCULO INICIAL
calculateDirect();
calculateInverse();
