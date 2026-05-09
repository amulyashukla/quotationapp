/**
 * Products Management Module
 * Handles CRUD operations for products
 */

class ProductsManager {
    constructor() {
        this.currentUser = Storage.getCurrentUser();
        this.currentEditingId = null;
        this.initializeEventListeners();
        this.loadProducts();
    }

    initializeEventListeners() {
        // Add product button
        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => this.openAddModal());
        }

        // Modal close
        const modalClose = document.getElementById('modalClose');
        const cancelBtn = document.getElementById('cancelProductBtn');
        const modal = document.getElementById('productModal');

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
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleProductSubmit(e));
        }

        // Search
        const searchBox = document.getElementById('productSearch');
        if (searchBox) {
            searchBox.addEventListener('keyup', (e) => this.handleSearch(e.target.value));
        }
    }

    loadProducts() {
        const products = Storage.getAllProducts();
        this.displayProducts(products);
    }

    displayProducts(products) {
        const tableBody = document.getElementById('productsTable');
        if (!tableBody) return;

        if (products.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: var(--spacing-xl);">
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fas fa-box"></i></div>
                            <div class="empty-state-title">No products yet</div>
                            <p style="color: var(--text-muted);">Add your first product to get started</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = products.map(product => `
            <tr>
                <td><strong>${product.name}</strong></td>
                <td>${product.brand}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${this.formatCategory(product.category)}</td>
                <td>${product.gst}%</td>
                <td>${product.warranty} months</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-sm btn-secondary" onclick="productsManager.editProduct(${product.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="productsManager.deleteProduct(${product.id})" title="Delete">
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
        document.getElementById('modalTitle').textContent = 'Add Product';
        document.getElementById('productModal').classList.add('active');
    }

    editProduct(id) {
        const product = Storage.getProduct(id);
        if (!product) return;

        this.currentEditingId = id;
        document.getElementById('modalTitle').textContent = 'Edit Product';

        // Fill form with product data
        document.getElementById('productName').value = product.name;
        document.getElementById('productBrand').value = product.brand;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productGST').value = product.gst;
        document.getElementById('productQuantity').value = product.quantity || 0;
        document.getElementById('productWarranty').value = product.warranty || 24;
        document.getElementById('productHP').value = product.hp || '';
        document.getElementById('productDescription').value = product.description || '';

        document.getElementById('productModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('productModal').classList.remove('active');
        this.resetForm();
        this.currentEditingId = null;
    }

    resetForm() {
        document.getElementById('productForm').reset();
        document.getElementById('productGST').value = '18';
        document.getElementById('productQuantity').value = '0';
        document.getElementById('productWarranty').value = '24';
    }

    handleProductSubmit(event) {
        event.preventDefault();

        const productData = {
            name: document.getElementById('productName').value.trim(),
            brand: document.getElementById('productBrand').value.trim(),
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            gst: parseFloat(document.getElementById('productGST').value),
            quantity: parseInt(document.getElementById('productQuantity').value) || 0,
            warranty: parseInt(document.getElementById('productWarranty').value) || 24,
            hp: document.getElementById('productHP').value.trim() || '',
            description: document.getElementById('productDescription').value.trim()
        };

        // Validation
        if (!productData.name || !productData.brand || !productData.category || !productData.price) {
            appManager.showToast('Please fill all required fields', 'error');
            return;
        }

        if (productData.price < 0) {
            appManager.showToast('Price cannot be negative', 'error');
            return;
        }

        // Save
        if (this.currentEditingId) {
            Storage.updateProduct(this.currentEditingId, productData);
            appManager.showToast('Product updated successfully!', 'success');
        } else {
            Storage.addProduct(productData);
            appManager.showToast('Product added successfully!', 'success');
        }

        this.closeModal();
        this.loadProducts();
    }

    deleteProduct(id) {
        const product = Storage.getProduct(id);
        if (!product) return;

        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            Storage.deleteProduct(id);
            appManager.showToast('Product deleted successfully!', 'success');
            this.loadProducts();
        }
    }

    handleSearch(query) {
        const products = Storage.getAllProducts();
        
        if (!query.trim()) {
            this.displayProducts(products);
            return;
        }

        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.brand.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        );

        this.displayProducts(filtered);
    }

    formatCategory(category) {
        const categoryMap = {
            pumps: 'Industrial Pumps',
            motors: 'Motors',
            valves: 'Valves',
            compressors: 'Compressors',
            accessories: 'Accessories',
            other: 'Other'
        };
        return categoryMap[category] || category;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.productsManager = new ProductsManager();
});
