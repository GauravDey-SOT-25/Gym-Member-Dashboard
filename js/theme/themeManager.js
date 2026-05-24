/* Theme State Engine Manager */
import { THEMES } from "../constants.js";
import { saveTheme, getSavedTheme } from "../storage.js";

const root = document.documentElement;

function getSystemTheme() {
  const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches;
  return isLightMode ? THEMES.LIGHT : THEMES.DARK;
}

function updateThemeButton(theme) {
  const button = document.querySelector("[data-theme-toggle]");

  if (!button) return;

  button.textContent = theme === THEMES.DARK ? "🌙 Dark" : "☀️ Light";
  button.setAttribute("aria-label", `Current theme is ${theme}`);
}

export function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  // Ensure we keep the light/dark on DOM element matching the theme attribute
  if (theme === THEMES.LIGHT) {
    root.classList.add("light");
    root.setAttribute("data-theme", "light");
  } else {
    root.classList.remove("light");
    root.setAttribute("data-theme", "dark");
  }
  saveTheme(theme);
  updateThemeButton(theme);
}

export function toggleTheme() {
  const currentTheme = root.getAttribute("data-theme") || THEMES.DARK;

  const nextTheme = currentTheme === THEMES.DARK
    ? THEMES.LIGHT
    : THEMES.DARK;

  applyTheme(nextTheme);
}

export function initializeTheme() {
  const savedTheme = getSavedTheme();
  const theme = savedTheme || getSystemTheme();

  applyTheme(theme);

  const button = document.querySelector("[data-theme-toggle]");

  if (button) {
    button.addEventListener("click", toggleTheme);
  }
}
