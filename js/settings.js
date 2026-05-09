/**
 * Settings Management Module
 * Handles company configuration and data management
 */

class SettingsManager {
    constructor() {
        this.currentUser = Storage.getCurrentUser();
        this.initializeEventListeners();
        this.loadSettings();
        this.loadSystemInfo();
    }

    initializeEventListeners() {
        const companyForm = document.getElementById('companyForm');
        if (companyForm) {
            companyForm.addEventListener('submit', (e) => this.handleCompanySave(e));
        }
    }

    loadSettings() {
        const company = Storage.get('company');

        if (company) {
            document.getElementById('companyName').value = company.name;
            document.getElementById('companyEmail').value = company.email;
            document.getElementById('companyPhone').value = company.phone;
            document.getElementById('companyWebsite').value = company.website || '';
            document.getElementById('companyAddress').value = company.address;
            document.getElementById('companyGST').value = company.gst;
            document.getElementById('companyTerms').value = company.terms;
        }
    }

    handleCompanySave(event) {
        event.preventDefault();

        const company = {
            name: document.getElementById('companyName').value.trim(),
            email: document.getElementById('companyEmail').value.trim(),
            phone: document.getElementById('companyPhone').value.trim(),
            website: document.getElementById('companyWebsite').value.trim(),
            address: document.getElementById('companyAddress').value.trim(),
            gst: document.getElementById('companyGST').value.trim(),
            terms: document.getElementById('companyTerms').value.trim()
        };

        // Validation
        if (!company.name || !company.email || !company.phone || !company.address) {
            appManager.showToast('Please fill all required fields', 'error');
            return;
        }

        Storage.set('company', company);
        appManager.showToast('Company details saved successfully!', 'success');
    }

    loadSystemInfo() {
        const products = Storage.getAllProducts();
        const customers = Storage.getAllCustomers();
        const quotations = Storage.getAllQuotations();
        const inquiries = Storage.getAllInquiries();

        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalCustomers').textContent = customers.length;
        document.getElementById('totalQuotations').textContent = quotations.length;
        document.getElementById('totalInquiries').textContent = inquiries.length;

        // Calculate storage usage
        const allData = {
            products,
            customers,
            quotations,
            inquiries,
            company: Storage.get('company'),
            users: Storage.get('users')
        };

        const storageUsed = Math.round(JSON.stringify(allData).length / 1024);
        const storageTotal = 5000; // 5MB limit

        document.getElementById('storageUsed').textContent = storageUsed;
        document.getElementById('storageTotal').textContent = storageTotal;

        const percentage = (storageUsed / storageTotal) * 100;
        document.getElementById('storageBar').style.width = Math.min(percentage, 100) + '%';
    }

    exportData() {
        const allData = {
            company: Storage.get('company'),
            products: Storage.getAllProducts(),
            customers: Storage.getAllCustomers(),
            quotations: Storage.getAllQuotations(),
            inquiries: Storage.getAllInquiries(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const filename = `akb-quotation-backup-${new Date().toISOString().split('T')[0]}.json`;
        downloadJSON(allData, filename);

        appManager.showToast('Data exported successfully!', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (confirm('Are you sure you want to import this backup? This will overwrite existing data.')) {
                    // Restore data
                    if (data.company) Storage.set('company', data.company);
                    if (data.products) Storage.set('products', data.products);
                    if (data.customers) Storage.set('customers', data.customers);
                    if (data.quotations) Storage.set('quotations', data.quotations);
                    if (data.inquiries) Storage.set('inquiries', data.inquiries);

                    appManager.showToast('Data imported successfully!', 'success');
                    
                    // Reload page
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }
            } catch (error) {
                appManager.showToast('Invalid file format. Please select a valid JSON backup file.', 'error');
            }
        };

        reader.readAsText(file);
    }

    confirmClearData() {
        if (confirm('Are you sure you want to delete ALL data? This action cannot be undone.')) {
            if (confirm('This is your last chance! Delete everything?')) {
                Storage.clear();
                Storage.init();
                appManager.showToast('All data cleared. Reloading...', 'success');
                
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            }
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.settingsManager = new SettingsManager();
});
