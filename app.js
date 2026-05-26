// app.js - Central Application Orchestrator Module

import API from './js/data.js';
import { initAuth } from './js/auth.js';
import { createNavigation, updateSidebarProfile } from './js/navigation.js';
import { startRealtimeSimulation, stopRealtimeSimulation } from './js/realtime.js';
import { renderDashboardSkeleton, destroyQuoteRotation } from './js/skeleton.js';

// Tab views loading
import { renderDashboardHome, updateDashboardHomeUI } from './js/dashboard.js';
import { renderAnalyticsTab, handleThemeChangeInAnalytics, refreshAnalyticsStatsUI, destroyChart } from './js/analytics.js';
import { renderBookingsTab } from './js/bookings.js';
import { renderPerksTab, refreshPerksTabUI } from './js/perks.js';
import { renderSettingsTab } from './js/settings.js';

let currentActiveTab = 'Home';

document.addEventListener('DOMContentLoaded', () => {
    const savedAccent = localStorage.getItem('fitmatrix_accent_color') || '#D9FF00';
    document.documentElement.style.setProperty('--accent-primary', savedAccent);
    
    let accentText = '#FFFFFF';
    if (savedAccent === '#D9FF00' || savedAccent === '#00B4D8' || savedAccent === '#FF7900') {
        accentText = '#000000';
    }
    document.documentElement.style.setProperty('--accent-text', accentText);

    checkAuthSession();
});

// 1. Session checker
const checkAuthSession = () => {
    const loggedInUserId = localStorage.getItem('currentMemberId') || 'MBR-001';
    loadDashboard(loggedInUserId);
};

// 2. Load Auth View
const loadAuthPanel = () => {
    initAuth('app', (memberId) => {
        loadDashboard(memberId);
    });
};

// 3. Load Dashboard View
const loadDashboard = async (memberId) => {
    // Show the shimmer skeleton loader immediately
    renderDashboardSkeleton('app');

    // Trigger user data loading in the background
    const startTimestamp = Date.now();
    const active = await API.init(memberId);
    
    // Ensure the skeleton is shown for at least 1 second to prevent flashing and let quotes be read
    const elapsed = Date.now() - startTimestamp;
    const minLoadingTime = 1200;
    if (elapsed < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
    }

    // Clean up quote click listener
    destroyQuoteRotation();

    if (!active) {
        // If user data load failed, force login clear
        localStorage.removeItem('currentMemberId');
        loadAuthPanel();
        return;
    }

    const storedAvatar = localStorage.getItem(`fitmatrix_avatar_${memberId}`) || 'avatar.png';
    const themeApplied = localStorage.getItem('fitmatrix_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', themeApplied === 'system' ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : themeApplied);
    const savedAccent = localStorage.getItem('fitmatrix_accent_color') || '#D9FF00';
    document.documentElement.style.setProperty('--accent-primary', savedAccent);

    const activeAppliedTheme = document.documentElement.getAttribute('data-theme');
    let accentText = '#FFFFFF';
    if (savedAccent === '#D9FF00' || savedAccent === '#00B4D8' || savedAccent === '#FF7900') {
        accentText = '#000000';
    } else if (savedAccent === '#000000' || (activeAppliedTheme === 'light' && savedAccent === '#000000')) {
        accentText = '#FFFFFF';
    }
    document.documentElement.style.setProperty('--accent-text', accentText);

    const dashboardLayoutHtml = `
        <div class="dashboard-layout layout-fade-in">
            <!-- Sidebar Navigation (left column) -->
            <aside class="sidebar" id="sidebar"></aside>

            <!-- Main content pane -->
            <div class="main-content">
                <!-- Topbar -->
                <header class="topbar">
                    <div class="topbar-left">
                    </div>
                    <div class="topbar-right">
                        <button class="theme-toggle" id="theme-toggle" title="Toggle Theme">
                            <i class="ph ${themeApplied === 'light' ? 'ph-sun' : 'ph-moon'}"></i>
                        </button>
                        <button class="notifications" id="notif-bell-btn" title="Notifications">
                            <i class="ph ph-bell"></i>
                            <span class="badge" id="topbar-notif-badge" style="display: none;">0</span>
                        </button>
                        <div class="user-avatar" id="topbar-user-avatar-btn">
                            <img src="${storedAvatar}" alt="User Avatar" class="header-avatar-preview">
                        </div>
                    </div>
                </header>

                <!-- Notifications Dropdown Menu -->
                <div class="notif-dropdown" id="notif-dropdown">
                    <!-- Injected dynamically -->
                </div>

                <!-- Views section pane -->
                <main class="dashboard-views">
                    <div id="view-Home" class="view-section active"></div>
                    <div id="view-Data" class="view-section"></div>
                    <div id="view-Plan" class="view-section"></div>
                    <div id="view-Perks" class="view-section"></div>
                    <div id="view-Settings" class="view-section"></div>
                </main>
            </div>

            <!-- Responsive Floating Dock navigation for Mobile -->
            <div class="floating-dock" id="floatingDock"></div>
        </div>

        <!-- Global Action Saving Toast Notification -->
        <div class="toast" id="save-toast">
            <i class="ph ph-check-circle"></i>
            <span>Changes saved successfully.</span>
        </div>
    `;

    const appContainer = document.getElementById('app');
    if (appContainer) {
        appContainer.innerHTML = dashboardLayoutHtml;
    }

    // Wire up navigation
    createNavigation((tabName) => handleTabChange(tabName));

    // Wire up topbar controls
    setupTopbarControls();

    // Render views
    renderActiveViews();

    // Sync notifications badge initially
    updateNotificationsBadge();

    // Start background simulation ticks
    startRealtimeSimulation((updatePackage) => {
        handleRealtimeSimulationTick(updatePackage);
    });
};

// 4. Tab switching handler
const handleTabChange = (tabName) => {
    currentActiveTab = tabName;
    
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(sec => {
        if (sec.id === `view-${tabName}`) {
            sec.classList.add('active');
        } else {
            sec.classList.remove('active');
        }
    });

    // Re-render the active tab on tab selection to refresh visual components
    renderActiveViews();
};

// 5. Draw active tabs
const renderActiveViews = () => {
    // Destroy existing charts to prevent memory leaks and "Canvas already in use" errors
    destroyChart();

    if (currentActiveTab === 'Home') {
        renderDashboardHome('view-Home');
    } else if (currentActiveTab === 'Data') {
        renderAnalyticsTab('view-Data');
    } else if (currentActiveTab === 'Plan') {
        renderBookingsTab('view-Plan');
    } else if (currentActiveTab === 'Perks') {
        renderPerksTab('view-Perks');
    } else if (currentActiveTab === 'Settings') {
        renderSettingsTab('view-Settings', 
            () => handleLogout(), 
            () => handleThemeChangeInAnalytics()
        );
    }
};

// 6. Handle background real-time sync ticks
const handleRealtimeSimulationTick = (updatePackage) => {
    if (updatePackage.success) {
        // Update Home Tab
        updateDashboardHomeUI(updatePackage.data, updatePackage.data.animatePoints);
        
        // Update Notifications badge on topbar
        updateNotificationsBadge();

        // If active tab is Perks, refresh points lists
        if (currentActiveTab === 'Perks') {
            refreshPerksTabUI();
        }

        // If active tab is Data, refresh analytics cards numbers
        if (currentActiveTab === 'Data') {
            refreshAnalyticsStatsUI();
        }
    }
};

// 7. Sync topbar notifications badge
const updateNotificationsBadge = () => {
    const badge = document.getElementById('topbar-notif-badge');
    if (badge) {
        const count = API.getUnreadCount();
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
};

// 8. Wire up Topbar icons click events
const setupTopbarControls = () => {
    const themeBtn = document.getElementById('theme-toggle');
    const notifBtn = document.getElementById('notif-bell-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    const avatarBtn = document.getElementById('topbar-user-avatar-btn');

    // Header Theme Toggle (quick toggler)
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const htmlEl = document.documentElement;
            const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlEl.setAttribute('data-theme', newTheme);
            localStorage.setItem('fitmatrix_theme', newTheme);
            
            const icon = themeBtn.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'light' ? 'ph ph-sun' : 'ph ph-moon';
            }

            // Sync settings elements if currently viewed
            if (currentActiveTab === 'Settings') {
                renderSettingsTab('view-Settings', () => handleLogout(), () => handleThemeChangeInAnalytics());
            }

            // Sync Chart colors
            handleThemeChangeInAnalytics();
        });
    }

    // Notifications Dropdown toggle
    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('show');
            if (notifDropdown.classList.contains('show')) {
                renderNotificationsList();
            }
        });

        document.addEventListener('click', () => {
            notifDropdown.classList.remove('show');
        });
        
        notifDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Redirect user to Settings Tab if clicking user avatar
    if (avatarBtn) {
        avatarBtn.addEventListener('click', () => {
            const settingsNavBtn = document.querySelector('.nav-btn[data-tab="Settings"]');
            if (settingsNavBtn) settingsNavBtn.click();
            
            const settingsDockBtn = document.querySelector('.dock-btn[data-tab="Settings"]');
            if (settingsDockBtn) settingsDockBtn.click();
        });
    }
};

// 9. Render Notifications dropdown
const renderNotificationsList = () => {
    const dropdown = document.getElementById('notif-dropdown');
    if (!dropdown) return;

    const notifications = API.getNotifications();

    if (!notifications || notifications.length === 0) {
        dropdown.innerHTML = `
            <h3>Notifications</h3>
            <div class="empty-state" style="padding: 10px;">No alerts.</div>
        `;
        return;
    }

    dropdown.innerHTML = `
        <h3>
            <span>Alerts</span>
            <button id="btn-clear-all-notifs" style="font-size: 11px; color: var(--accent-primary); font-weight: 600;">Clear All</button>
        </h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            ${notifications.slice(0, 5).map(n => `
                <div class="notif-item ${n.read ? '' : 'unread'}" data-notif-id="${n.id}">
                    <div class="notif-item-header">
                        <span>${n.type.toUpperCase()}</span>
                        <span>Just Now</span>
                    </div>
                    <div class="notif-item-body">${n.message}</div>
                </div>
            `).join('')}
        </div>
    `;

    // Mark single read
    const items = dropdown.querySelectorAll('.notif-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            const notifId = parseInt(item.getAttribute('data-notif-id'));
            API.markRead(notifId);
            item.classList.remove('unread');
            updateNotificationsBadge();
        });
    });

    // Clear all
    const clearBtn = dropdown.querySelector('#btn-clear-all-notifs');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            API.clearNotifications();
            updateNotificationsBadge();
            dropdown.classList.remove('show');
        });
    }
};

// 10. Handle User Logout action
const handleLogout = () => {
    stopRealtimeSimulation();
    destroyChart();
    localStorage.removeItem('currentMemberId');
    
    const appContainer = document.getElementById('app');
    if (appContainer) {
        appContainer.classList.add('fade-slide-up');
    }
    
    loadAuthPanel();
};
