/**
 * Customers Management Module
 * Handles CRUD operations for customers
 */

class CustomersManager {
    constructor() {
        this.currentUser = Storage.getCurrentUser();
        this.currentEditingId = null;
        this.initializeEventListeners();
        this.loadCustomers();
    }

    initializeEventListeners() {
        // Add customer button
        const addCustomerBtn = document.getElementById('addCustomerBtn');
        if (addCustomerBtn) {
            addCustomerBtn.addEventListener('click', () => this.openAddModal());
        }

        // Modal close
        const modalClose = document.getElementById('customerModalClose');
        const cancelBtn = document.getElementById('cancelCustomerBtn');
        const modal = document.getElementById('customerModal');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        // Form submit
        const customerForm = document.getElementById('customerForm');
        if (customerForm) {
            customerForm.addEventListener('submit', (e) => this.handleCustomerSubmit(e));
        }

        // Search
        const searchBox = document.getElementById('customerSearch');
        if (searchBox) {
            searchBox.addEventListener('keyup', (e) => this.handleSearch(e.target.value));
        }
    }

    loadCustomers() {
        const customers = Storage.getAllCustomers();
        this.displayCustomers(customers);
    }

    displayCustomers(customers) {
        const tableBody = document.getElementById('customersTable');
        if (!tableBody) return;

        if (customers.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-muted); padding: var(--spacing-xl);">
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fas fa-users"></i></div>
                            <div class="empty-state-title">No customers yet</div>
                            <p style="color: var(--text-muted);">Add your first customer to get started</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = customers.map(customer => `
            <tr>
                <td><strong>${customer.name}</strong></td>
                <td>${customer.email || 'N/A'}</td>
                <td>${customer.phone || 'N/A'}</td>
                <td>${customer.address || 'N/A'}</td>
                <td>
                    <span style="background: #e0e7ff; color: #3730a3; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                        ${(customer.quotations ? customer.quotations.length : 0)}
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-sm btn-secondary" onclick="customersManager.viewCustomer(${customer.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="customersManager.editCustomer(${customer.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="customersManager.deleteCustomer(${customer.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    openAddModal() {
        this.currentEditingId = null;
        this.resetForm();
        document.getElementById('customerModalTitle').textContent = 'Add Customer';
        document.getElementById('customerModal').classList.add('active');
    }

    editCustomer(id) {
        const customer = Storage.getCustomer(id);
        if (!customer) return;

        this.currentEditingId = id;
        document.getElementById('customerModalTitle').textContent = 'Edit Customer';

        // Fill form with customer data
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerEmail').value = customer.email || '';
        document.getElementById('customerPhone').value = customer.phone || '';
        document.getElementById('customerCity').value = customer.city || '';
        document.getElementById('customerState').value = customer.state || '';
        document.getElementById('customerZip').value = customer.zip || '';
        document.getElementById('customerAddress').value = customer.address || '';

        document.getElementById('customerModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('customerModal').classList.remove('active');
        this.resetForm();
        this.currentEditingId = null;
    }

    resetForm() {
        document.getElementById('customerForm').reset();
    }

    handleCustomerSubmit(event) {
        event.preventDefault();

        const customerData = {
            name: document.getElementById('customerName').value.trim(),
            email: document.getElementById('customerEmail').value.trim(),
            phone: document.getElementById('customerPhone').value.trim(),
            city: document.getElementById('customerCity').value.trim(),
            state: document.getElementById('customerState').value.trim(),
            zip: document.getElementById('customerZip').value.trim(),
            address: document.getElementById('customerAddress').value.trim()
        };

        // Validation
        if (!customerData.name || !customerData.phone) {
            appManager.showToast('Please fill all required fields', 'error');
            return;
        }

        if (!validatePhone(customerData.phone)) {
            appManager.showToast('Please enter a valid phone number', 'error');
            return;
        }

        if (customerData.email && !validateEmail(customerData.email)) {
            appManager.showToast('Please enter a valid email', 'error');
            return;
        }

        // Save
        if (this.currentEditingId) {
            Storage.updateCustomer(this.currentEditingId, customerData);
            appManager.showToast('Customer updated successfully!', 'success');
        } else {
            Storage.addCustomer(customerData);
            appManager.showToast('Customer added successfully!', 'success');
        }

        this.closeModal();
        this.loadCustomers();
    }

    viewCustomer(id) {
        const customer = Storage.getCustomer(id);
        if (!customer) return;

        // Show customer details modal
        const customerQuotations = Storage.getAllQuotations().filter(q => q.customerId === id);
        const customerInquiries = Storage.getAllInquiries().filter(i => i.customerId === id);

        alert(`
Customer: ${customer.name}
Email: ${customer.email || 'N/A'}
Phone: ${customer.phone}
Address: ${customer.address || 'N/A'}

Total Quotations: ${customerQuotations.length}
Total Inquiries: ${customerInquiries.length}
        `);
    }

    deleteCustomer(id) {
        const customer = Storage.getCustomer(id);
        if (!customer) return;

        if (confirm(`Are you sure you want to delete "${customer.name}" and all related records?`)) {
            Storage.deleteCustomer(id);
            appManager.showToast('Customer deleted successfully!', 'success');
            this.loadCustomers();
        }
    }

    handleSearch(query) {
        const customers = Storage.getAllCustomers();
        
        if (!query.trim()) {
            this.displayCustomers(customers);
            return;
        }

        const filtered = customers.filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.email.toLowerCase().includes(query.toLowerCase()) ||
            c.phone.includes(query)
        );

        this.displayCustomers(filtered);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.customersManager = new CustomersManager();
});
