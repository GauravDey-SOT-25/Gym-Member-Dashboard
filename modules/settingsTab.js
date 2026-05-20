/**
 * Settings Tab Module
 * Dynamically constructs and manages the UI for the Settings section.
 */
import { showToast } from './ui.js';

export const renderSettingsTab = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Define the HTML structure
    const html = `
        <div class="settings-layout">
            <!-- Settings Navigation -->
            <nav class="settings-nav" id="settings-nav">
                <a href="#profile" class="settings-nav-item active">Profile Settings</a>
                <a href="#notifications" class="settings-nav-item">Notification Preferences</a>
                <a href="#appearance" class="settings-nav-item">Theme Settings</a>
                <a href="#logout" class="settings-nav-item">Logout</a>
            </nav>

            <!-- Settings Sections -->
            <div class="settings-sections">
                
                <!-- 1. Profile Settings -->
                <section id="profile" class="settings-section active">
                    <div class="card">
                        <h2>Profile Settings</h2>
                        <p class="card-subtitle">Update your photo and personal details here.</p>
                        
                        <div class="profile-upload-area">
                            <img src="" alt="Profile" class="profile-large" id="profile-preview" />
                            <input type="file" id="profile-image-input" accept="image/*" hidden />
                            <div class="upload-actions">
                                <button class="btn-secondary" id="upload-btn" type="button">
                                    <i class="ph ph-upload-simple"></i> Upload new
                                </button>
                                <button class="btn-text danger" id="remove-pic-btn" type="button">Remove</button>
                            </div>
                        </div>

                        <form class="settings-form" id="profile-form">
                            <div class="form-group-row">
                                <div class="form-group">
                                    <label>First Name <span class="text-danger">*</span></label>
                                    <input type="text"  class="pill-input" required>
                                </div>
                                <div class="form-group">
                                    <label>Last Name <span class="text-danger">*</span></label>
                                    <input type="text"  class="pill-input" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Email Address <span class="text-danger">*</span></label>
                                <input type="email" value="abc@example.com" class="pill-input" required>
                            </div>
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="tel"  class="pill-input">
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-primary save-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </section>

                <!-- 2. Notification Preferences -->
                <section id="notifications" class="settings-section">
                    <div class="card">
                        <h2>Notification Preferences</h2>
                        <p class="card-subtitle">Choose what you want to be notified about.</p>
                        
                        <div class="toggle-list">
                            <div class="toggle-item">
                                <div class="toggle-info">
                                    <h4>Email notifications</h4>
                                    <p>Receive daily summaries and updates via email.</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" class="notif-toggle" checked>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            <div class="toggle-item">
                                <div class="toggle-info">
                                    <h4>Workout reminders</h4>
                                    <p>Get push notifications before your scheduled classes.</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" class="notif-toggle" checked>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            <div class="toggle-item">
                                <div class="toggle-info">
                                    <h4>Membership alerts</h4>
                                    <p>Notifications about renewals and payment issues.</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" class="notif-toggle" checked>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            <div class="toggle-item">
                                <div class="toggle-info">
                                    <h4>Promotional notifications</h4>
                                    <p>Receive offers and discounts for personal training.</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" class="notif-toggle">
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 3. Appearance / Theme Settings -->
                <section id="appearance" class="settings-section">
                    <div class="card">
                        <h2>Theme Settings</h2>
                        <p class="card-subtitle">Customize how LeapX looks on your device.</p>
                        
                        <div class="appearance-options">
                            <div class="option-group">
                                <h3>Interface Theme</h3>
                                <div class="theme-selector">
                                    <div class="theme-card js-theme-card active" data-theme-val="dark">
                                        <div class="theme-preview dark-preview"></div>
                                        <span>Dark</span>
                                    </div>
                                    <div class="theme-card js-theme-card" data-theme-val="light">
                                        <div class="theme-preview light-preview"></div>
                                        <span>Light</span>
                                    </div>
                                    <div class="theme-card js-theme-card" data-theme-val="system">
                                        <div class="theme-preview system-preview"></div>
                                        <span>System</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 4. Logout Section -->
                <section id="logout" class="settings-section">
                    <div class="card">
                        <h2>Session Management</h2>
                        <p class="card-subtitle">Manage your current session.</p>
                        
                        <div class="danger-zone mt-20">
                            <h3>Log Out </h3>
                            <div class="action-row">
                                <div>
                                    <strong>End Current Session</strong>
                                    <p>You will be required to enter your credentials next time you log in.</p>
                                </div>
                                <button class="btn-danger" id="logout-btn">
                                    <i class="ph ph-sign-out"></i> Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    `;

    // Inject HTML
    container.innerHTML = html;

    // Initialize Interactions
    initTabNavigation(container);
    initProfileForm(container);
    initNotificationToggles(container);
    initThemeSelection(container);
    initLogoutInteraction(container);
};

// --- Private Logic ---

const initTabNavigation = (container) => {
    const navItems = container.querySelectorAll('.settings-nav-item');
    const sections = container.querySelectorAll('.settings-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            const targetId = item.getAttribute('href').substring(1);

            sections.forEach(sec => sec.classList.remove('active'));
            const targetSection = container.querySelector(`#${targetId}`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
};

const initProfileForm = (container) => {
    const form = container.querySelector('#profile-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.save-btn');
            
            // Simulate API Call
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
                showToast('Profile settings saved.');
            }, 800);
        });
    }

    const profilePreview = container.querySelector('#profile-preview');
    const imageInput = container.querySelector('#profile-image-input');
    const uploadBtn = container.querySelector('#upload-btn');

    if (uploadBtn && imageInput && profilePreview) {
        uploadBtn.addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', () => {
            const file = imageInput.files?.[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                showToast('Please select a valid image file.');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                profilePreview.src = reader.result;
                showToast('Profile picture updated.');
            };
            reader.readAsDataURL(file);
        });
    }

    const removePicBtn = container.querySelector('#remove-pic-btn');
    if (removePicBtn && profilePreview) {
        removePicBtn.addEventListener('click', () => {
            profilePreview.src = '';
            imageInput.value = '';
            showToast('Profile picture removed.');
        });
    }
};

const initNotificationToggles = (container) => {
    const toggles = container.querySelectorAll('.notif-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            showToast('Notification preference updated.');
        });
    });
};

const initThemeSelection = (container) => {
    const themeCards = container.querySelectorAll('.js-theme-card');
    const htmlEl = document.documentElement;

    // Set initial active state based on current HTML attribute
    const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
    themeCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.themeVal === currentTheme) {
            card.classList.add('active');
        }
    });

    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            themeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const themeName = card.dataset.themeVal;
            if (themeName === 'dark' || themeName === 'light') {
                htmlEl.setAttribute('data-theme', themeName);
            } else if (themeName === 'system') {
                const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
                htmlEl.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
            }

            // Sync with Topbar toggle if it exists outside this module
            const topbarIcon = document.querySelector('#theme-toggle i');
            if (topbarIcon) {
                if (htmlEl.getAttribute('data-theme') === 'light') {
                    topbarIcon.className = 'ph ph-sun';
                } else {
                    topbarIcon.className = 'ph ph-moon';
                }
            }

            showToast('Theme updated.');
        });
    });
};

const initLogoutInteraction = (container) => {
    const logoutBtn = container.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const originalText = logoutBtn.innerHTML;
            logoutBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Logging out...';
            logoutBtn.disabled = true;
            logoutBtn.style.opacity = '0.7';

            setTimeout(() => {
                showToast('You have been logged out.');
                // Normally we'd redirect here, e.g., window.location.href = '/login'
                setTimeout(() => {
                    logoutBtn.innerHTML = originalText;
                    logoutBtn.disabled = false;
                    logoutBtn.style.opacity = '1';
                }, 1000);
            }, 1000);
        });
    }
};
