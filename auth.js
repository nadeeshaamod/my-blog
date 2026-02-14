// ===== Authentication JavaScript =====

// Initialize theme from localStorage
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
};

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        showNotification(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 'success');
    });
}

// Initialize theme on page load
initTheme();

// ===== Login Form =====
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Simulate login
        if (email && password) {
            showNotification('🔐 Logging in...', 'info');

            setTimeout(() => {
                // Check if admin
                if (email.toLowerCase().includes('admin')) {
                    localStorage.setItem('userRole', 'admin');
                    localStorage.setItem('userEmail', email);
                    showNotification('✅ Welcome Admin!', 'success');
                    setTimeout(() => {
                        window.location.href = 'admin.html';
                    }, 1000);
                } else {
                    localStorage.setItem('userRole', 'user');
                    localStorage.setItem('userEmail', email);
                    showNotification('✅ Login successful!', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }
            }, 1500);
        }
    });
}

// ===== Signup Form =====
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    // Password strength checker
    if (signupPassword) {
        signupPassword.addEventListener('input', () => {
            const password = signupPassword.value;
            const strength = checkPasswordStrength(password);

            strengthFill.className = 'strength-fill ' + strength.class;
            strengthText.textContent = strength.text;
        });
    }

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('signupEmail').value;
        const password = signupPassword.value;
        const confirm = confirmPassword.value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validation
        if (!agreeTerms) {
            showNotification('❌ Please agree to the terms and conditions', 'error');
            return;
        }

        if (password !== confirm) {
            showNotification('❌ Passwords do not match', 'error');
            return;
        }

        if (password.length < 8) {
            showNotification('❌ Password must be at least 8 characters', 'error');
            return;
        }

        // Simulate signup
        showNotification('📝 Creating your account...', 'info');

        setTimeout(() => {
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', `${firstName} ${lastName}`);
            showNotification('✅ Account created successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 1500);
    });
}

// Password strength checker function
function checkPasswordStrength(password) {
    let strength = { class: '', text: 'Password strength' };

    if (password.length === 0) {
        return strength;
    }

    let score = 0;

    // Length
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Contains lowercase and uppercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;

    // Contains numbers
    if (/\d/.test(password)) score++;

    // Contains special characters
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score <= 2) {
        strength = { class: 'weak', text: 'Weak password' };
    } else if (score <= 4) {
        strength = { class: 'medium', text: 'Medium password' };
    } else {
        strength = { class: 'strong', text: 'Strong password' };
    }

    return strength;
}

// ===== Toggle Password Visibility =====
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            button.innerHTML = `
                <svg class="eye-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 3l14 14M10 7a3 3 0 013 3" stroke="currentColor" stroke-width="2"/>
                    <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6z" stroke="currentColor" stroke-width="2" opacity="0.5"/>
                </svg>
            `;
        } else {
            input.type = 'password';
            button.innerHTML = `
                <svg class="eye-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
            `;
        }
    });
});

// ===== Social Login Buttons =====
const googleLogin = document.getElementById('googleLogin');
const githubLogin = document.getElementById('githubLogin');
const googleSignup = document.getElementById('googleSignup');
const githubSignup = document.getElementById('githubSignup');

if (googleLogin) {
    googleLogin.addEventListener('click', () => {
        showNotification('🔄 Connecting to Google...', 'info');
        setTimeout(() => {
            showNotification('✅ Google login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 1500);
    });
}

if (githubLogin) {
    githubLogin.addEventListener('click', () => {
        showNotification('🔄 Connecting to GitHub...', 'info');
        setTimeout(() => {
            showNotification('✅ GitHub login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 1500);
    });
}

if (googleSignup) {
    googleSignup.addEventListener('click', () => {
        showNotification('🔄 Connecting to Google...', 'info');
        setTimeout(() => {
            showNotification('✅ Account created with Google!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 1500);
    });
}

if (githubSignup) {
    githubSignup.addEventListener('click', () => {
        showNotification('🔄 Connecting to GitHub...', 'info');
        setTimeout(() => {
            showNotification('✅ Account created with GitHub!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 1500);
    });
}

// ===== Mobile Menu =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '24px',
        background: type === 'success' ? '#10B981' :
            type === 'error' ? '#EF4444' : '#3B82F6',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '9999',
        fontWeight: '600',
        fontSize: '14px',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '320px'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
