/**
 * Gym Member Dashboard - Settings Panel
 * Main Entry Point
 */

import { initThemeToggle } from './modules/theme.js';
import { renderSettingsTab } from './modules/settingsTab.js';

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Topbar Theme Toggle
    initThemeToggle();
    
    // Render and Initialize Settings Tab UI
    renderSettingsTab('settings-root');

});
