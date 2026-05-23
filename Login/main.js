/**
 * LeapX Authentication Dashboard
 * Main Entry Point
 */

import { initAuth } from './modules/auth.js';

// HTML Template for Layout Shell
const layoutHtml = `
    <div class="auth-layout">
        <main class="form-panel">
            <div class="theme-toggle-container">
                <button id="theme-toggle" class="theme-toggle-btn" title="Toggle Theme">
                    <i class="ph ph-moon"></i>
                </button>
            </div>

            <div id="auth-root" class="auth-card"></div>
        </main>
    </div>

    <!-- Notification Toast Alerts -->
    <div id="auth-toast" class="toast">
        <i class="ph ph-info"></i>
        <span>Notification message here.</span>
    </div>
`;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Shell Layout
    const appEl = document.getElementById('app');
    if (appEl) {
        appEl.innerHTML = layoutHtml;
    }

    // 2. Initialize Theme Toggling
    initThemeToggler();

    // 3. Initialize Authentication Form Mounting & Interactions
    initAuth('auth-root');
});

/**
 * Handles Dark/Light Mode switching matching Settings theme variables
 */
function initThemeToggler() {
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Apply saved or default system theme
    const activeTheme = htmlEl.getAttribute('data-theme') || 'dark';
    htmlEl.setAttribute('data-theme', activeTheme);
    updateThemeIcon(themeBtn, activeTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlEl.setAttribute('data-theme', newTheme);
            updateThemeIcon(themeBtn, newTheme);
        });
    }
}

function updateThemeIcon(btn, theme) {
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (icon) {
        if (theme === 'light') {
            icon.className = 'ph ph-sun';
        } else {
            icon.className = 'ph ph-moon';
        }
    }
}
