// js/settings.js

import API from './data.js';
import { updateSidebarProfile } from './navigation.js';

// Fallback toast trigger
const triggerGlobalToast = (message, isError = false) => {
    const toast = document.getElementById('save-toast');
    if (toast) {
        const text = toast.querySelector('span');
        if (text) text.textContent = message;
        
        const icon = toast.querySelector('i');
        if (icon) {
            icon.className = isError ? 'ph ph-x-circle' : 'ph ph-check-circle';
        }
        
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

const DEFAULT_AVATAR = 'avatar.png';

export function renderSettingsTab(containerId, onLogout, onThemeChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const member = API.getMember();
    const membership = API.getMembership();

    const nameParts = member?.name ? member.name.split(' ') : ['', ''];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    // Retrieve stored profile avatar base64 if it exists
    const storedAvatar = localStorage.getItem(`fitmatrix_avatar_${API.getCurrentUser()}`) || DEFAULT_AVATAR;

    container.innerHTML = `
        <div class="view-header">
            <h1>Portal Settings</h1>
            <p>Customize notifications, manage active session, and edit profile details.</p>
        </div>

        <div class="settings-layout">
            <!-- Left Side Settings Menu -->
            <nav class="settings-nav">
                <button class="settings-nav-item active" data-sec="profile">Profile Details</button>
                <button class="settings-nav-item" data-sec="notifications">Notifications</button>
                <button class="settings-nav-item" data-sec="appearance">Theme Mode</button>
                <button class="settings-nav-item" data-sec="logout">Session Logs</button>
            </nav>

            <!-- Right Side Settings Sections -->
            <div class="settings-sections">
                
                <!-- 1. Profile Details -->
                <section id="settings-profile" class="settings-section active">
                    <div class="settings-card">
                        <h2>Profile Settings</h2>
                        <p class="settings-card-subtitle">Manage public display details and avatar image.</p>
                        
                        <div class="profile-upload-area">
                            <img src="${storedAvatar}" alt="Profile avatar" class="profile-large" id="profile-preview" />
                            <input type="file" id="profile-image-input" accept="image/*" hidden />
                            <div class="upload-actions">
                                <button class="btn-secondary" id="upload-btn" type="button">
                                    <i class="ph ph-upload-simple"></i> Upload New
                                </button>
                                <button class="btn-text danger" id="remove-pic-btn" type="button">Remove</button>
                            </div>
                        </div>

                        <form id="profile-details-form">
                            <div class="form-group-row">
                                <div class="form-group">
                                    <label>First Name <span class="text-danger">*</span></label>
                                    <input type="text" id="profile-fname" value="${firstName}" class="pill-input" required>
                                </div>
                                <div class="form-group">
                                    <label>Last Name <span class="text-danger">*</span></label>
                                    <input type="text" id="profile-lname" value="${lastName}" class="pill-input" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Email Address <span class="text-danger">*</span></label>
                                <input type="email" id="profile-email" value="${member?.email || ''}" class="pill-input" required>
                            </div>
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="tel" id="profile-phone" value="${member?.phone || ''}" class="pill-input">
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-primary" id="profile-save-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>

                    <!-- Membership Card -->
                    <div class="settings-card" style="border-left: 4px solid var(--accent-primary);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <h3 style="font-size: 18px;">Plan Membership Info</h3>
                            <span class="class-badge premium" style="font-size: 11px;">Active</span>
                        </div>
                        <div class="divider" style="margin: 12px 0;"></div>
                        <div style="font-size: 14px; display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-secondary);">Active Tier</span>
                                <strong>${membership?.plan} Membership</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-secondary);">Expiry Date</span>
                                <strong>${membership?.expiryDate}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-secondary);">Countdown Days</span>
                                <strong class="text-success">${Math.ceil(membership?.daysRemaining || 0)} days remaining</strong>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 2. Notification Preferences -->
                <section id="settings-notifications" class="settings-section">
                    <div class="settings-card">
                        <h2>Notification Preferences</h2>
                        <p class="settings-card-subtitle">Select preferred methods of notification alerts.</p>
                        
                        <div class="toggle-list">
                            <div class="toggle-item">
                                <div class="toggle-info">
                                    <h4>Email Notifications</h4>
                                    <p>Receive weekly gym news digests and renewal invoices.</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" class="notif-toggle" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="toggle-item">
                                <div class="toggle-info">
                                    <h4>Trainer Workout Reminders</h4>
                                    <p>Get push alerts 30 minutes before your booked classes.</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" class="notif-toggle" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="toggle-item">
                                <div class="toggle-info">
                                    <h4>Membership & Payment Alerts</h4>
                                    <p>Receive notifications regarding Stripe subscription renewals.</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" class="notif-toggle" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="toggle-item">
                                <div class="toggle-info">
                                    <h4>Promotional Offers</h4>
                                    <p>Discounts on personal trainers and sports nutrition goods.</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" class="notif-toggle">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 3. Theme Settings -->
                <section id="settings-appearance" class="settings-section">
                    <div class="settings-card">
                        <h2>Theme Mode Settings</h2>
                        <p class="settings-card-subtitle">Choose interface theme matching your preference.</p>
                        
                        <div class="theme-selector">
                            <div class="theme-card" data-theme-val="dark">
                                <div class="theme-preview dark-preview"></div>
                                <span>Dark Mode</span>
                            </div>
                            <div class="theme-card" data-theme-val="light">
                                <div class="theme-preview light-preview"></div>
                                <span>Light Mode</span>
                            </div>
                            <div class="theme-card" data-theme-val="system">
                                <div class="theme-preview system-preview"></div>
                                <span>System Auto</span>
                            </div>
                        </div>
                    </div>

                    <div class="settings-card" style="margin-top: 24px;">
                        <h2>Accent Color Customization</h2>
                        <p class="settings-card-subtitle">Select a color to personalize buttons, links, and active states.</p>
                        
                        <div class="color-swatches-container">
                            <button class="color-swatch lime" data-color="#D9FF00" title="Lime Green"></button>
                            <button class="color-swatch purple" data-color="#9D4EDD" title="Royal Purple"></button>
                            <button class="color-swatch blue" data-color="#00B4D8" title="Neon Blue"></button>
                            <button class="color-swatch orange" data-color="#FF7900" title="Sunset Orange"></button>
                        </div>
                    </div>
                </section>

                <!-- 4. Session Logs & Logout -->
                <section id="settings-logout" class="settings-section">
                    <div class="settings-card">
                        <h2>Account Management</h2>
                        <p class="settings-card-subtitle">Switch profile accounts or log out of this session.</p>
                        
                        <div style="background-color: rgba(255, 77, 77, 0.05); border: 1px solid rgba(255, 77, 77, 0.2); padding: 20px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                            <div>
                                <strong>Switch Profile or Log Out</strong>
                                <p style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;">You can switch to another user or exit back to the login screen.</p>
                            </div>
                            <button class="btn-danger" id="logout-btn">
                                <i class="ph ph-sign-out"></i> Switch Profile
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    `;

    // Initialize sub-tab clicking
    setupSubNavigation(container);
    // Initialize profile form events
    setupProfileFormEvents(container);
    // Initialize notification switches toast
    setupNotificationEvents(container);
    // Initialize theme selection cards
    setupThemeSelectorEvents(container, onThemeChange);
    // Initialize color swatches
    setupColorSwatchEvents(container);
    // Initialize logout actions
    setupLogoutActions(container, onLogout);
}

function setupSubNavigation(container) {
    const navItems = container.querySelectorAll('.settings-nav-item');
    const sections = container.querySelectorAll('.settings-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            const targetSectionId = `settings-${item.getAttribute('data-sec')}`;
            sections.forEach(sec => {
                if (sec.id === targetSectionId) {
                    sec.classList.add('active');
                } else {
                    sec.classList.remove('active');
                }
            });
        });
    });
}

function setupProfileFormEvents(container) {
    const form = container.querySelector('#profile-details-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = container.querySelector('#profile-save-btn');
            
            const fname = container.querySelector('#profile-fname').value.trim();
            const lname = container.querySelector('#profile-lname').value.trim();
            const email = container.querySelector('#profile-email').value.trim();
            const phone = container.querySelector('#profile-phone').value.trim();

            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            setTimeout(() => {
                // Save profile details
                API.updateProfile(fname, lname, email, phone);
                
                // Sync sidebar layout profile box details
                updateSidebarProfile();

                // Update welcome heading on topbar if visible
                const topbarWelcomeName = document.getElementById('sidebar-user-name');
                if (topbarWelcomeName) {
                    topbarWelcomeName.textContent = `${fname} ${lname}`;
                }

                btn.textContent = originalText;
                btn.disabled = false;
                triggerGlobalToast('Profile details updated successfully.');
            }, 800);
        });
    }

    // Avatar upload interactions
    const profilePreview = container.querySelector('#profile-preview');
    const imageInput = container.querySelector('#profile-image-input');
    const uploadBtn = container.querySelector('#upload-btn');
    const removePicBtn = container.querySelector('#remove-pic-btn');

    if (uploadBtn && imageInput && profilePreview) {
        uploadBtn.addEventListener('click', () => imageInput.click());

        imageInput.addEventListener('change', () => {
            const file = imageInput.files?.[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                triggerGlobalToast('Please select a valid image file.', true);
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const base64Data = reader.result;
                profilePreview.src = base64Data;
                
                // Persist avatar per user in localStorage
                localStorage.setItem(`fitmatrix_avatar_${API.getCurrentUser()}`, base64Data);

                // Update topbar header avatar in real-time
                const topbarAvatars = document.querySelectorAll('.user-avatar img');
                topbarAvatars.forEach(img => {
                    img.src = base64Data;
                });

                triggerGlobalToast('Avatar image updated.');
            };
            reader.readAsDataURL(file);
        });
    }

    if (removePicBtn && profilePreview) {
        removePicBtn.addEventListener('click', () => {
            profilePreview.src = DEFAULT_AVATAR;
            localStorage.removeItem(`fitmatrix_avatar_${API.getCurrentUser()}`);
            
            // Sync topbar
            const topbarAvatars = document.querySelectorAll('.user-avatar img');
            topbarAvatars.forEach(img => {
                img.src = DEFAULT_AVATAR;
            });
            
            if (imageInput) imageInput.value = '';
            triggerGlobalToast('Avatar image removed.');
        });
    }
}

function setupNotificationEvents(container) {
    const switches = container.querySelectorAll('.notif-toggle');
    switches.forEach(sw => {
        sw.addEventListener('change', () => {
            triggerGlobalToast('Notification preferences synced.');
        });
    });
}

function setupThemeSelectorEvents(container, onThemeChange) {
    const themeCards = container.querySelectorAll('.theme-card');
    const htmlEl = document.documentElement;

    const currentThemeSetting = localStorage.getItem('fitmatrix_theme') || 'dark';
    themeCards.forEach(card => {
        if (card.getAttribute('data-theme-val') === currentThemeSetting) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            themeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const selectedTheme = card.getAttribute('data-theme-val');
            localStorage.setItem('fitmatrix_theme', selectedTheme);

            // Apply selected theme
            if (selectedTheme === 'system') {
                const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
                htmlEl.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
            } else {
                htmlEl.setAttribute('data-theme', selectedTheme);
            }

            // Sync topbar icons
            const activeApplied = htmlEl.getAttribute('data-theme');
            const topbarThemeIcons = document.querySelectorAll('#theme-toggle i');
            topbarThemeIcons.forEach(icon => {
                icon.className = activeApplied === 'light' ? 'ph ph-sun' : 'ph ph-moon';
            });

            triggerGlobalToast(`Theme updated to ${selectedTheme}.`);
            
            // Trigger callbacks in analytics to redraw charts with custom grid border values
            if (onThemeChange) onThemeChange();
        });
    });
}

function setupLogoutActions(container, onLogout) {
    const logoutBtn = container.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const originalContent = logoutBtn.innerHTML;
            logoutBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Exiting...';
            logoutBtn.disabled = true;

            setTimeout(() => {
                logoutBtn.disabled = false;
                logoutBtn.innerHTML = originalContent;
                onLogout();
            }, 800);
        });
    }
}

function setupColorSwatchEvents(container) {
    const swatches = container.querySelectorAll('.color-swatch');
    const savedAccent = localStorage.getItem('fitmatrix_accent_color') || '#D9FF00';

    swatches.forEach(swatch => {
        const colorVal = swatch.getAttribute('data-color');
        if (colorVal === savedAccent) {
            swatch.classList.add('active');
        } else {
            swatch.classList.remove('active');
        }

        swatch.addEventListener('click', () => {
            swatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');

            const newColor = swatch.getAttribute('data-color');
            document.documentElement.style.setProperty('--accent-primary', newColor);
            
            // Determine contrasting text color based on accent color selection
            let newText = '#FFFFFF';
            if (newColor === '#D9FF00' || newColor === '#00B4D8' || newColor === '#FF7900') {
                newText = '#000000';
            }
            document.documentElement.style.setProperty('--accent-text', newText);
            
            localStorage.setItem('fitmatrix_accent_color', newColor);
            
            triggerGlobalToast(`Accent color updated to ${swatch.getAttribute('title')}.`);
        });
    });
}
