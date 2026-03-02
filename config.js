const locales = {
  pt: {
    placeholder: "pesquisar...",
    settingsTitle: "configurações",
    textColor: "cor do texto",
    bgColor: "cor do fundo",
    closeBtn: "fechar"
  },
  en: {
    placeholder: "search...",
    settingsTitle: "settings",
    textColor: "text color",
    bgColor: "background color",
    closeBtn: "close"
  }
};

const userLang = navigator.language.startsWith("pt") ? "pt" : "en";
function applyLocale() {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = locales[userLang][key];
  });
}

const engines = [
  {
    name: "DuckDuckGo",
    url: "https://duckduckgo.com/",
    icon: "images/search_engines/duckduckgo.svg",
  },
  {
    name: "DuckDuckGo Lite",
    url: "https://lite.duckduckgo.com/lite/",
    icon: "images/search_engines/duckduckgo.svg",
  },
  {
    name: "Google",
    url: "https://www.google.com/search",
    icon: "images/search_engines/google.svg",
  },
  {
    name: "Brave Search",
    url: "https://search.brave.com/search",
    icon: "images/search_engines/brave.svg",
  },
];

const $ = (id) => document.getElementById(id);

const form = $("searchForm");
const input = $("searchInput");
const engineIcon = $("engineIcon");
const settingsBtn = $("settingsBtn");
const settingsPanel = $("settingsPanel");
const closeSettings = $("closeSettings");
const textColorPicker = $("textColorPicker");
const bgColorPicker = $("bgColorPicker");

let currentEngine = 0;

/* ===== INIT ===== */

loadSettings();
applyLocale();
updateEngine();
updatePlaceholder();

/* ===== ENGINE ===== */

function updateEngine() {
  const engine = engines[currentEngine];

  engineIcon.src = engine.icon;
  engineIcon.alt = engine.name;
  engineIcon.title = engine.name;

  form.action = engine.url;
  input.name = "q";

  updatePlaceholder();
}

function updatePlaceholder() {
  input.placeholder = `${locales[userLang].placeholder} (${engines[currentEngine].name})`;
}

function changeEngine(direction = 1) {
  currentEngine = (currentEngine + direction + engines.length) % engines.length;
  updateEngine();
  saveSettings();
}

/* Scroll + Click */
engineIcon.addEventListener("click", () => changeEngine(1));

engineIcon.addEventListener("wheel", (e) => {
  e.preventDefault();
  changeEngine(e.deltaY > 0 ? 1 : -1);
});

/* ===== SETTINGS ===== */

settingsBtn.onclick = () => settingsPanel.classList.toggle("hidden");
closeSettings.onclick = () => settingsPanel.classList.add("hidden");

textColorPicker.oninput = (e) => {
  document.documentElement.style.setProperty("--text-color", e.target.value);
  saveSettings();
};

bgColorPicker.oninput = (e) => {
  document.documentElement.style.setProperty("--bg-color", e.target.value);
  saveSettings();
};

/* ===== STORAGE ===== */

function saveSettings() {
  localStorage.setItem(
    "settings",
    JSON.stringify({
      engine: currentEngine,
      textColor: textColorPicker.value,
      bgColor: bgColorPicker.value,
    }),
  );
}

function loadSettings() {
  const saved = JSON.parse(localStorage.getItem("settings"));
  if (!saved) return;

  currentEngine = saved.engine ?? 0;

  if (saved.textColor) {
    document.documentElement.style.setProperty("--text-color", saved.textColor);
    textColorPicker.value = saved.textColor;
  }

  if (saved.bgColor) {
    document.documentElement.style.setProperty("--bg-color", saved.bgColor);
    bgColorPicker.value = saved.bgColor;
  }
}
