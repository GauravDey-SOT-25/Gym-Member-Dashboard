import API from '../../mock-api-data/data.js';

// State tracking: 'login' or 'signup'
let authState = 'login';
let containerElement = null;

// Dynamic custom toast timer
let toastTimeout = null;

export const initAuth = (containerId) => {
    containerElement = document.getElementById(containerId);
    if (!containerElement) return;

    renderView();
};

/**
 * Renders either the Login or Sign Up interface based on active state.
 * Uses a smooth entry animation.
 */
const renderView = () => {
    if (authState === 'login') {
        containerElement.innerHTML = getLoginTemplate();
        setupLoginListeners();
    } else {
        containerElement.innerHTML = getSignupTemplate();
        setupSignupListeners();
    }

    // Attach shared eye password toggler events
    setupPasswordToggles();
};

/**
 * Switches the active screen view with a smooth micro-animation.
 */
const switchView = (newState) => {
    // Add fade slide out/in animation styling
    containerElement.classList.remove('fade-slide-up');
    
    // Force DOM reflow to restart transition
    void containerElement.offsetWidth;
    
    authState = newState;
    renderView();
    
    containerElement.classList.add('fade-slide-up');
};

/**
 * Renders dynamic custom notification toast alerts.
 */
const showAuthToast = (message, isError = false) => {
    const toast = document.getElementById('auth-toast');
    if (toast) {
        const textSpan = toast.querySelector('span');
        if (textSpan) textSpan.textContent = message;

        // Apply error styles if applicable
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
    }
};

/**
 * Form shaking indicator animation on validation errors.
 */
const triggerFormShake = () => {
    containerElement.classList.add('shake-element');
    setTimeout(() => {
        containerElement.classList.remove('shake-element');
    }, 450);
};

/* ==========================================================================
   HTML Template Generators
   ========================================================================== */

const getLoginTemplate = () => `
    <div class="auth-view fade-slide-up">
        <header class="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to manage your gym membership.</p>
        </header>

        <form id="login-form" novalidate>
            <!-- Email Input -->
            <div class="form-group input-group" id="email-group">
                <label for="login-email">Email or Username</label>
                <div class="input-wrapper">
                    <i class="ph ph-envelope input-icon"></i>
                    <input type="text" id="login-email" class="pill-input" placeholder="name@example.com" required>
                </div>
                <span class="validation-error" id="email-error" style="display: none;"></span>
            </div>

            <!-- Password Input -->
            <div class="form-group input-group" id="password-group">
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

            <!-- Options (Remember me & forgot) -->
            <div class="form-options">
                <label class="checkbox-label">
                    <input type="checkbox" id="remember-me">
                    <span>Remember me</span>
                </label>
                <a href="#" class="forgot-link" id="forgot-password-link">Forgot password?</a>
            </div>

            <!-- Submission Button -->
            <button type="submit" class="btn-auth">
                <span>Sign In</span>
                <i class="ph ph-arrow-right"></i>
            </button>
        </form>

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
            <h2>Create account</h2>
            <p>Start your fitness adventure today.</p>
        </header>

        <form id="signup-form" novalidate>
            <!-- Full Name -->
            <div class="form-group input-group" id="name-group">
                <label for="signup-name">Full Name</label>
                <div class="input-wrapper">
                    <i class="ph ph-user input-icon"></i>
                    <input type="text" id="signup-name" class="pill-input" placeholder="John Doe" required>
                </div>
                <span class="validation-error" id="name-error" style="display: none;"></span>
            </div>

            <!-- Email -->
            <div class="form-group input-group" id="signup-email-group">
                <label for="signup-email">Email Address</label>
                <div class="input-wrapper">
                    <i class="ph ph-envelope input-icon"></i>
                    <input type="email" id="signup-email" class="pill-input" placeholder="john@example.com" required>
                </div>
                <span class="validation-error" id="signup-email-error" style="display: none;"></span>
            </div>

            <!-- Password -->
            <div class="form-group input-group" id="signup-password-group">
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

            <!-- Confirm Password -->
            <div class="form-group input-group" id="confirm-password-group">
                <label for="confirm-password">Confirm Password</label>
                <div class="input-wrapper">
                    <i class="ph ph-lock-keyhole input-icon"></i>
                    <input type="password" id="confirm-password" class="pill-input" placeholder="••••••••" required>
                    <button type="button" class="password-toggle" title="Show password">
                        <i class="ph ph-eye"></i>
                    </button>
                </div>
                <span class="validation-error" id="confirm-password-error" style="display: none;"></span>
            </div>

            <!-- Submission Button -->
            <button type="submit" class="btn-auth">
                <span>Create Account</span>
                <i class="ph ph-user-plus"></i>
            </button>
        </form>

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
   Interactive Event Listeners
   ========================================================================== */

const setupPasswordToggles = () => {
    const toggleButtons = containerElement.querySelectorAll('.password-toggle');
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

const setupLoginListeners = () => {
    // Navigation to Sign Up screen
    const toSignupBtn = containerElement.querySelector('#to-signup-btn');
    if (toSignupBtn) {
        toSignupBtn.addEventListener('click', () => switchView('signup'));
    }

    // Forgot Password link
    const forgotLink = containerElement.querySelector('#forgot-password-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthToast('Password reset link sent to registered email.');
        });
    }

    // Social buttons
    const socialBtns = containerElement.querySelectorAll('.btn-social');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.id === 'social-google' ? 'Google' : 'Apple';
            showAuthToast(`Authenticating through ${provider}...`);
        });
    });

    // Form Submission Validation
    const form = containerElement.querySelector('#login-form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('#login-email');
            const passwordInput = form.querySelector('#login-password');
            
            let isValid = true;

            // Email/Username validation
            const emailGroup = form.querySelector('#email-group');
            const emailError = form.querySelector('#email-error');
            if (!emailInput.value.trim()) {
                showValidationError(emailGroup, emailError, 'Email or username is required.');
                isValid = false;
            } else {
                clearValidationError(emailGroup, emailError);
            }

            // Password validation
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

            // Validate against mock database
            const users = API.getAllUsers();
            const matchedUser = users.find(u => u.email.toLowerCase() === emailInput.value.trim().toLowerCase());

            if (!matchedUser) {
                showValidationError(emailGroup, emailError, 'User email not found.');
                triggerFormShake();
                return;
            }

            // Successful authentication path
            const originalButtonContent = form.querySelector('.btn-auth').innerHTML;
            const authButton = form.querySelector('.btn-auth');
            authButton.disabled = true;
            authButton.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Authenticating...';

            // Set dynamic member ID & load API
            localStorage.setItem('currentMemberId', matchedUser.id);
            await API.init(matchedUser.id);

            setTimeout(() => {
                showAuthToast(`Welcome back, ${matchedUser.name}! Redirecting...`);
                setTimeout(() => {
                    authButton.disabled = false;
                    authButton.innerHTML = originalButtonContent;
                    window.location.href = '../Setting/index.html';
                }, 1000);
            }, 1200);
        });
    }
};

const setupSignupListeners = () => {
    // Navigation back to Login screen
    const toLoginBtn = containerElement.querySelector('#to-login-btn');
    if (toLoginBtn) {
        toLoginBtn.addEventListener('click', () => switchView('login'));
    }

    // Social buttons
    const socialBtns = containerElement.querySelectorAll('.btn-social');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.id === 'social-google' ? 'Google' : 'Apple';
            showAuthToast(`Signing up through ${provider}...`);
        });
    });

    // Sign Up form validation
    const form = containerElement.querySelector('#signup-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = form.querySelector('#signup-name');
            const emailInput = form.querySelector('#signup-email');
            const passwordInput = form.querySelector('#signup-password');
            const confirmInput = form.querySelector('#confirm-password');

            let isValid = true;

            // Full Name validation
            const nameGroup = form.querySelector('#name-group');
            const nameError = form.querySelector('#name-error');
            if (!nameInput.value.trim()) {
                showValidationError(nameGroup, nameError, 'Full name is required.');
                isValid = false;
            } else {
                clearValidationError(nameGroup, nameError);
            }

            // Email validation
            const emailGroup = form.querySelector('#signup-email-group');
            const emailError = form.querySelector('#signup-email-error');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                showValidationError(emailGroup, emailError, 'Email address is required.');
                isValid = false;
            } else if (!emailPattern.test(emailInput.value.trim())) {
                showValidationError(emailGroup, emailError, 'Please enter a valid email format.');
                isValid = false;
            } else {
                clearValidationError(emailGroup, emailError);
            }

            // Password strength validation
            const passwordGroup = form.querySelector('#signup-password-group');
            const passwordError = form.querySelector('#signup-password-error');
            if (!passwordInput.value) {
                showValidationError(passwordGroup, passwordError, 'Password is required.');
                isValid = false;
            } else if (passwordInput.value.length < 8) {
                showValidationError(passwordGroup, passwordError, 'Password must be at least 8 characters long.');
                isValid = false;
            } else {
                clearValidationError(passwordGroup, passwordError);
            }

            // Password match validation
            const confirmGroup = form.querySelector('#confirm-password-group');
            const confirmError = form.querySelector('#confirm-password-error');
            if (!confirmInput.value) {
                showValidationError(confirmGroup, confirmError, 'Please confirm your password.');
                isValid = false;
            } else if (confirmInput.value !== passwordInput.value) {
                showValidationError(confirmGroup, confirmError, 'Passwords do not match.');
                isValid = false;
            } else {
                clearValidationError(confirmGroup, confirmError);
            }

            if (!isValid) {
                triggerFormShake();
                return;
            }

            // Mock successful registration
            const originalBtnHtml = form.querySelector('.btn-auth').innerHTML;
            const authBtn = form.querySelector('.btn-auth');
            authBtn.disabled = true;
            authBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Creating account...';

            setTimeout(() => {
                showAuthToast('Account created successfully!');
                setTimeout(() => {
                    authBtn.disabled = false;
                    authBtn.innerHTML = originalBtnHtml;
                    
                    // Smooth switch back to Login to sign in
                    switchView('login');
                    showAuthToast('Please log in with your credentials.');
                }, 1000);
            }, 1200);
        });
    }
};

/* ==========================================================================
   Helper Validation Functions
   ========================================================================== */

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
