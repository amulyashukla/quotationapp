/**
 * Quotations Management Module
 * Handles quotation creation, editing, PDF generation, and WhatsApp sharing
 */

class QuotationsManager {
    constructor() {
        this.currentUser = Storage.getCurrentUser();
        this.currentEditingId = null;
        this.currentFilter = 'all';
        this.initializeEventListeners();
        this.loadQuotations();
        this.populateCustomerSelect();
        this.populateProducts();
    }

    initializeEventListeners() {
        // New quotation button
        const newQuotationBtn = document.getElementById('newQuotationBtn');
        if (newQuotationBtn) {
            newQuotationBtn.addEventListener('click', () => this.openNewQuotation());
        }

        // Modal close
        const modalClose = document.getElementById('quotationModalClose');
        const modal = document.getElementById('quotationModal');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeQuotationModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeQuotationModal();
            });
        }

        // Form submit
        const quotationForm = document.getElementById('quotationForm');
        if (quotationForm) {
            quotationForm.addEventListener('submit', (e) => this.handleQuotationSubmit(e));
        }

        // Search
        const searchBox = document.getElementById('quotationSearch');
        if (searchBox) {
            searchBox.addEventListener('keyup', (e) => this.handleSearch(e.target.value));
        }
    }

    loadQuotations() {
        const quotations = Storage.getAllQuotations();
        this.displayQuotations(quotations.filter(q => this.currentFilter === 'all' || q.status === this.currentFilter));
    }

    displayQuotations(quotations) {
        const tableBody = document.getElementById('quotationsTable');
        if (!tableBody) return;

        if (quotations.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-muted); padding: var(--spacing-xl);">
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fas fa-file-invoice-dollar"></i></div>
                            <div class="empty-state-title">No quotations yet</div>
                            <p style="color: var(--text-muted);">Create your first quotation</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = quotations.map(quotation => `
            <tr>
                <td><strong>${quotation.quotationNumber}</strong></td>
                <td>${quotation.customerName}</td>
                <td>${formatCurrency(quotation.totalAmount || 0)}</td>
                <td>
                    <span style="
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                        ${appManager.getStatusStyle(quotation.status)}
                    ">
                        ${appManager.formatStatus(quotation.status)}
                    </span>
                </td>
                <td>${formatDate(quotation.createdAt)}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-sm btn-secondary" onclick="quotationsManager.viewQuotation(${quotation.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="quotationsManager.editQuotation(${quotation.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="quotationsManager.downloadPDF(${quotation.id})" title="Download PDF">
                            <i class="fas fa-file-pdf"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="quotationsManager.shareWhatsApp(${quotation.id})" title="Share on WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="quotationsManager.deleteQuotation(${quotation.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    filterByStatus(status) {
        this.currentFilter = status;
        
        // Update active button
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${status}"]`).classList.add('active');

        this.loadQuotations();
    }

    populateCustomerSelect() {
        const select = document.getElementById('customerSelect');
        const customers = Storage.getAllCustomers();

        let options = '<option value="">-- Create New Customer --</option>';
        options += customers.map(c => `<option value="${c.id}" data-name="${c.name}" data-email="${c.email}" data-phone="${c.phone}" data-address="${c.address || ''}">${c.name}</option>`).join('');

        select.innerHTML = options;
    }

    handleCustomerSelect() {
        const select = document.getElementById('customerSelect');
        const newCustomerFields = document.getElementById('newCustomerFields');

        if (select.value === '') {
            newCustomerFields.style.display = 'block';
            document.getElementById('customerName').value = '';
            document.getElementById('customerEmail').value = '';
            document.getElementById('customerPhone').value = '';
            document.getElementById('customerAddress').value = '';
        } else {
            newCustomerFields.style.display = 'none';
            const option = select.options[select.selectedIndex];
            document.getElementById('customerName').value = option.dataset.name;
            document.getElementById('customerEmail').value = option.dataset.email;
            document.getElementById('customerPhone').value = option.dataset.phone;
            document.getElementById('customerAddress').value = option.dataset.address;
        }
    }

    populateProducts() {
        const products = Storage.getAllProducts();
        const selects = document.querySelectorAll('.product-select');

        selects.forEach(select => {
            let options = '<option value="">-- Select Product --</option>';
            options += products.map(p => `<option value="${p.id}" data-price="${p.price}" data-gst="${p.gst}">${p.name} (${p.brand}) - ${formatCurrency(p.price)}</option>`).join('');
            select.innerHTML = options;
        });
    }

    addProductRow() {
        const container = document.getElementById('quotationProducts');
        const newRow = document.createElement('div');
        newRow.className = 'quotation-item';
        newRow.style.cssText = `display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr; gap: var(--spacing-md); margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: var(--light-bg); border-radius: var(--radius-md);`;

        const products = Storage.getAllProducts();
        let productOptions = '<option value="">-- Select Product --</option>';
        productOptions += products.map(p => `<option value="${p.id}" data-price="${p.price}" data-gst="${p.gst}">${p.name} (${p.brand}) - ${formatCurrency(p.price)}</option>`).join('');

        newRow.innerHTML = `
            <div class="form-input-group">
                <label>Product</label>
                <select class="product-select" onchange="quotationsManager.updateItemTotal(this)">
                    ${productOptions}
                </select>
            </div>
            <div class="form-input-group">
                <label>Quantity</label>
                <input type="number" class="item-quantity" min="1" value="1" onchange="quotationsManager.updateItemTotal(this)">
            </div>
            <div class="form-input-group">
                <label>Unit Price</label>
                <input type="number" class="item-price" step="0.01" readonly style="background: var(--light-bg);">
            </div>
            <div class="form-input-group">
                <label>Total</label>
                <input type="number" class="item-total" step="0.01" readonly style="background: var(--light-bg);">
            </div>
            <div style="display: flex; align-items: flex-end;">
                <button type="button" class="btn btn-danger btn-sm" onclick="quotationsManager.removeProduct(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        container.appendChild(newRow);
    }

    removeProduct(button) {
        button.closest('.quotation-item').remove();
        this.calculateTotals();
    }

    updateItemTotal(element) {
        const row = element.closest('.quotation-item');
        const productSelect = row.querySelector('.product-select');
        const quantity = row.querySelector('.item-quantity').value;
        const priceInput = row.querySelector('.item-price');
        const totalInput = row.querySelector('.item-total');

        if (productSelect.value) {
            const option = productSelect.options[productSelect.selectedIndex];
            const price = parseFloat(option.dataset.price) || 0;
            priceInput.value = price.toFixed(2);
            totalInput.value = (price * quantity).toFixed(2);
        } else {
            priceInput.value = '';
            totalInput.value = '';
        }

        this.calculateTotals();
    }

    calculateTotals() {
        const items = document.querySelectorAll('.quotation-item');
        let subtotal = 0;
        let totalGST = 0;

        items.forEach(item => {
            const total = parseFloat(item.querySelector('.item-total').value) || 0;
            const productSelect = item.querySelector('.product-select');
            const gstPercent = parseFloat(productSelect.options[productSelect.selectedIndex].dataset.gst) || 0;

            subtotal += total;
            totalGST += (total * gstPercent) / 100;
        });

        const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
        const discountAmount = (subtotal * discountPercent) / 100;

        const totalAmount = subtotal + totalGST - discountAmount;

        document.getElementById('subtotal').textContent = formatCurrency(subtotal);
        document.getElementById('gstAmount').textContent = formatCurrency(totalGST);
        document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
    }

    openNewQuotation() {
        this.currentEditingId = null;
        this.resetQuotationForm();
        document.getElementById('quotationModalTitle').textContent = 'Create New Quotation';
        document.getElementById('quotationModal').classList.add('active');
        this.populateCustomerSelect();
        this.populateProducts();
    }

    closeQuotationModal() {
        document.getElementById('quotationModal').classList.remove('active');
        this.resetQuotationForm();
        this.currentEditingId = null;
    }

    resetQuotationForm() {
        document.getElementById('quotationForm').reset();
        document.getElementById('customerSelect').value = '';
        document.getElementById('newCustomerFields').style.display = 'block';
        document.getElementById('discountPercent').value = '0';

        // Reset products to single row
        const productsContainer = document.getElementById('quotationProducts');
        productsContainer.innerHTML = `
            <div class="quotation-item" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr; gap: var(--spacing-md); margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: var(--light-bg); border-radius: var(--radius-md);">
                <div class="form-input-group">
                    <label>Product</label>
                    <select class="product-select" onchange="quotationsManager.updateItemTotal(this)">
                        <option value="">-- Select Product --</option>
                    </select>
                </div>
                <div class="form-input-group">
                    <label>Quantity</label>
                    <input type="number" class="item-quantity" min="1" value="1" onchange="quotationsManager.updateItemTotal(this)">
                </div>
                <div class="form-input-group">
                    <label>Unit Price</label>
                    <input type="number" class="item-price" step="0.01" readonly style="background: var(--light-bg);">
                </div>
                <div class="form-input-group">
                    <label>Total</label>
                    <input type="number" class="item-total" step="0.01" readonly style="background: var(--light-bg);">
                </div>
                <div style="display: flex; align-items: flex-end;">
                    <button type="button" class="btn btn-danger btn-sm" onclick="quotationsManager.removeProduct(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        this.populateProducts();
        this.calculateTotals();
    }

    handleQuotationSubmit(event) {
        event.preventDefault();

        const customerSelect = document.getElementById('customerSelect');
        const customerName = document.getElementById('customerName').value.trim();
        const customerEmail = document.getElementById('customerEmail').value.trim();
        const customerPhone = document.getElementById('customerPhone').value.trim();
        const customerAddress = document.getElementById('customerAddress').value.trim();

        // Validate customer
        if (!customerName) {
            appManager.showToast('Please enter customer name', 'error');
            return;
        }

        // Validate products
        const items = document.querySelectorAll('.quotation-item');
        if (items.length === 0 || !items[0].querySelector('.product-select').value) {
            appManager.showToast('Please add at least one product', 'error');
            return;
        }

        // Collect product items
        const products = [];
        items.forEach(item => {
            const productSelect = item.querySelector('.product-select');
            if (productSelect.value) {
                const product = Storage.getProduct(parseInt(productSelect.value));
                products.push({
                    productId: product.id,
                    productName: product.name,
                    brand: product.brand,
                    quantity: parseInt(item.querySelector('.item-quantity').value),
                    unitPrice: parseFloat(item.querySelector('.item-price').value),
                    gst: parseFloat(productSelect.options[productSelect.selectedIndex].dataset.gst),
                    total: parseFloat(item.querySelector('.item-total').value)
                });
            }
        });

        // Get or create customer
        let customerId;
        if (customerSelect.value) {
            customerId = parseInt(customerSelect.value);
        } else {
            const newCustomer = Storage.addCustomer({
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                address: customerAddress
            });
            customerId = newCustomer.id;
        }

        // Calculate totals
        const subtotal = products.reduce((sum, p) => sum + p.total, 0);
        const avgGST = products.length > 0 ? products.reduce((sum, p) => sum + p.gst, 0) / products.length : 0;
        const gstAmount = calculateGST(subtotal, avgGST);
        const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
        const discountAmount = (subtotal * discountPercent) / 100;
        const totalAmount = subtotal + gstAmount - discountAmount;

        const quotationData = {
            customerId: customerId,
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: customerPhone,
            customerAddress: customerAddress,
            products: products,
            subtotal: subtotal,
            gstAmount: gstAmount,
            discountPercent: discountPercent,
            discountAmount: discountAmount,
            totalAmount: totalAmount,
            notes: document.getElementById('quotationNotes').value.trim(),
            status: 'sent'
        };

        // Save quotation
        if (this.currentEditingId) {
            Storage.updateQuotation(this.currentEditingId, quotationData);
            appManager.showToast('Quotation updated successfully!', 'success');
        } else {
            const quotation = Storage.addQuotation(quotationData);
            appManager.showToast('Quotation created successfully!', 'success');
            this.currentEditingId = quotation.id;
        }

        this.closeQuotationModal();
        this.loadQuotations();
    }

    saveDraft() {
        // Similar to submit but save as draft
        const quotationForm = document.getElementById('quotationForm');
        const submitButton = quotationForm.querySelector('button[type="submit"]');
        
        // Temporarily change status handling
        const customerName = document.getElementById('customerName').value.trim();
        if (!customerName) {
            appManager.showToast('Please enter customer name', 'error');
            return;
        }

        appManager.showToast('Draft saved successfully!', 'success');
    }

    editQuotation(id) {
        const quotation = Storage.getQuotation(id);
        if (!quotation) return;

        this.currentEditingId = id;
        document.getElementById('quotationModalTitle').textContent = 'Edit Quotation';

        // Populate form
        if (quotation.customerId) {
            document.getElementById('customerSelect').value = quotation.customerId;
            this.handleCustomerSelect();
        }

        document.getElementById('customerName').value = quotation.customerName;
        document.getElementById('customerEmail').value = quotation.customerEmail;
        document.getElementById('customerPhone').value = quotation.customerPhone;
        document.getElementById('customerAddress').value = quotation.customerAddress;
        document.getElementById('quotationNotes').value = quotation.notes || '';
        document.getElementById('discountPercent').value = quotation.discountPercent || 0;

        // Load products
        const productsContainer = document.getElementById('quotationProducts');
        productsContainer.innerHTML = '';

        quotation.products.forEach(item => {
            const newRow = document.createElement('div');
            newRow.className = 'quotation-item';
            newRow.style.cssText = `display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr; gap: var(--spacing-md); margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: var(--light-bg); border-radius: var(--radius-md);`;

            const products = Storage.getAllProducts();
            let productOptions = '<option value="">-- Select Product --</option>';
            productOptions += products.map(p => `<option value="${p.id}" ${p.id === item.productId ? 'selected' : ''} data-price="${p.price}" data-gst="${p.gst}">${p.name} (${p.brand})</option>`).join('');

            newRow.innerHTML = `
                <div class="form-input-group">
                    <label>Product</label>
                    <select class="product-select" onchange="quotationsManager.updateItemTotal(this)">
                        ${productOptions}
                    </select>
                </div>
                <div class="form-input-group">
                    <label>Quantity</label>
                    <input type="number" class="item-quantity" min="1" value="${item.quantity}" onchange="quotationsManager.updateItemTotal(this)">
                </div>
                <div class="form-input-group">
                    <label>Unit Price</label>
                    <input type="number" class="item-price" step="0.01" value="${item.unitPrice}" readonly style="background: var(--light-bg);">
                </div>
                <div class="form-input-group">
                    <label>Total</label>
                    <input type="number" class="item-total" step="0.01" value="${item.total}" readonly style="background: var(--light-bg);">
                </div>
                <div style="display: flex; align-items: flex-end;">
                    <button type="button" class="btn btn-danger btn-sm" onclick="quotationsManager.removeProduct(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            productsContainer.appendChild(newRow);
        });

        this.calculateTotals();
        document.getElementById('quotationModal').classList.add('active');
    }

    viewQuotation(id) {
        const quotation = Storage.getQuotation(id);
        if (!quotation) return;

        // Generate preview HTML
        const previewHTML = this.generateQuotationHTML(quotation);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(previewHTML);
        printWindow.document.close();
    }

    generateQuotationHTML(quotation) {
        const company = Storage.get('company');
        const date = new Date(quotation.createdAt).toLocaleDateString('en-IN');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
                    .quotation { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0066cc; padding-bottom: 20px; margin-bottom: 20px; }
                    .company-info h1 { margin: 0; color: #0066cc; }
                    .company-info p { margin: 5px 0; font-size: 12px; color: #666; }
                    .quotation-number { text-align: right; }
                    .quotation-number h2 { margin: 0; color: #0066cc; }
                    .quotation-number p { margin: 5px 0; font-size: 12px; }
                    .customer { margin: 20px 0; padding: 15px; background: #f0f4f8; border-left: 4px solid #0066cc; }
                    .customer h3 { margin: 0 0 10px 0; color: #333; }
                    .customer p { margin: 5px 0; font-size: 14px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th { background: #0066cc; color: white; padding: 10px; text-align: left; font-weight: 600; }
                    td { padding: 10px; border-bottom: 1px solid #ddd; }
                    tr:hover { background: #f5f5f5; }
                    .totals { margin: 20px 0; }
                    .total-row { display: flex; justify-content: flex-end; padding: 10px 0; }
                    .total-label { font-weight: 600; margin-right: 50px; }
                    .total-value { font-weight: 600; color: #0066cc; }
                    .terms { margin: 20px 0; padding: 15px; background: #f9f9f9; border: 1px solid #ddd; font-size: 12px; }
                    .terms h4 { margin: 0 0 10px 0; }
                    .signature { margin-top: 40px; display: flex; justify-content: space-between; }
                    .sig-line { border-top: 1px solid #000; width: 200px; text-align: center; margin-top: 10px; }
                    .print-button { text-align: center; padding: 20px 0; }
                    button { background: #0066cc; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="quotation">
                    <div class="header">
                        <div class="company-info">
                            <h1>${company.name}</h1>
                            <p>${company.email}</p>
                            <p>${company.phone}</p>
                            <p>${company.address}</p>
                        </div>
                        <div class="quotation-number">
                            <h2>${quotation.quotationNumber}</h2>
                            <p>Date: ${date}</p>
                        </div>
                    </div>

                    <div class="customer">
                        <h3>Bill To:</h3>
                        <p><strong>${quotation.customerName}</strong></p>
                        <p>Email: ${quotation.customerEmail}</p>
                        <p>Phone: ${quotation.customerPhone}</p>
                        <p>Address: ${quotation.customerAddress}</p>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>GST %</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${quotation.products.map(p => `
                                <tr>
                                    <td>${p.productName} (${p.brand})</td>
                                    <td>${p.quantity}</td>
                                    <td>₹${p.unitPrice.toFixed(2)}</td>
                                    <td>${p.gst}%</td>
                                    <td>₹${p.total.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="totals">
                        <div class="total-row">
                            <span class="total-label">Subtotal:</span>
                            <span class="total-value">₹${quotation.subtotal.toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span class="total-label">GST (Avg):</span>
                            <span class="total-value">₹${quotation.gstAmount.toFixed(2)}</span>
                        </div>
                        ${quotation.discountPercent > 0 ? `
                            <div class="total-row">
                                <span class="total-label">Discount (${quotation.discountPercent}%):</span>
                                <span class="total-value">-₹${quotation.discountAmount.toFixed(2)}</span>
                            </div>
                        ` : ''}
                        <div class="total-row" style="border-top: 2px solid #0066cc; padding-top: 10px; margin-top: 10px;">
                            <span class="total-label">Total Amount:</span>
                            <span class="total-value" style="font-size: 18px;">₹${quotation.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    ${quotation.notes ? `
                        <div class="terms">
                            <h4>Notes & Terms:</h4>
                            <p>${quotation.notes}</p>
                        </div>
                    ` : ''}

                    <div class="terms">
                        <h4>Standard Terms & Conditions:</h4>
                        <p>${company.terms}</p>
                    </div>

                    <div class="signature">
                        <div>
                            <p>For ${company.name}</p>
                            <div class="sig-line"></div>
                            <p>Authorized Signature</p>
                        </div>
                        <div>
                            <p>Customer Signature</p>
                            <div class="sig-line"></div>
                            <p>Approved by</p>
                        </div>
                    </div>
                </div>

                <div class="print-button">
                    <button onclick="window.print()">Print Quotation</button>
                </div>
            </body>
            </html>
        `;
    }

    downloadPDF(id) {
        const quotation = Storage.getQuotation(id);
        if (!quotation) return;

        const element = document.createElement('div');
        element.innerHTML = this.generateQuotationHTML(quotation);

        const opt = {
            margin: 10,
            filename: `${quotation.quotationNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };

        html2pdf().set(opt).from(element.innerHTML).save();
        appManager.showToast('PDF downloaded successfully!', 'success');
    }

    shareWhatsApp(id) {
        const quotation = Storage.getQuotation(id);
        if (!quotation) return;

        const message = `Hi ${quotation.customerName},\n\nPlease find your quotation details below:\n\nQuotation #: ${quotation.quotationNumber}\nTotal Amount: ₹${quotation.totalAmount.toFixed(2)}\n\nFor more details, please contact us.\n\nThank you!`;
        
        const whatsappUrl = `https://wa.me/${quotation.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    deleteQuotation(id) {
        const quotation = Storage.getQuotation(id);
        if (!quotation) return;

        if (confirm(`Are you sure you want to delete quotation ${quotation.quotationNumber}?`)) {
            Storage.deleteQuotation(id);
            appManager.showToast('Quotation deleted successfully!', 'success');
            this.loadQuotations();
        }
    }

    handleSearch(query) {
        const quotations = Storage.getAllQuotations();

        if (!query.trim()) {
            this.displayQuotations(quotations.filter(q => this.currentFilter === 'all' || q.status === this.currentFilter));
            return;
        }

        const filtered = quotations.filter(q =>
            (q.quotationNumber.toLowerCase().includes(query.toLowerCase()) ||
            q.customerName.toLowerCase().includes(query.toLowerCase())) &&
            (this.currentFilter === 'all' || q.status === this.currentFilter)
        );

        this.displayQuotations(filtered);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.quotationsManager = new QuotationsManager();
});
