// js/auth.js

import API from './data.js';

let authState = 'login'; // 'login' or 'signup'
let containerElement = null;
let toastTimeout = null;

export const initAuth = (containerId, onLoginSuccess) => {
    containerElement = document.getElementById(containerId);
    if (!containerElement) return;

    renderAuthLayout(onLoginSuccess);
};

const renderAuthLayout = (onLoginSuccess) => {
    containerElement.innerHTML = `
        <div class="auth-layout">
            <!-- Left Panel: Hero Graphics (hidden on mobile) -->
            <section class="hero-panel">
                <header class="brand-header">
                    <div class="brand-logo-glow">F</div>
                    <h1 class="brand-name">FitMatrix</h1>
                </header>
                
                <div class="hero-content">
                    <h2 class="hero-title">Elevate your fitness journey with <span>FitMatrix</span></h2>
                    <p class="hero-subtitle">The ultimate gym portal. Log sessions, schedule trainers, monitor stats in real-time, and redeem reward points.</p>
                    
                    <div class="floating-widgets">
                        <div class="glass-widget">
                            <div class="widget-icon">
                                <i class="ph-fill ph-users-three"></i>
                            </div>
                            <div class="widget-info">
                                <strong>Live Capacity</strong>
                                <span id="hero-live-visitors">34 members checked in</span>
                            </div>
                        </div>
                        <div class="glass-widget">
                            <div class="widget-icon">
                                <i class="ph-fill ph-fire"></i>
                            </div>
                            <div class="widget-info">
                                <strong>Active Streaks</strong>
                                <span>Earn points for checking in daily</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <footer class="hero-footer">
                    <span>&copy; 2026 FitMatrix Gym SaaS Portal. All rights reserved.</span>
                </footer>
            </section>

            <!-- Right Panel: Forms -->
            <main class="form-panel">
                <div class="theme-toggle-container">
                    <button id="theme-toggle" class="theme-toggle-btn" title="Toggle Theme">
                        <i class="ph ph-moon"></i>
                    </button>
                </div>

                <div id="auth-card-root" class="auth-card"></div>
            </main>
        </div>

        <!-- Notification Toast Alerts -->
        <div id="auth-toast" class="toast">
            <i class="ph ph-info"></i>
            <span>Notification message here.</span>
        </div>
    `;

    // Initialize Theme Toggler
    initThemeToggler();

    // Render inner form
    renderInnerForm(onLoginSuccess);
};

const renderInnerForm = (onLoginSuccess) => {
    const cardRoot = document.getElementById('auth-card-root');
    if (!cardRoot) return;

    if (authState === 'login') {
        cardRoot.innerHTML = getLoginTemplate();
        setupLoginListeners(onLoginSuccess);
    } else {
        cardRoot.innerHTML = getSignupTemplate();
        setupSignupListeners(onLoginSuccess);
    }

    setupPasswordToggles();
};

const switchView = (newState, onLoginSuccess) => {
    const cardRoot = document.getElementById('auth-card-root');
    if (!cardRoot) return;

    cardRoot.classList.remove('fade-slide-up');
    void cardRoot.offsetWidth; // Force Reflow
    
    authState = newState;
    renderInnerForm(onLoginSuccess);
    
    cardRoot.classList.add('fade-slide-up');
};

/* ==========================================================================
   HTML Templates
   ========================================================================== */

const getLoginTemplate = () => `
    <div class="auth-view fade-slide-up">
        <header class="auth-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to manage your gym membership.</p>
        </header>

        <form id="login-form" novalidate>
            <!-- Email Input -->
            <div class="form-group" id="email-group">
                <label for="login-email">Email or Username</label>
                <div class="input-wrapper">
                    <i class="ph ph-envelope input-icon"></i>
                    <input type="text" id="login-email" class="pill-input" placeholder="name@example.com" required>
                </div>
                <span class="validation-error" id="email-error" style="display: none;"></span>
            </div>

            <!-- Password Input -->
            <div class="form-group" id="password-group">
                <label for="login-password">Password</label>
                <div class="input-wrapper">
                    <i class="ph ph-lock input-icon"></i>
                    <input type="password" id="login-password" class="pill-input" placeholder="••••••••" required>
                    <button type="button" class="password-toggle" title="Show password">
                        <i class="ph ph-eye"></i>
                    </button>
                </div>
                <span class="validation-error" id="password-error" style="display: none;"></span>
            </div>

            <!-- Options -->
            <div class="form-options">
                <label class="checkbox-label">
                    <input type="checkbox" id="remember-me">
                    <span>Remember me</span>
                </label>
                <a href="#" class="forgot-link" id="forgot-password-link">Forgot password?</a>
            </div>

            <!-- Submission Button -->
            <button type="submit" class="btn-auth" id="login-submit-btn">
                <span>Sign In</span>
                <i class="ph ph-arrow-right"></i>
            </button>
        </form>

        <button type="button" class="btn-secondary" id="guest-access-btn" style="width: 100%; border-radius: var(--radius-pill); padding: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; background: rgba(255, 255, 255, 0.03); border-color: var(--border-color);">
            <i class="ph ph-user"></i>
            <span>Continue as Guest</span>
        </button>

        <div class="social-divider">or sign in with</div>

        <!-- Social logins -->
        <div class="social-buttons">
            <button class="btn-social" type="button" id="social-google">
                <i class="ph-fill ph-google-logo"></i>
                <span>Google</span>
            </button>
            <button class="btn-social" type="button" id="social-apple">
                <i class="ph-fill ph-apple-logo"></i>
                <span>Apple</span>
            </button>
        </div>

        <footer class="auth-footer">
            <span>Don't have an account?</span>
            <button type="button" id="to-signup-btn">Sign Up</button>
        </footer>
    </div>
`;

const getSignupTemplate = () => `
    <div class="auth-view fade-slide-up">
        <header class="auth-card-header">
            <h2>Create Account</h2>
            <p>Start your fitness adventure today.</p>
        </header>

        <form id="signup-form" novalidate>
            <!-- Full Name -->
            <div class="form-group" id="name-group">
                <label for="signup-name">Full Name</label>
                <div class="input-wrapper">
                    <i class="ph ph-user input-icon"></i>
                    <input type="text" id="signup-name" class="pill-input" placeholder="John Doe" required>
                </div>
                <span class="validation-error" id="name-error" style="display: none;"></span>
            </div>

            <!-- Email -->
            <div class="form-group" id="signup-email-group">
                <label for="signup-email">Email Address</label>
                <div class="input-wrapper">
                    <i class="ph ph-envelope input-icon"></i>
                    <input type="email" id="signup-email" class="pill-input" placeholder="john@example.com" required>
                </div>
                <span class="validation-error" id="signup-email-error" style="display: none;"></span>
            </div>

            <!-- Password -->
            <div class="form-group" id="signup-password-group">
                <label for="signup-password">Password</label>
                <div class="input-wrapper">
                    <i class="ph ph-lock input-icon"></i>
                    <input type="password" id="signup-password" class="pill-input" placeholder="••••••••" required>
                    <button type="button" class="password-toggle" title="Show password">
                        <i class="ph ph-eye"></i>
                    </button>
                </div>
                <span class="validation-error" id="signup-password-error" style="display: none;"></span>
            </div>

            <!-- Submission Button -->
            <button type="submit" class="btn-auth" id="signup-submit-btn">
                <span>Create Account</span>
                <i class="ph ph-user-plus"></i>
            </button>
        </form>

        <button type="button" class="btn-secondary" id="guest-access-btn" style="width: 100%; border-radius: var(--radius-pill); padding: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; background: rgba(255, 255, 255, 0.03); border-color: var(--border-color);">
            <i class="ph ph-user"></i>
            <span>Continue as Guest</span>
        </button>

        <div class="social-divider">or create with</div>

        <!-- Social logins -->
        <div class="social-buttons">
            <button class="btn-social" type="button" id="social-google">
                <i class="ph-fill ph-google-logo"></i>
                <span>Google</span>
            </button>
            <button class="btn-social" type="button" id="social-apple">
                <i class="ph-fill ph-apple-logo"></i>
                <span>Apple</span>
            </button>
        </div>

        <footer class="auth-footer">
            <span>Already have an account?</span>
            <button type="button" id="to-login-btn">Login</button>
        </footer>
    </div>
`;

/* ==========================================================================
   Listeners & Actions
   ========================================================================== */

const setupPasswordToggles = () => {
    const cardRoot = document.getElementById('auth-card-root');
    if (!cardRoot) return;

    const toggleButtons = cardRoot.querySelectorAll('.password-toggle');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const wrapper = btn.closest('.input-wrapper');
            const input = wrapper.querySelector('input');
            const icon = btn.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'ph ph-eye-closed';
                btn.title = 'Hide password';
            } else {
                input.type = 'password';
                icon.className = 'ph ph-eye';
                btn.title = 'Show password';
            }
        });
    });
};

const setupLoginListeners = (onLoginSuccess) => {
    const cardRoot = document.getElementById('auth-card-root');
    
    // Switch to Sign Up
    const toSignupBtn = cardRoot.querySelector('#to-signup-btn');
    if (toSignupBtn) {
        toSignupBtn.addEventListener('click', () => switchView('signup', onLoginSuccess));
    }

    // Guest Access
    const guestBtn = cardRoot.querySelector('#guest-access-btn');
    if (guestBtn) {
        guestBtn.addEventListener('click', async () => {
            localStorage.setItem('currentMemberId', 'MBR-001');
            await API.init('MBR-001');
            showAuthToast('Loading guest session...');
            setTimeout(() => {
                onLoginSuccess('MBR-001');
            }, 800);
        });
    }

    // Forgot Password
    const forgotLink = cardRoot.querySelector('#forgot-password-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthToast('Password reset link has been dispatched to email.');
        });
    }

    // Socials
    const socialBtns = cardRoot.querySelectorAll('.btn-social');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.id === 'social-google' ? 'Google' : 'Apple';
            showAuthToast(`Authenticating with ${provider}...`);
        });
    });

    // Form Submission
    const form = cardRoot.querySelector('#login-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = form.querySelector('#login-email');
            const passwordInput = form.querySelector('#login-password');
            let isValid = true;

            const emailGroup = form.querySelector('#email-group');
            const emailError = form.querySelector('#email-error');
            if (!emailInput.value.trim()) {
                showValidationError(emailGroup, emailError, 'Email address or username is required.');
                isValid = false;
            } else {
                clearValidationError(emailGroup, emailError);
            }

            const passwordGroup = form.querySelector('#password-group');
            const passwordError = form.querySelector('#password-error');
            if (!passwordInput.value) {
                showValidationError(passwordGroup, passwordError, 'Password is required.');
                isValid = false;
            } else {
                clearValidationError(passwordGroup, passwordError);
            }

            if (!isValid) {
                triggerFormShake();
                return;
            }

            // Check mock users database
            const users = API.getAllUsers();
            const matchedUser = users.find(u => u.email.toLowerCase() === emailInput.value.trim().toLowerCase());

            if (!matchedUser) {
                showValidationError(emailGroup, emailError, 'Credentials do not match our records.');
                triggerFormShake();
                return;
            }

            // Authenticating animation
            const submitBtn = form.querySelector('#login-submit-btn');
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Authenticating...';

            // Store credentials
            localStorage.setItem('currentMemberId', matchedUser.id);
            await API.init(matchedUser.id);

            setTimeout(() => {
                showAuthToast(`Welcome, ${matchedUser.name}! Loading dashboard...`);
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    
                    // Callback to main controller to transition views
                    onLoginSuccess(matchedUser.id);
                }, 1000);
            }, 1200);
        });
    }
};

const setupSignupListeners = (onLoginSuccess) => {
    const cardRoot = document.getElementById('auth-card-root');

    // Switch to Login
    const toLoginBtn = cardRoot.querySelector('#to-login-btn');
    if (toLoginBtn) {
        toLoginBtn.addEventListener('click', () => switchView('login', onLoginSuccess));
    }

    // Guest Access
    const guestBtn = cardRoot.querySelector('#guest-access-btn');
    if (guestBtn) {
        guestBtn.addEventListener('click', async () => {
            localStorage.setItem('currentMemberId', 'MBR-001');
            await API.init('MBR-001');
            showAuthToast('Loading guest session...');
            setTimeout(() => {
                onLoginSuccess('MBR-001');
            }, 800);
        });
    }

    // Socials
    const socialBtns = cardRoot.querySelectorAll('.btn-social');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.id === 'social-google' ? 'Google' : 'Apple';
            showAuthToast(`Registering with ${provider}...`);
        });
    });

    // Form Submission
    const form = cardRoot.querySelector('#signup-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = form.querySelector('#signup-name');
            const emailInput = form.querySelector('#signup-email');
            const passwordInput = form.querySelector('#signup-password');
            let isValid = true;

            const nameGroup = form.querySelector('#name-group');
            const nameError = form.querySelector('#name-error');
            if (!nameInput.value.trim()) {
                showValidationError(nameGroup, nameError, 'Full name is required.');
                isValid = false;
            } else {
                clearValidationError(nameGroup, nameError);
            }

            const emailGroup = form.querySelector('#signup-email-group');
            const emailError = form.querySelector('#signup-email-error');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                showValidationError(emailGroup, emailError, 'Email address is required.');
                isValid = false;
            } else if (!emailPattern.test(emailInput.value.trim())) {
                showValidationError(emailGroup, emailError, 'Invalid email format.');
                isValid = false;
            } else {
                clearValidationError(emailGroup, emailError);
            }

            const passwordGroup = form.querySelector('#signup-password-group');
            const passwordError = form.querySelector('#signup-password-error');
            if (!passwordInput.value) {
                showValidationError(passwordGroup, passwordError, 'Password is required.');
                isValid = false;
            } else if (passwordInput.value.length < 6) {
                showValidationError(passwordGroup, passwordError, 'Must be at least 6 characters.');
                isValid = false;
            } else {
                clearValidationError(passwordGroup, passwordError);
            }

            if (!isValid) {
                triggerFormShake();
                return;
            }

            // Create new mock user in local database
            const submitBtn = form.querySelector('#signup-submit-btn');
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Registering...';

            setTimeout(() => {
                const users = API.getAllUsers();
                const matchedUser = users.find(u => u.email.toLowerCase() === emailInput.value.trim().toLowerCase());

                if (matchedUser) {
                    showValidationError(emailGroup, emailError, 'This email is already registered.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    triggerFormShake();
                    return;
                }

                // Add to mock db
                const rawUsers = JSON.parse(localStorage.getItem("fitmatrix_users") || "{}");
                const newUserId = "MBR-" + String(Object.keys(rawUsers).length + 1).padStart(3, '0');
                rawUsers[newUserId] = {
                    id: newUserId,
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim().toLowerCase(),
                    phone: "+91 99999 88888",
                    plan: "Basic",
                    status: "active",
                    daysRemaining: 30,
                    sessions: 0,
                    streak: 0,
                    calories: 0,
                    points: 100, // starting points bonus
                    tier: "Bronze"
                };
                localStorage.setItem("fitmatrix_users", JSON.stringify(rawUsers));

                showAuthToast('Account created! Logging in...');
                setTimeout(async () => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;

                    // Log the new user in
                    localStorage.setItem('currentMemberId', newUserId);
                    await API.init(newUserId);
                    
                    onLoginSuccess(newUserId);
                }, 1000);
            }, 1200);
        });
    }
};

/* ==========================================================================
   Helper Functions
   ========================================================================== */

const showAuthToast = (message, isError = false) => {
    const toast = document.getElementById('auth-toast');
    if (!toast) return;

    const span = toast.querySelector('span');
    if (span) span.textContent = message;

    if (isError) {
        toast.classList.add('toast-error');
        const icon = toast.querySelector('i');
        if (icon) icon.className = 'ph ph-x-circle';
    } else {
        toast.classList.remove('toast-error');
        const icon = toast.querySelector('i');
        if (icon) icon.className = 'ph ph-check-circle';
    }

    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
};

const triggerFormShake = () => {
    const card = document.getElementById('auth-card-root');
    if (!card) return;
    card.classList.add('shake-element');
    setTimeout(() => {
        card.classList.remove('shake-element');
    }, 450);
};

const showValidationError = (groupEl, errorEl, message) => {
    if (groupEl && errorEl) {
        groupEl.classList.add('invalid');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
};

const clearValidationError = (groupEl, errorEl) => {
    if (groupEl && errorEl) {
        groupEl.classList.remove('invalid');
        errorEl.textContent = '';
        errorEl.style.display = 'none';
    }
};

const initThemeToggler = () => {
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    const applyTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        const icon = themeBtn ? themeBtn.querySelector('i') : null;
        if (icon) {
            icon.className = theme === 'light' ? 'ph ph-sun' : 'ph ph-moon';
        }
        localStorage.setItem('fitmatrix_theme', theme);
    };

    const activeTheme = localStorage.getItem('fitmatrix_theme') || 'dark';
    applyTheme(activeTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }
};
