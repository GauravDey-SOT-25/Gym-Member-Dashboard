/**
 * Gym Member Dashboard - Settings Panel
 * Main Entry Point
 */

import { initThemeToggle } from './modules/theme.js';
import { renderSettingsTab } from './modules/settingsTab.js';

// Default avatar image placeholder
const DEFAULT_AVATAR = 'avatar.png';


// HTML Template for Layout Shell
const layoutHtml = `
    <div class="dashboard-layout">
        <!-- Main Content -->
        <main class="main-content">
            <!-- Topbar -->
            <header class="topbar">
                <div class="topbar-left">
                    <div class="search-bar">
                        <i class="ph ph-magnifying-glass"></i>
                        <input type="text" placeholder="Search settings, features...">
                    </div>
                </div>
                <div class="topbar-right">
                    <button class="theme-toggle" id="theme-toggle" title="Toggle Theme">
                        <i class="ph ph-moon"></i>
                    </button>
                    <div class="notifications">
                        <i class="ph ph-bell"></i>
                        <span class="badge">3</span>
                    </div>
                    <div class="user-avatar">
                        <img src="${DEFAULT_AVATAR}" alt="User Avatar">
                    </div>
                </div>
            </header>

            <!-- Settings Content -->
            <div class="settings-container">
                <div class="settings-header">
                    <nav class="breadcrumb">
                        <a href="#">Dashboard</a> / <span>Settings</span>
                    </nav>
                    <h1>Settings</h1>
                </div>

                <div id="settings-root"></div>
            </div>
        </main>
    </div>

    <!-- Notification Toast -->
    <div class="toast" id="save-toast">
        <i class="ph ph-check-circle"></i>
        <span>Changes saved successfully.</span>
    </div>
`;

document.addEventListener('DOMContentLoaded', () => {
    // Render the layout shell
    const appEl = document.getElementById('app');
    if (appEl) {
        appEl.innerHTML = layoutHtml;
    }

    // Render and Initialize Settings Tab UI first so elements are ready
    renderSettingsTab('settings-root');

    // Initialize Topbar Theme Toggle after layout and tabs are in DOM
    initThemeToggle();
});
