/**
 * Gym Member Dashboard - Settings Panel
 * Main Entry Point
 */

import { initThemeToggle } from './modules/theme.js';
import { renderSettingsTab } from './modules/settingsTab.js';
import API from '../mock-api-data/data.js';

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

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication session
    const currentMemberId = localStorage.getItem('currentMemberId');
    if (!currentMemberId) {
        window.location.href = '../Login/index.html';
        return;
    }

    // Initialize Mock API for the logged-in member
    await API.init(currentMemberId);
    API.startRealtime();

    // Render the layout shell
    const appEl = document.getElementById('app');
    if (appEl) {
        // Construct dynamic layout shell with current state metrics
        const dynamicLayoutHtml = `
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
                    <div class="notifications" id="topbar-notifications" title="You have ${API.getUnreadCount()} notifications">
                        <i class="ph ph-bell"></i>
                        ${API.getUnreadCount() > 0 ? `<span class="badge" id="notif-badge">${API.getUnreadCount()}</span>` : ''}
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
        appEl.innerHTML = dynamicLayoutHtml;
    }

    // Render and Initialize Settings Tab UI first so elements are ready
    renderSettingsTab('settings-root');

    // Initialize Topbar Theme Toggle after layout and tabs are in DOM
    initThemeToggle();
});
