/**
 * Authentication Module - Handles login, logout, and auth state
 */

class Auth {
    constructor() {
        this.currentUser = Storage.getCurrentUser();
        this.initializeTheme();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const themeToggle = document.getElementById('themeToggle');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for logout button
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="logout"]')) {
                this.logout();
            }
        });
    }

    handleLogin(event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate input
        if (!username || !password) {
            this.showError('Please enter username and password');
            return;
        }

        // Authenticate
        const user = Storage.authenticateUser(username, password);

        if (user) {
            // Remove password from session storage
            const userSession = { ...user };
            delete userSession.password;

            Storage.saveCurrentUser(userSession);
            this.currentUser = userSession;

            if (rememberMe) {
                localStorage.setItem('rememberUsername', username);
            }

            this.showSuccess('Login successful! Redirecting...');

            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 1000);
        } else {
            this.showError('Invalid username or password');
        }
    }

    logout() {
        Storage.logoutUser();
        this.currentUser = null;
        this.showSuccess('Logged out successfully');

        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        Storage.set('theme', isDark ? 'dark' : 'light');
    }

    initializeTheme() {
        const theme = Storage.get('theme') || 'light';
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showToast(message, type = 'info') {
        const container = document.querySelector('.toast-container') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };

        toast.innerHTML = `
            <i class="toast-icon ${icons[type]}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => toast.remove());

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
}

// Check authentication on page load
function checkAuthentication() {
    const currentUser = Storage.getCurrentUser();
    const currentPage = window.location.pathname;

    // If on login page and already authenticated, redirect to dashboard
    if (currentPage.includes('index.html') && currentUser) {
        window.location.href = 'pages/dashboard.html';
    }

    // If on protected page and not authenticated, redirect to login
    if (!currentPage.includes('index.html') && !currentUser) {
        window.location.href = '../index.html';
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    window.auth = new Auth();
});
