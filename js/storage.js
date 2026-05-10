/**
 * Storage Module - Handles all local storage operations
 * Manages: Auth, Quotations, Products, Customers, Inquiries
 */

const Storage = {
    // Initialize storage with default data
    init: function() {
        if (!this.get('initialized')) {
            // Initialize default admin user
            this.set('users', [
                {
                    id: 1,
                    username: 'admin',
                    password: '123456',
                    email: 'admin@akb-engineering.com',
                    name: 'Admin User',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                }
            ]);

            // Initialize empty collections
            this.set('products', []);
            this.set('quotations', []);
            this.set('customers', []);
            this.set('inquiries', []);
            this.set('quotationCounter', 1001);
            this.set('initialized', true);

            // Company settings
            this.set('company', {
                name: 'AKB Engineering',
                email: 'info@akb-engineering.com',
                phone: '+1-800-XXX-XXXX',
                address: '123 Industrial Ave, Tech City',
                website: 'www.akb-engineering.com',
                gst: '27AABCT1234H1Z0',
                terms: 'Payment terms: Net 30 days\nDelivery: As per agreed schedule\nWarranty: As per product specifications'
            });

            // Default theme
            this.set('theme', 'light');
        }
    },

    // Set data in localStorage
    set: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    // Get data from localStorage
    get: function(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },

    // Remove data from localStorage
    remove: function(key) {
        localStorage.removeItem(key);
    },

    // Clear all data
    clear: function() {
        localStorage.clear();
    },

    // ========== USER MANAGEMENT ==========
    
    authenticateUser: function(username, password) {
        const users = this.get('users') || [];
        return users.find(u => u.username === username && u.password === password);
    },

    saveCurrentUser: function(user) {
        this.set('currentUser', user);
    },

    getCurrentUser: function() {
        return this.get('currentUser');
    },

    logoutUser: function() {
        this.remove('currentUser');
    },

    // ========== PRODUCT MANAGEMENT ==========

    addProduct: function(product) {
        const products = this.get('products') || [];
        product.id = Date.now();
        product.createdAt = new Date().toISOString();
        products.push(product);
        this.set('products', products);
        return product;
    },

    updateProduct: function(id, updates) {
        const products = this.get('products') || [];
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updates };
            this.set('products', products);
            return products[index];
        }
        return null;
    },

    deleteProduct: function(id) {
        let products = this.get('products') || [];
        products = products.filter(p => p.id !== id);
        this.set('products', products);
    },

    getProduct: function(id) {
        const products = this.get('products') || [];
        return products.find(p => p.id === id);
    },

    getAllProducts: function() {
        return this.get('products') || [];
    },

    // ========== CUSTOMER MANAGEMENT ==========

    addCustomer: function(customer) {
        const customers = this.get('customers') || [];
        customer.id = Date.now();
        customer.createdAt = new Date().toISOString();
        customer.quotations = [];
        customer.inquiries = [];
        customers.push(customer);
        this.set('customers', customers);
        return customer;
    },

    updateCustomer: function(id, updates) {
        const customers = this.get('customers') || [];
        const index = customers.findIndex(c => c.id === id);
        if (index !== -1) {
            customers[index] = { ...customers[index], ...updates };
            this.set('customers', customers);
            return customers[index];
        }
        return null;
    },

    getCustomer: function(id) {
        const customers = this.get('customers') || [];
        return customers.find(c => c.id === id);
    },

    getCustomerByEmail: function(email) {
        const customers = this.get('customers') || [];
        return customers.find(c => c.email === email);
    },

    getAllCustomers: function() {
        return this.get('customers') || [];
    },

    deleteCustomer: function(id) {
        let customers = this.get('customers') || [];
        customers = customers.filter(c => c.id !== id);
        this.set('customers', customers);
    },

    // ========== INQUIRY MANAGEMENT ==========

    addInquiry: function(inquiry) {
        const inquiries = this.get('inquiries') || [];
        inquiry.id = Date.now();
        inquiry.createdAt = new Date().toISOString();
        inquiry.status = 'pending'; // pending, converted, rejected
        inquiries.push(inquiry);
        this.set('inquiries', inquiries);

        // Also add to customer's inquiry list
        if (inquiry.customerId) {
            const customer = this.getCustomer(inquiry.customerId);
            if (customer) {
                if (!customer.inquiries) customer.inquiries = [];
                customer.inquiries.push(inquiry.id);
                this.updateCustomer(inquiry.customerId, customer);
            }
        }

        return inquiry;
    },

    getInquiry: function(id) {
        const inquiries = this.get('inquiries') || [];
        return inquiries.find(i => i.id === id);
    },

    getAllInquiries: function() {
        return this.get('inquiries') || [];
    },

    updateInquiry: function(id, updates) {
        const inquiries = this.get('inquiries') || [];
        const index = inquiries.findIndex(i => i.id === id);
        if (index !== -1) {
            inquiries[index] = { ...inquiries[index], ...updates };
            this.set('inquiries', inquiries);
            return inquiries[index];
        }
        return null;
    },

    // ========== QUOTATION MANAGEMENT ==========

    generateQuotationNumber: function() {
        let counter = this.get('quotationCounter') || 1001;
        const year = new Date().getFullYear();
        const number = `QT-${year}-${counter}`;
        this.set('quotationCounter', counter + 1);
        return number;
    },

    addQuotation: function(quotation) {
        const quotations = this.get('quotations') || [];
        quotation.id = Date.now();
        quotation.quotationNumber = this.generateQuotationNumber();
        quotation.createdAt = new Date().toISOString();
        quotation.status = quotation.status || 'draft'; // draft, sent, accepted, rejected
        quotations.push(quotation);
        this.set('quotations', quotations);

        // Add to customer's quotation list
        if (quotation.customerId) {
            const customer = this.getCustomer(quotation.customerId);
            if (customer) {
                if (!customer.quotations) customer.quotations = [];
                customer.quotations.push(quotation.id);
                this.updateCustomer(quotation.customerId, customer);
            }
        }

        return quotation;
    },

    getQuotation: function(id) {
        const quotations = this.get('quotations') || [];
        return quotations.find(q => q.id === id);
    },

    getQuotationByNumber: function(number) {
        const quotations = this.get('quotations') || [];
        return quotations.find(q => q.quotationNumber === number);
    },

    getAllQuotations: function() {
        return this.get('quotations') || [];
    },

    updateQuotation: function(id, updates) {
        const quotations = this.get('quotations') || [];
        const index = quotations.findIndex(q => q.id === id);
        if (index !== -1) {
            quotations[index] = { ...quotations[index], ...updates };
            this.set('quotations', quotations);
            return quotations[index];
        }
        return null;
    },

    deleteQuotation: function(id) {
        let quotations = this.get('quotations') || [];
        quotations = quotations.filter(q => q.id !== id);
        this.set('quotations', quotations);
    },

    // ========== ANALYTICS ==========

    getDashboardStats: function() {
        const quotations = this.getAllQuotations();
        const customers = this.getAllCustomers();
        const inquiries = this.getAllInquiries();

        const totalQuotations = quotations.length;
        const pendingQuotations = quotations.filter(q => q.status === 'draft').length;
        const acceptedQuotations = quotations.filter(q => q.status === 'accepted').length;
        
        // Calculate revenue from accepted quotations
        const revenue = quotations
            .filter(q => q.status === 'accepted')
            .reduce((sum, q) => sum + (q.totalAmount || 0), 0);

        const recentQuotations = quotations.slice(-5).reverse();

        return {
            totalQuotations,
            pendingQuotations,
            acceptedQuotations,
            revenue,
            totalCustomers: customers.length,
            totalInquiries: inquiries.length,
            recentQuotations
        };
    }
};

// Initialize storage on page load
document.addEventListener('DOMContentLoaded', function() {
    Storage.init();
});
