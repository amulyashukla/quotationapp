/**
 * Main Application Module
 * Handles common functionality, utilities, and dashboard logic
 */

class AppManager {
    constructor() {
        this.currentUser = Storage.getCurrentUser();
        this.setupCommonListeners();
        this.updateDateTime();
        this.loadDashboardData();
    }

    setupCommonListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggleDashboard');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Search functionality
        const searchBox = document.querySelector('.search-box input');
        if (searchBox) {
            searchBox.addEventListener('keyup', (e) => this.handleSearch(e.target.value));
        }

        // Update username
        const userNameElement = document.getElementById('userName');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.name;
        }
    }

    updateDateTime() {
        const dateTimeElement = document.getElementById('dateTime');
        if (dateTimeElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            dateTimeElement.textContent = now.toLocaleDateString('en-US', options);

            // Update every minute
            setInterval(() => {
                const updated = new Date();
                dateTimeElement.textContent = updated.toLocaleDateString('en-US', options);
            }, 60000);
        }
    }

    loadDashboardData() {
        const stats = Storage.getDashboardStats();

        // Update stats
        const totalQuotationsEl = document.getElementById('totalQuotations');
        const pendingQuotationsEl = document.getElementById('pendingQuotations');
        const revenueEl = document.getElementById('revenue');
        const totalCustomersEl = document.getElementById('totalCustomers');

        if (totalQuotationsEl) totalQuotationsEl.textContent = stats.totalQuotations;
        if (pendingQuotationsEl) pendingQuotationsEl.textContent = stats.pendingQuotations;
        if (revenueEl) revenueEl.textContent = this.formatCurrency(stats.revenue);
        if (totalCustomersEl) totalCustomersEl.textContent = stats.totalCustomers;

        // Load recent quotations
        this.loadRecentQuotations(stats.recentQuotations);
    }

    loadRecentQuotations(quotations) {
        const tableBody = document.getElementById('recentQuotationsTable');
        if (!tableBody) return;

        if (quotations.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-muted);">
                        No quotations yet. Create your first quotation!
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = quotations.map(q => `
            <tr>
                <td><strong>${q.quotationNumber}</strong></td>
                <td>${q.customerName || 'N/A'}</td>
                <td>${this.formatCurrency(q.totalAmount || 0)}</td>
                <td>
                    <span style="
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                        ${this.getStatusStyle(q.status)}
                    ">
                        ${this.formatStatus(q.status)}
                    </span>
                </td>
                <td>${this.formatDate(q.createdAt)}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-sm btn-secondary" onclick="appManager.viewQuotation(${q.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="appManager.editQuotation(${q.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        Storage.set('theme', isDark ? 'dark' : 'light');
    }

    handleSearch(query) {
        // This will be overridden by specific page modules
        console.log('Search query:', query);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN');
    }

    formatStatus(status) {
        const statusMap = {
            draft: 'Draft',
            sent: 'Sent',
            accepted: 'Accepted',
            rejected: 'Rejected',
            converted: 'Converted',
            pending: 'Pending'
        };
        return statusMap[status] || status;
    }

    getStatusStyle(status) {
        const styles = {
            draft: 'background-color: #e5e7eb; color: #374151;',
            sent: 'background-color: #dbeafe; color: #1e40af;',
            accepted: 'background-color: #dcfce7; color: #166534;',
            rejected: 'background-color: #fee2e2; color: #991b1b;',
            converted: 'background-color: #dcfce7; color: #166534;',
            pending: 'background-color: #fef3c7; color: #92400e;'
        };
        return styles[status] || styles.draft;
    }

    viewQuotation(id) {
        window.location.href = `quotations.html?view=${id}`;
    }

    editQuotation(id) {
        window.location.href = `quotations.html?edit=${id}`;
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

        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 3000);
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    updateNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.appManager = new AppManager();
    window.appManager.updateNavigation();
});

// Global utility functions

/**
 * Format currency value
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

/**
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
}

/**
 * Format datetime
 */
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN') + ' ' + date.toLocaleTimeString('en-IN');
}

/**
 * Validate email
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone number
 */
function validatePhone(phone) {
    const re = /^[0-9]{10,}$/;
    return re.test(phone.replace(/\D/g, ''));
}

/**
 * Get query parameter from URL
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        if (window.appManager) {
            window.appManager.showToast('Copied to clipboard!', 'success');
        }
    });
}

/**
 * Calculate GST
 */
function calculateGST(amount, gstPercentage) {
    return (amount * gstPercentage) / 100;
}

/**
 * Calculate total with GST
 */
function calculateTotalWithGST(amount, gstPercentage) {
    const gst = calculateGST(amount, gstPercentage);
    return amount + gst;
}

/**
 * Download JSON file
 */
function downloadJSON(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Generate random ID
 */
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}
