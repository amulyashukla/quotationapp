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
        this.setupStorageListener();
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
            if (products.length > 0) {
                options += products.map(p => `<option value="${p.id}" data-price="${p.price}" data-gst="${p.gst}">${p.name} (${p.brand}) - ${formatCurrency(p.price)}</option>`).join('');
            }
            options += '<option value="manual" data-price="0" data-gst="0">Manual Entry</option>';
            select.innerHTML = options;
        });
    }

    addProductRow() {
        const container = document.getElementById('quotationProducts');
        const newRow = document.createElement('div');
        newRow.className = 'quotation-item';
        newRow.style.cssText = `display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr; gap: var(--spacing-md); margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: var(--light-bg); border-radius: var(--radius-md);`;

        const products = Storage.getAllProducts();
        let productOptions = '';
        if (products.length === 0) {
            productOptions = '<option value="" disabled selected>No products available</option>';
        } else {
            productOptions = '<option value="">-- Select Product --</option>';
            productOptions += products.map(p => `<option value="${p.id}" data-price="${p.price}" data-gst="${p.gst}">${p.name} (${p.brand}) - ${formatCurrency(p.price)}</option>`).join('');
        }

        newRow.style.cssText = `display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 0.5fr; gap: var(--spacing-md); margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: var(--light-bg); border-radius: var(--radius-md);`;
        newRow.innerHTML = `
            <div class="form-input-group">
                <label>Product</label>
                <select class="product-select" onchange="quotationsManager.handleProductSelection(this)">
                    ${productOptions}
                </select>
                <input type="text" class="item-name" placeholder="Enter product name" oninput="quotationsManager.handleManualProductInput(this)">
            </div>
            <div class="form-input-group">
                <label>HSN / ASC</label>
                <input type="text" class="item-hsn" placeholder="HSN or ASC code">
            </div>
            <div class="form-input-group">
                <label>Quantity</label>
                <input type="number" class="item-quantity" min="1" value="1" onchange="quotationsManager.updateItemTotal(this)">
            </div>
            <div class="form-input-group">
                <label>Unit Price</label>
                <input type="number" class="item-price" step="0.01" min="0" onchange="quotationsManager.updateItemTotal(this)">
            </div>
            <div class="form-input-group">
                <label>GST (%)</label>
                <input type="number" class="item-gst" step="0.01" min="0" max="100" onchange="quotationsManager.updateItemTotal(this)">
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
        const quantityInput = row.querySelector('.item-quantity');
        const priceInput = row.querySelector('.item-price');
        const gstInput = row.querySelector('.item-gst');
        const totalInput = row.querySelector('.item-total');

        const quantity = parseInt(quantityInput.value) || 1;
        let price = parseFloat(priceInput.value) || 0;
        let gstPercent = parseFloat(gstInput.value) || 0;

        if (productSelect && productSelect.value && productSelect.value !== 'manual') {
            const option = productSelect.options[productSelect.selectedIndex];
            price = parseFloat(option.dataset.price) || 0;
            gstPercent = parseFloat(option.dataset.gst) || 0;
            priceInput.value = price.toFixed(2);
            gstInput.value = gstPercent.toFixed(2);
        }

        const subtotal = price * quantity;
        const gstAmount = (subtotal * gstPercent) / 100;
        const total = subtotal + gstAmount;

        totalInput.value = total.toFixed(2);
        this.calculateTotals();
    }

    handleProductSelection(element) {
        const row = element.closest('.quotation-item');
        const itemName = row.querySelector('.item-name');
        const priceInput = row.querySelector('.item-price');
        const gstInput = row.querySelector('.item-gst');
        const quantityInput = row.querySelector('.item-quantity');
        const selectedValue = element.value;

        if (selectedValue && selectedValue !== 'manual') {
            const option = element.options[element.selectedIndex];
            const price = parseFloat(option.dataset.price) || 0;
            const gst = parseFloat(option.dataset.gst) || 0;
            itemName.value = option.textContent.split(' - ')[0].trim();
            priceInput.value = price.toFixed(2);
            gstInput.value = gst.toFixed(2);
        } else if (selectedValue === 'manual') {
            itemName.value = '';
            priceInput.value = '0.00';
            gstInput.value = '0.00';
        }

        priceInput.removeAttribute('readonly');
        gstInput.removeAttribute('readonly');
        quantityInput.value = quantityInput.value || 1;
        this.updateItemTotal(priceInput);
    }

    handleManualProductInput(element) {
        const row = element.closest('.quotation-item');
        const productSelect = row.querySelector('.product-select');

        if (element.value.trim()) {
            productSelect.value = 'manual';
        }

        this.updateItemTotal(element);
    }

    calculateTotals() {
        const items = document.querySelectorAll('.quotation-item');
        let subtotal = 0;
        let totalGST = 0;

        items.forEach(item => {
            const quantity = parseInt(item.querySelector('.item-quantity').value) || 1;
            const unitPrice = parseFloat(item.querySelector('.item-price').value) || 0;
            const gstPercent = parseFloat(item.querySelector('.item-gst').value) || 0;
            const itemSubtotal = unitPrice * quantity;
            const gstAmount = (itemSubtotal * gstPercent) / 100;

            subtotal += itemSubtotal;
            totalGST += gstAmount;
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
            <div class="quotation-item" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 0.5fr; gap: var(--spacing-md); margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: var(--light-bg); border-radius: var(--radius-md);">
                <div class="form-input-group">
                    <label>Product</label>
                    <select class="product-select" onchange="quotationsManager.handleProductSelection(this)">
                        <option value="">-- Select Product --</option>
                        <option value="manual" data-price="0" data-gst="0">Manual Entry</option>
                    </select>
                    <input type="text" class="item-name" placeholder="Enter product name" oninput="quotationsManager.handleManualProductInput(this)">
                </div>
                <div class="form-input-group">
                    <label>HSN / ASC</label>
                    <input type="text" class="item-hsn" placeholder="HSN or ASC code">
                </div>
                <div class="form-input-group">
                    <label>Quantity</label>
                    <input type="number" class="item-quantity" min="1" value="1" onchange="quotationsManager.updateItemTotal(this)">
                </div>
                <div class="form-input-group">
                    <label>Unit Price</label>
                    <input type="number" class="item-price" step="0.01" min="0" onchange="quotationsManager.updateItemTotal(this)">
                </div>
                <div class="form-input-group">
                    <label>GST (%)</label>
                    <input type="number" class="item-gst" step="0.01" min="0" max="100" onchange="quotationsManager.updateItemTotal(this)">
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
        this.saveQuotation('sent');
    }

    saveDraft() {
        this.saveQuotation('draft');
    }

    saveQuotation(status) {
        const customerSelect = document.getElementById('customerSelect');
        const customerName = document.getElementById('customerName').value.trim();
        const customerEmail = document.getElementById('customerEmail').value.trim();
        const customerPhone = document.getElementById('customerPhone').value.trim();
        const customerAddress = document.getElementById('customerAddress').value.trim();

        if (!customerName) {
            appManager.showToast('Please enter customer name', 'error');
            return;
        }

        const items = document.querySelectorAll('.quotation-item');
        const products = [];

        items.forEach(item => {
            const productSelect = item.querySelector('.product-select');
            const itemNameInput = item.querySelector('.item-name');
            const quantityInput = item.querySelector('.item-quantity');
            const priceInput = item.querySelector('.item-price');
            const gstInput = item.querySelector('.item-gst');
            const totalInput = item.querySelector('.item-total');

            const selectedValue = productSelect ? productSelect.value : '';
            const nameValue = itemNameInput ? itemNameInput.value.trim() : '';
            const quantity = parseInt(quantityInput.value) || 1;
            const unitPrice = parseFloat(priceInput.value) || 0;
            const gstPercent = parseFloat(gstInput.value) || 0;
            const itemSubtotal = unitPrice * quantity;
            const itemGST = (itemSubtotal * gstPercent) / 100;
            const total = itemSubtotal + itemGST;

            if (!nameValue && (!selectedValue || selectedValue === 'manual')) {
                return;
            }

            let productId = null;
            let productName = nameValue;
            let brand = '';

            if (selectedValue && selectedValue !== 'manual') {
                const product = Storage.getProduct(parseInt(selectedValue));
                if (product) {
                    productId = product.id;
                    productName = productName || product.name;
                    brand = product.brand;
                }
            }

            const hsnCode = item.querySelector('.item-hsn') ? item.querySelector('.item-hsn').value.trim() : '';
            products.push({
                productId: productId,
                productName: productName,
                brand: brand,
                hsn: hsnCode,
                quantity: quantity,
                unitPrice: unitPrice,
                gst: gstPercent,
                total: total
            });
        });

        if (products.length === 0) {
            appManager.showToast('Please add at least one product', 'error');
            return;
        }

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

        const subtotal = products.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0);
        const gstAmount = products.reduce((sum, p) => {
            const itemSubtotal = p.unitPrice * p.quantity;
            return sum + ((itemSubtotal * p.gst) / 100);
        }, 0);
        const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
        const discountAmount = (subtotal * discountPercent) / 100;
        const totalAmount = subtotal + gstAmount - discountAmount;

        const quotationData = {
            customerId: customerId,
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: customerPhone,
            customerAddress: customerAddress,
            subject: document.getElementById('quotationSubject').value.trim(),
            products: products,
            subtotal: subtotal,
            gstAmount: gstAmount,
            discountPercent: discountPercent,
            discountAmount: discountAmount,
            totalAmount: totalAmount,
            notes: document.getElementById('quotationNotes').value.trim(),
            status: status
        };

        if (this.currentEditingId) {
            Storage.updateQuotation(this.currentEditingId, quotationData);
            appManager.showToast(status === 'draft' ? 'Draft saved successfully!' : 'Quotation updated successfully!', 'success');
        } else {
            const quotation = Storage.addQuotation(quotationData);
            appManager.showToast(status === 'draft' ? 'Draft saved successfully!' : 'Quotation created successfully!', 'success');
            this.currentEditingId = quotation.id;
        }

        this.closeQuotationModal();
        this.loadQuotations();
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
        document.getElementById('quotationSubject').value = quotation.subject || '';
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
            productOptions += `<option value="manual" data-price="0" data-gst="0" ${!item.productId ? 'selected' : ''}>Manual Entry</option>`;

            newRow.style.cssText = `display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 0.5fr; gap: var(--spacing-md); margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: var(--light-bg); border-radius: var(--radius-md);`;
            newRow.innerHTML = `
                <div class="form-input-group">
                    <label>Product</label>
                    <select class="product-select" onchange="quotationsManager.handleProductSelection(this)">
                        ${productOptions}
                    </select>
                    <input type="text" class="item-name" placeholder="Enter product name" value="${item.productName}" oninput="quotationsManager.handleManualProductInput(this)">
                </div>
                <div class="form-input-group">
                    <label>HSN / ASC</label>
                    <input type="text" class="item-hsn" placeholder="HSN or ASC code" value="${item.hsn || ''}">
                </div>
                <div class="form-input-group">
                    <label>Quantity</label>
                    <input type="number" class="item-quantity" min="1" value="${item.quantity}" onchange="quotationsManager.updateItemTotal(this)">
                </div>
                <div class="form-input-group">
                    <label>Unit Price</label>
                    <input type="number" class="item-price" step="0.01" min="0" value="${item.unitPrice}" onchange="quotationsManager.updateItemTotal(this)">
                </div>
                <div class="form-input-group">
                    <label>GST (%)</label>
                    <input type="number" class="item-gst" step="0.01" min="0" max="100" value="${item.gst}" onchange="quotationsManager.updateItemTotal(this)">
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
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Poppins', sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: white;
                        color: #1a2332;
                        line-height: 1.6;
                        position: relative;
                    }

                    /* Watermark */
                    body::before {
                        content: 'AKB Engineering';
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 120px;
                        color: rgba(0, 102, 204, 0.05);
                        z-index: -1;
                        pointer-events: none;
                        font-weight: 700;
                    }

                    .quotation {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        border: 1px solid #e0e8f0;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    }

                    /* Header */
                    .header {
                        background: linear-gradient(135deg, #0066cc 0%, #3399ff 100%);
                        color: white;
                        padding: 30px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        position: relative;
                    }

                    .company-info {
                        flex: 1;
                    }

                    .company-info h1 {
                        margin: 0 0 5px 0;
                        font-size: 28px;
                        font-weight: 700;
                        letter-spacing: 0.5px;
                    }

                    .company-info h2 {
                        margin: 0 0 15px 0;
                        font-size: 18px;
                        font-weight: 500;
                        opacity: 0.9;
                    }

                    .company-info p {
                        margin: 3px 0;
                        font-size: 13px;
                        opacity: 0.9;
                    }

                    .quotation-number {
                        text-align: right;
                        background: rgba(255, 255, 255, 0.1);
                        padding: 15px 20px;
                        border-radius: 8px;
                        backdrop-filter: blur(10px);
                    }

                    .quotation-number h2 {
                        margin: 0;
                        font-size: 24px;
                        font-weight: 600;
                    }

                    .quotation-number p {
                        margin: 5px 0 0 0;
                        font-size: 12px;
                        opacity: 0.8;
                    }

                    /* Quotation Title */
                    .quotation-title {
                        text-align: center;
                        padding: 20px;
                        background: #f8fafc;
                        border-bottom: 1px solid #e0e8f0;
                    }

                    .quotation-title h1 {
                        margin: 0;
                        font-size: 32px;
                        font-weight: 700;
                        color: #0066cc;
                        letter-spacing: 2px;
                    }

                    /* Client Info */
                    .client-info {
                        padding: 25px 30px;
                        background: #f8fafc;
                        border-bottom: 1px solid #e0e8f0;
                    }

                    .client-info h3 {
                        margin: 0 0 15px 0;
                        color: #0066cc;
                        font-size: 16px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    .client-info .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                    }

                    .client-info p {
                        margin: 0;
                        font-size: 14px;
                        line-height: 1.5;
                    }

                    .client-info strong {
                        color: #1a2332;
                        font-weight: 600;
                    }

                    /* Table */
                    .products-table {
                        margin: 30px;
                    }

                    .products-table table {
                        width: 100%;
                        border-collapse: collapse;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                    }

                    .products-table th {
                        background: #0066cc;
                        color: white;
                        padding: 15px 12px;
                        text-align: left;
                        font-weight: 600;
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    .products-table td {
                        padding: 12px;
                        border-bottom: 1px solid #e0e8f0;
                        font-size: 14px;
                    }

                    .products-table tbody tr:nth-child(even) {
                        background: #f8fafc;
                    }

                    .products-table tbody tr:hover {
                        background: #e0f2fe;
                    }

                    .products-table .gst-col,
                    .products-table .total-col {
                        font-weight: 600;
                        color: #0066cc;
                    }

                    /* Summary */
                    .summary {
                        margin: 30px;
                        background: #f8fafc;
                        border-radius: 8px;
                        padding: 20px;
                        border: 1px solid #e0e8f0;
                    }

                    .summary-row {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        padding: 8px 0;
                        border-bottom: 1px solid #e0e8f0;
                    }

                    .summary-row:last-child {
                        border-bottom: none;
                        background: #0066cc;
                        color: white;
                        padding: 15px;
                        border-radius: 6px;
                        margin-top: 10px;
                    }

                    .summary-label {
                        font-weight: 600;
                        margin-right: 30px;
                        font-size: 14px;
                    }

                    .summary-value {
                        font-weight: 600;
                        color: #0066cc;
                        font-size: 16px;
                    }

                    .summary-row:last-child .summary-label,
                    .summary-row:last-child .summary-value {
                        color: white;
                        font-size: 18px;
                        font-weight: 700;
                    }

                    /* Notes */
                    .notes {
                        margin: 30px;
                        padding: 20px;
                        background: #fff8e1;
                        border-left: 4px solid #ffb300;
                        border-radius: 0 8px 8px 0;
                    }

                    .notes h4 {
                        margin: 0 0 10px 0;
                        color: #f57c00;
                        font-size: 16px;
                        font-weight: 600;
                    }

                    .notes p {
                        margin: 0;
                        font-size: 14px;
                        line-height: 1.6;
                    }

                    /* Terms */
                    .terms {
                        margin: 30px;
                        padding: 20px;
                        background: #f0f4f8;
                        border-radius: 8px;
                        border: 1px solid #e0e8f0;
                    }

                    .terms h4 {
                        margin: 0 0 15px 0;
                        color: #0066cc;
                        font-size: 16px;
                        font-weight: 600;
                    }

                    .terms p {
                        margin: 0 0 10px 0;
                        font-size: 13px;
                        line-height: 1.6;
                    }

                    /* Footer */
                    .footer {
                        margin: 30px;
                        padding-top: 20px;
                        border-top: 2px solid #e0e8f0;
                        text-align: center;
                    }

                    .thank-you {
                        font-size: 18px;
                        font-weight: 600;
                        color: #0066cc;
                        margin-bottom: 20px;
                    }

                    .signature-section {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 40px;
                    }

                    .signature-box {
                        flex: 1;
                        text-align: center;
                        margin: 0 20px;
                    }

                    .signature-line {
                        border-top: 1px solid #1a2332;
                        width: 200px;
                        margin: 10px auto 5px;
                    }

                    .signature-label {
                        font-size: 12px;
                        color: #666;
                        font-weight: 500;
                    }

                    .footer-contact {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e0e8f0;
                        font-size: 12px;
                        color: #666;
                        text-align: center;
                    }

                    .footer-contact p {
                        margin: 3px 0;
                    }

                    /* Print styles */
                    @media print {
                        body {
                            padding: 0;
                        }
                        .quotation {
                            box-shadow: none;
                            border: none;
                        }
                        .products-table tbody tr:hover {
                            background: transparent;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="quotation">
                    <!-- Header -->
                    <div class="header">
                        <div class="company-info">
                            <h1>grundfos</h1>
                            <h2>${company.name}</h2>
                            <p><strong>GSTIN:</strong> 22AAAAA0000A1Z5</p>
                            <p><strong>Phone:</strong> 9935203521</p>
                            <p><strong>Email:</strong> akbengineering99@gmail.com</p>
                            <p><strong>Website:</strong> www.akbengineering.com</p>
                            <p><strong>Address:</strong> Bhurarani, Rudrapur (U.S. Nagar), Uttarakhand - 263153</p>
                        </div>
                        <div class="quotation-number">
                            <h2>${quotation.quotationNumber}</h2>
                            <p>Date: ${date}</p>
                        </div>
                    </div>

                    <!-- Quotation Title -->
                    <div class="quotation-title">
                        <h1>QUOTATION</h1>
                    </div>

                    <!-- Client Info -->
                    <div class="client-info">
                        <h3>Bill To:</h3>
                        <div class="info-grid">
                            <div>
                                <p><strong>${quotation.customerName}</strong></p>
                                <p><strong>Subject:</strong> ${quotation.subject || ''}</p>
                                <p><strong>Address:</strong> ${quotation.customerAddress}</p>
                            </div>
                            <div>
                                <p><strong>Email:</strong> ${quotation.customerEmail}</p>
                                <p><strong>Phone:</strong> ${quotation.customerPhone}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Products Table -->
                    <div class="products-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Product</th>
                                    <th>HSN / ASC</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th class="gst-col">GST %</th>
                                    <th class="total-col">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${quotation.products.map((p, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${p.productName}${p.brand ? ` (${p.brand})` : ''}</td>
                                        <td>${p.hsn || ''}</td>
                                        <td>${p.quantity}</td>
                                        <td>₹${p.unitPrice.toFixed(2)}</td>
                                        <td class="gst-col">${p.gst.toFixed(2)}%</td>
                                        <td class="total-col">₹${p.total.toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Summary -->
                    <div class="summary">
                        <div class="summary-row">
                            <span class="summary-label">Subtotal:</span>
                            <span class="summary-value">₹${quotation.subtotal.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">GST (Total):</span>
                            <span class="summary-value">₹${quotation.gstAmount.toFixed(2)}</span>
                        </div>
                        ${quotation.discountPercent > 0 ? `
                            <div class="summary-row">
                                <span class="summary-label">Discount (${quotation.discountPercent}%):</span>
                                <span class="summary-value">-₹${quotation.discountAmount.toFixed(2)}</span>
                            </div>
                        ` : ''}
                        <div class="summary-row">
                            <span class="summary-label">Grand Total:</span>
                            <span class="summary-value">₹${quotation.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    ${quotation.notes ? `
                        <div class="notes">
                            <h4>Notes:</h4>
                            <p>${quotation.notes}</p>
                        </div>
                    ` : ''}

                    <div class="terms">
                        <h4>Terms & Conditions:</h4>
                        <p>1. Payment terms: 50% advance, 50% before delivery</p>
                        <p>2. Delivery within 7-10 working days from order confirmation</p>
                        <p>3. Warranty: 1 year on manufacturing defects</p>
                        <p>4. All disputes subject to Rudrapur jurisdiction</p>
                        <p>5. Prices are valid for 30 days from quotation date</p>
                    </div>

                    <div class="footer">
                        <div class="thank-you">Thank you for your business!</div>

                        <div class="signature-section">
                            <div class="signature-box">
                                <p>Customer Signature</p>
                                <div class="signature-line"></div>
                                <p class="signature-label">Date: _______________</p>
                            </div>
                            <div class="signature-box">
                                <p>For ${company.name}</p>
                                <div class="signature-line"></div>
                                <p class="signature-label">Authorized Signature</p>
                            </div>
                        </div>

                        <div class="footer-contact">
                            <p><strong>${company.name}</strong></p>
                            <p>Phone: 9935203521 | Email: akbengineering99@gmail.com</p>
                            <p>Bhurarani, Rudrapur (U.S. Nagar), Uttarakhand - 263153</p>
                        </div>
                    </div>
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

    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'products' || event.key === 'customers') {
                this.populateCustomerSelect();
                this.populateProducts();
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.quotationsManager = new QuotationsManager();
});
