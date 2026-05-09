<!-- DEVELOPER_REFERENCE.md -->

# Developer Reference & API Documentation

Complete technical reference for developers extending or maintaining the AKB Engineering Quotation System.

---

## 📚 Table of Contents
1. [Storage API](#storage-api)
2. [Authentication API](#authentication-api)
3. [Application Utilities](#application-utilities)
4. [Module APIs](#module-apis)
5. [Data Structures](#data-structures)
6. [Event System](#event-system)
7. [CSS Architecture](#css-architecture)
8. [Best Practices](#best-practices)

---

## Storage API

### Overview
Central data persistence layer. All data stored in localStorage as JSON.

### Initialization
```javascript
// Auto-initialized on app load
Storage.init();  // Loads default data if first time
```

### User Management

#### Authenticate User
```javascript
// Parameters: username (string), password (string)
// Returns: user object or null

const user = Storage.authenticateUser('admin', '123456');
if (user) {
    console.log('Login successful:', user.name);
}
```

#### Save Current User
```javascript
Storage.saveCurrentUser(userObject);
```

#### Get Current User
```javascript
const currentUser = Storage.getCurrentUser();
// Returns: {id, username, name, email, role, createdAt}
```

#### Logout User
```javascript
Storage.logoutUser();  // Clears session
```

---

### Product Management

#### Add Product
```javascript
const newProduct = Storage.addProduct({
    name: 'Centrifugal Pump',
    brand: 'Kirloskar',
    category: 'pumps',
    price: 25000,
    gst: 18,
    quantity: 50,
    warranty: 24,
    hp: '5',
    description: 'Industrial pump'
});
// Returns: product with id and createdAt
```

#### Get Product
```javascript
const product = Storage.getProduct(productId);
// Returns: product object or null
```

#### Get All Products
```javascript
const allProducts = Storage.getAllProducts();
// Returns: array of product objects
```

#### Update Product
```javascript
Storage.updateProduct(productId, {
    price: 26000,
    gst: 18
});
```

#### Delete Product
```javascript
Storage.deleteProduct(productId);
```

---

### Customer Management

#### Add Customer
```javascript
const newCustomer = Storage.addCustomer({
    name: 'ABC Manufacturing',
    email: 'info@abc.com',
    phone: '9876543210',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    address: '123 Industrial Area'
});
// Returns: customer with id and empty quotations/inquiries arrays
```

#### Get Customer
```javascript
const customer = Storage.getCustomer(customerId);
// Returns: customer object or null
```

#### Get Customer by Email
```javascript
const customer = Storage.getCustomerByEmail('info@abc.com');
// Returns: customer object or null
```

#### Get All Customers
```javascript
const allCustomers = Storage.getAllCustomers();
// Returns: array of customer objects
```

#### Update Customer
```javascript
Storage.updateCustomer(customerId, {
    phone: '9876543211',
    city: 'Pune'
});
```

#### Delete Customer
```javascript
Storage.deleteCustomer(customerId);
```

---

### Quotation Management

#### Add Quotation
```javascript
const newQuotation = Storage.addQuotation({
    customerId: 1,
    customerName: 'ABC Manufacturing',
    customerEmail: 'info@abc.com',
    customerPhone: '9876543210',
    customerAddress: '123 Industrial',
    products: [
        {
            productId: 1,
            productName: 'Pump',
            brand: 'Kirloskar',
            quantity: 2,
            unitPrice: 25000,
            gst: 18,
            total: 59000
        }
    ],
    subtotal: 50000,
    gstAmount: 9000,
    discountPercent: 0,
    discountAmount: 0,
    totalAmount: 59000,
    notes: 'Optional notes',
    status: 'draft'
});
// Returns: quotation with auto-generated quotationNumber
// Format: QT-YYYY-COUNTER
```

#### Get Quotation
```javascript
const quotation = Storage.getQuotation(quotationId);
// Returns: quotation object or null
```

#### Get Quotation by Number
```javascript
const quotation = Storage.getQuotationByNumber('QT-2024-1001');
// Returns: quotation object or null
```

#### Get All Quotations
```javascript
const allQuotations = Storage.getAllQuotations();
// Returns: array of quotation objects
```

#### Update Quotation
```javascript
Storage.updateQuotation(quotationId, {
    status: 'sent',
    totalAmount: 60000
});
```

#### Delete Quotation
```javascript
Storage.deleteQuotation(quotationId);
```

---

### Inquiry Management

#### Add Inquiry
```javascript
const newInquiry = Storage.addInquiry({
    customerId: 1,
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    details: 'Need a pump for 5 story building...',
    parsedData: {
        type: ['centrifugal'],
        hp: 5,
        buildings: 5,
        pressure: null,
        flow: null,
        material: [],
        quantity: 1,
        budget: 50000,
        timeline: 'urgent'
    },
    status: 'pending'
});
// Returns: inquiry with id and createdAt
```

#### Get Inquiry
```javascript
const inquiry = Storage.getInquiry(inquiryId);
// Returns: inquiry object or null
```

#### Get All Inquiries
```javascript
const allInquiries = Storage.getAllInquiries();
// Returns: array of inquiry objects
```

#### Update Inquiry
```javascript
Storage.updateInquiry(inquiryId, {
    status: 'converted'
});
```

---

### Settings & Analytics

#### Get Dashboard Stats
```javascript
const stats = Storage.getDashboardStats();
// Returns: {
//     totalQuotations: number,
//     pendingQuotations: number,
//     acceptedQuotations: number,
//     totalCustomers: number,
//     totalInquiries: number,
//     revenue: number
// }
```

#### Get Company Settings
```javascript
const company = Storage.get('company');
// Returns: {name, email, phone, address, website, gst, terms}
```

#### Update Company Settings
```javascript
Storage.set('company', {
    name: 'AKB Engineering',
    email: 'info@akb.com',
    phone: '+91-1234-567890',
    address: 'Your Address',
    website: 'www.akb.com',
    gst: 'Your-GST-Number',
    terms: 'Your T&C'
});
```

#### Generate Quotation Number
```javascript
const quotationNumber = Storage.generateQuotationNumber();
// Returns: 'QT-2024-1001' format
```

---

## Authentication API

### Login Handler
```javascript
// In js/auth.js

// Manual login from code
if (Auth.authenticate('admin', '123456')) {
    console.log('Authenticated');
    window.location.href = './pages/dashboard.html';
}

// Get authentication status
if (Auth.isAuthenticated()) {
    console.log('User is logged in');
}

// Get current user
const user = Auth.getCurrentUser();
```

### Session Management
```javascript
// Check if authenticated
const isAuth = Auth.isAuthenticated();

// Get current user details
const user = Auth.getCurrentUser();
// Returns: {id, username, name, email, role}

// Logout
Auth.logout();  // Redirects to login page
```

### Theme Management
```javascript
// Toggle theme
Auth.toggleTheme();  // Switches between light and dark

// Initialize theme on page load
Auth.initializeTheme();  // Applies saved theme preference

// Get current theme
const isDarkMode = document.body.classList.contains('dark-theme');
```

### Toast Notifications
```javascript
Auth.showToast('Operation successful', 'success');
Auth.showToast('An error occurred', 'error');
Auth.showToast('Please note this', 'info');
Auth.showToast('Warning!', 'warning');
```

---

## Application Utilities

### Formatting Functions

#### Format Currency (INR)
```javascript
const formatted = formatCurrency(25000);
// Returns: '₹25,000.00'
```

#### Format Date
```javascript
const formatted = formatDate('2024-03-15T10:30:00Z');
// Returns: '15/03/2024'
```

#### Format DateTime
```javascript
const formatted = formatDateTime('2024-03-15T10:30:00Z');
// Returns: '15/03/2024 10:30 AM'
```

---

### Validation Functions

#### Validate Email
```javascript
if (validateEmail('user@example.com')) {
    console.log('Valid email');
}
// Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

#### Validate Phone
```javascript
if (validatePhone('9876543210')) {
    console.log('Valid phone');
}
// Accepts 10-digit Indian phone numbers
```

---

### Calculation Functions

#### Calculate GST
```javascript
const gstAmount = calculateGST(1000, 18);
// Returns: 180
// Formula: (amount × percentage) / 100
```

#### Calculate Total with GST
```javascript
const total = calculateTotalWithGST(1000, 18);
// Returns: 1180
```

---

### Utility Functions

#### Generate Unique ID
```javascript
const id = generateId();
// Returns: timestamp-based unique number
```

#### Get Query Parameter
```javascript
// URL: page.html?id=123&action=edit
const id = getQueryParam('id');
// Returns: '123'
```

#### Copy to Clipboard
```javascript
copyToClipboard('Text to copy');
// Copies text and shows notification
```

#### Download JSON
```javascript
downloadJSON({data: 'content'}, 'filename.json');
// Downloads file to user's computer
```

---

## Module APIs

### Products Module (products.js)

#### Load and Display Products
```javascript
// On products.html page load
ProductsManager.loadProducts();
// Fetches from storage and displays table
```

#### Add Product
```javascript
// Form submission handler
ProductsManager.handleProductSubmit(event);
// Validates and saves product
```

#### Edit Product
```javascript
ProductsManager.editProduct(productId);
// Opens modal with product data
```

#### Delete Product
```javascript
ProductsManager.deleteProduct(productId);
// Shows confirmation and deletes
```

#### Search Products
```javascript
ProductsManager.handleSearch(query);
// Filters by name, brand, category
// Displays filtered results
```

---

### Quotations Module (quotations.js)

#### Load Quotations
```javascript
QuotationsManager.loadQuotations();
// Displays all quotations with status colors
```

#### Create Quotation
```javascript
QuotationsManager.handleQuotationSubmit(event);
// Creates new or updates existing quotation
// Validates customer and products
// Calculates totals
```

#### Generate PDF
```javascript
QuotationsManager.downloadPDF(quotationId);
// Generates professional PDF
// Opens download dialog
// File: QT-XXXX.pdf
```

#### Share via WhatsApp
```javascript
QuotationsManager.shareWhatsApp(quotationId);
// Constructs message with quotation details
// Opens WhatsApp Web/App
// Pre-fills message
```

#### Filter by Status
```javascript
QuotationsManager.filterByStatus('sent');
// Shows quotations with specific status
// Updates active button
```

---

### Customers Module (customers.js)

#### Load Customers
```javascript
CustomersManager.loadCustomers();
// Displays all customers with quotation count
```

#### Add/Edit Customer
```javascript
CustomersManager.handleCustomerSubmit(event);
// Validates and saves customer
```

#### View Customer
```javascript
CustomersManager.viewCustomer(customerId);
// Shows customer details modal
// Displays quotation and inquiry history
```

#### Delete Customer
```javascript
CustomersManager.deleteCustomer(customerId);
// Shows confirmation and deletes
```

#### Search Customers
```javascript
CustomersManager.handleSearch(query);
// Filters by name, email, phone
```

---

### Inquiries Module (inquiries.js)

#### Parse Inquiry
```javascript
InquiriesManager.parseInquiry();
// Extracts customer data
// Calls extractRequirements()
// Displays parsed data
```

#### Extract Requirements (AI-Style)
```javascript
const parsed = InquiriesManager.extractRequirements(inquiryText);
// Detects: pump types, HP, buildings, pressure, flow, material, quantity, budget, timeline
// Returns: parsed object with all detected fields
```

#### Submit Inquiry
```javascript
InquiriesManager.submitParsedInquiry();
// Saves inquiry to storage
// Links to customer
// Creates new customer if needed
```

#### Create Quotation from Inquiry
```javascript
InquiriesManager.quickQuotation(inquiryId);
// Navigates to quotations page
// Pre-fills customer data
```

---

### Settings Module (settings.js)

#### Load Settings
```javascript
SettingsManager.loadSettings();
// Displays current company settings
// Shows system statistics
// Calculates storage usage
```

#### Save Company Settings
```javascript
SettingsManager.handleCompanySave(event);
// Validates and saves company data
```

#### Export Data
```javascript
SettingsManager.exportData();
// Creates JSON backup
// Downloads to user's computer
// Filename: akb-quotation-backup-DATE.json
```

#### Import Data
```javascript
SettingsManager.importData(event);
// Reads uploaded JSON file
// Shows confirmation dialog
// Restores all data
```

#### Clear All Data
```javascript
SettingsManager.confirmClearData();
// Double confirmation dialogs
// Resets all data to initial state
```

---

## Data Structures

### Product Schema
```javascript
{
    id: Number,                    // Timestamp-based unique ID
    name: String,                  // Product name (required)
    brand: String,                 // Brand name (required)
    category: String,              // Category code (pumps, motors, etc.)
    price: Number,                 // Price in rupees (required)
    gst: Number,                   // GST percentage (0-100)
    quantity: Number,              // Stock quantity
    warranty: Number,              // Warranty in months
    hp: String,                    // Horsepower (optional)
    description: String,           // Product description
    createdAt: ISO8601String       // Timestamp
}
```

### Customer Schema
```javascript
{
    id: Number,                    // Timestamp-based unique ID
    name: String,                  // Company/person name (required)
    email: String,                 // Email address (optional but validated)
    phone: String,                 // Phone number (required)
    city: String,                  // City name
    state: String,                 // State name
    zip: String,                   // Postal code
    address: String,               // Full address
    quotations: Array<Number>,     // Quotation IDs
    inquiries: Array<Number>,      // Inquiry IDs
    createdAt: ISO8601String       // Timestamp
}
```

### Quotation Schema
```javascript
{
    id: Number,                    // Timestamp-based unique ID
    quotationNumber: String,       // Auto-generated (QT-YYYY-COUNTER)
    customerId: Number,            // Reference to customer
    customerName: String,          // Customer name copy
    customerEmail: String,         // Customer email copy
    customerPhone: String,         // Customer phone copy
    customerAddress: String,       // Customer address copy
    products: Array<Object>,       // Product items array
    // Product item: {productId, productName, brand, quantity, unitPrice, gst, total}
    subtotal: Number,              // Sum of product totals
    gstAmount: Number,             // Calculated GST amount
    discountPercent: Number,       // Discount percentage (0-100)
    discountAmount: Number,        // Calculated discount
    totalAmount: Number,           // Final total (subtotal + GST - discount)
    notes: String,                 // Additional notes
    status: String,                // draft | sent | accepted | rejected
    createdAt: ISO8601String       // Timestamp
}
```

### Inquiry Schema
```javascript
{
    id: Number,                    // Timestamp-based unique ID
    customerId: Number,            // Reference to customer
    customerName: String,          // Customer name
    email: String,                 // Customer email
    phone: String,                 // Customer phone
    details: String,               // Raw inquiry text
    parsedData: Object,            // Parsed requirements object
    // Parsed fields: type[], hp, buildings, pressure, flow, material[], quantity, budget, timeline
    status: String,                // pending | converted
    createdAt: ISO8601String       // Timestamp
}
```

### User Schema
```javascript
{
    id: Number,                    // User ID
    username: String,              // Login username
    password: String,              // Password (hashed in production)
    email: String,                 // User email
    name: String,                  // Full name
    role: String,                  // admin | manager | user
    createdAt: ISO8601String       // Timestamp
}
```

### Company Settings Schema
```javascript
{
    name: String,                  // Company name
    email: String,                 // Company email
    phone: String,                 // Company phone
    address: String,               // Company address
    website: String,               // Company website URL
    gst: String,                   // GST registration number
    terms: String                  // Terms & conditions text
}
```

---

## Event System

### Custom Events

#### Quotation Created
```javascript
// Listen for quotation creation
document.addEventListener('quotation:created', (e) => {
    console.log('New quotation:', e.detail);
});

// Dispatch custom event
document.dispatchEvent(new CustomEvent('quotation:created', {
    detail: quotationData
}));
```

#### Data Updated
```javascript
document.addEventListener('data:updated', (e) => {
    console.log('Data changed:', e.detail.type);
});
```

---

### Form Events

#### Product Form Submit
```javascript
// Auto-triggers handleProductSubmit
form.addEventListener('submit', handleProductSubmit);
```

#### Customer Form Submit
```javascript
form.addEventListener('submit', handleCustomerSubmit);
```

#### Quotation Form Submit
```javascript
form.addEventListener('submit', handleQuotationSubmit);
```

---

### Modal Events

#### Modal Open
```javascript
document.addEventListener('modal:open', (e) => {
    console.log('Modal opened:', e.detail.modalId);
});
```

#### Modal Close
```javascript
document.addEventListener('modal:close', (e) => {
    console.log('Modal closed:', e.detail.modalId);
});
```

---

## CSS Architecture

### CSS Variables (in css/style.css)

#### Colors
```css
:root {
    --primary-color: #0066cc;      /* Main blue */
    --primary-dark: #004499;       /* Dark blue */
    --primary-light: #3399ff;      /* Light blue */
    --secondary-color: #00d4ff;    /* Cyan */
    --accent-color: #ff6b35;       /* Orange */
    --success-color: #10b981;      /* Green */
    --error-color: #ef4444;        /* Red */
    --warning-color: #f59e0b;      /* Yellow */
}
```

#### Spacing
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

#### Border Radius
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
```

#### Shadows
```css
--shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
--shadow-md: 0 4px 16px rgba(0,0,0,0.12);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.16);
--shadow-xl: 0 16px 48px rgba(0,0,0,0.2);
```

#### Transitions
```css
--transition-fast: 0.15s ease;
--transition-base: 0.3s ease;
--transition-slow: 0.5s ease;
```

---

### Glassmorphism Pattern
```css
.glassmorphic {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

## Best Practices

### Error Handling
```javascript
try {
    const result = Storage.getProduct(id);
    if (!result) {
        throw new Error('Product not found');
    }
} catch (error) {
    console.error('Error:', error);
    appManager.showToast('An error occurred', 'error');
}
```

### Input Validation
```javascript
// Always validate user input
if (!value || value.trim() === '') {
    appManager.showToast('Field is required', 'error');
    return false;
}

if (!validateEmail(email)) {
    appManager.showToast('Invalid email format', 'error');
    return false;
}
```

### Performance
```javascript
// Avoid DOM queries in loops
const elements = document.querySelectorAll('.product');  // Once
elements.forEach(el => {
    // Process each element
});

// Use event delegation
document.addEventListener('click', (e) => {
    if (e.target.matches('.delete-btn')) {
        deleteItem(e.target.dataset.id);
    }
});
```

### Naming Conventions
```javascript
// Classes: PascalCase
class ProductManager { }

// Functions: camelCase
function handleProductSubmit() { }

// Constants: UPPER_SNAKE_CASE
const MAX_STORAGE = 5000000;

// IDs/Data: use prefixes
id="addProductBtn"
id="productForm"
data-id="123"
```

---

## Adding New Features

### Example: Add Email Field to Product

1. **Update HTML** (pages/products.html):
```html
<input type="email" id="productEmail" placeholder="support@brand.com">
```

2. **Update Storage** (js/storage.js):
```javascript
// In Product creation
{
    id: timestamp,
    name: name,
    email: email,  // ADD
    // ... rest of fields
}
```

3. **Update Module** (js/products.js):
```javascript
const productData = {
    // ... existing fields
    email: document.getElementById('productEmail').value
};
```

4. **Update Display**:
```html
<td>${product.email}</td>
```

5. **Update Export**:
If exported in PDF/data, include in template.

---

## Debugging Techniques

### Console Logging
```javascript
// Check function execution
console.log('Function called with:', data);

// Check data structure
console.table(products);

// Check errors
console.error('Error details:', error);

// Group related logs
console.group('Product Operations');
console.log('Product:', product);
console.log('Status:', status);
console.groupEnd();
```

### Browser DevTools
```
F12 / Ctrl+Shift+I → Open Developer Tools

Console Tab:
- Check for errors
- Type and run JavaScript
- View console.log output

Application Tab:
- View localStorage
- Inspect stored data
- Edit values for testing

Network Tab:
- Check file loading
- Monitor performance
- Check for 404s

Performance Tab:
- Profile performance
- Find bottlenecks
- Optimize rendering
```

---

## Extending the Application

### Adding a New Module

1. **Create HTML Page** (pages/newmodule.html)
2. **Create JavaScript Module** (js/newmodule.js)
3. **Add Storage Methods** (js/storage.js)
4. **Add Navigation Link** (All pages: sidebar)
5. **Test Thoroughly**
6. **Document API** (This file)

---

**Happy developing!** 🚀

