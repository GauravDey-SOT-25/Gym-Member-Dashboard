/* State and Storage Management */
import { STORAGE_KEY, USER_DATA_KEY, DEFAULT_USER_DATA } from "./constants.js";

// Theme Storage
export function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
}

export function getSavedTheme() {
  return localStorage.getItem(STORAGE_KEY);
}

// User & Metric Data Storage
export function saveUserData(data) {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
}

export function getUserData() {
  const data = localStorage.getItem(USER_DATA_KEY);
  if (!data) {
    // If no data exists, initialize defaults and save them
    saveUserData(DEFAULT_USER_DATA);
    return { ...DEFAULT_USER_DATA };
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Error decoding stored gym data: ", e);
    return { ...DEFAULT_USER_DATA };
  }
}
