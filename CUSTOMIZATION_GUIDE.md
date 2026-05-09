<!-- CUSTOMIZATION_GUIDE.md -->

# Customization & Extension Guide

This guide will help you customize the AKB Engineering Quotation System to match your specific needs.

---

## 🎨 Changing Company Branding

### Method 1: In-App Settings (Easiest)
1. Login to application
2. Go to **Settings** page
3. Update company information
4. Changes appear immediately in quotations

### Method 2: Code-Based (Permanent)
1. Open `js/storage.js`
2. Find the `init()` function
3. Modify the company object:

```javascript
this.set('company', {
    name: 'Your Company Name',
    email: 'your-email@company.com',
    phone: '+91-XXX-XXXXX',
    address: 'Your Address',
    website: 'www.yourcompany.com',
    gst: 'Your GST Number',
    terms: 'Your custom terms and conditions'
});
```

4. Save and refresh browser

---

## 🎨 Customizing Colors

### Primary Colors
Edit `css/style.css` - Root variables at the top:

```css
:root {
    --primary-color: #0066cc;        /* Change main blue */
    --primary-dark: #004499;         /* Darker blue */
    --primary-light: #3399ff;        /* Lighter blue */
    
    --secondary-color: #00d4ff;      /* Cyan color */
    --accent-color: #ff6b35;         /* Orange color */
}
```

### Brand Colors Example
```css
/* For a green-based brand */
:root {
    --primary-color: #059669;        /* Green */
    --primary-dark: #047857;         /* Dark green */
    --primary-light: #10b981;        /* Light green */
    --secondary-color: #34d399;      /* Mint */
    --accent-color: #fbbf24;         /* Amber */
}
```

### Where Colors Are Used
- Buttons, Links: `--primary-color`
- Backgrounds, Gradients: `--secondary-color`
- Important Highlights: `--accent-color`
- Status Messages: Success/Error/Warning colors

---

## 🖼️ Adding Company Logo

### Add Logo Image
1. Save logo as `logo.png` in `assets/` folder
2. Open `pages/dashboard.html`
3. Find the logo icon in sidebar header
4. Replace this:

```html
<div class="sidebar-logo-icon">
    <i class="fas fa-cogs"></i>
</div>
```

With this:

```html
<div class="sidebar-logo-icon" style="background: none;">
    <img src="../assets/logo.png" alt="Logo" style="width: 40px; height: 40px; object-fit: contain;">
</div>
```

### Add Logo in Quotation
1. Open `js/quotations.js`
2. Find `generateQuotationHTML()` function
3. In the company-info div, add:

```html
<img src="../assets/logo.png" alt="Logo" style="height: 40px; margin-bottom: 10px;">
```

---

## 👥 Adding Users & Changing Passwords

### Add New Admin User
1. Open `js/storage.js`
2. Find the `init()` function
3. In the users array, add:

```javascript
{
    id: 2,
    username: 'newuser',
    password: 'password123',
    email: 'newuser@company.com',
    name: 'New User Name',
    role: 'admin',
    createdAt: new Date().toISOString()
}
```

4. Save and refresh browser
5. Login with new credentials

### Change Admin Password
1. Open `js/storage.js`
2. Find the first user object
3. Change the password field:

```javascript
password: 'yournewepassword'
```

4. Clear browser cache
5. Login with new password

### Add User Roles (Advanced)
Add role field to user object:

```javascript
{
    // ... other fields
    role: 'admin'  // or 'manager', 'user'
}
```

---

## 📦 Adding Product Categories

### Current Categories
Located in `pages/products.html`:
- Industrial Pumps
- Motors
- Valves
- Compressors
- Accessories
- Other

### Add New Category
1. Open `pages/products.html`
2. Find the category select:

```html
<select id="productCategory" required>
    <option value="">Select category</option>
    <option value="pumps">Industrial Pumps</option>
    <option value="motors">Motors</option>
    <!-- ADD HERE -->
</select>
```

3. Add your category:

```html
<option value="turbines">Turbines</option>
<option value="generators">Generators</option>
```

4. Update the formatting function in `js/products.js`:

```javascript
formatCategory(category) {
    const categoryMap = {
        pumps: 'Industrial Pumps',
        motors: 'Motors',
        valves: 'Valves',
        compressors: 'Compressors',
        turbines: 'Turbines',        // ADD
        generators: 'Generators',    // ADD
        accessories: 'Accessories',
        other: 'Other'
    };
    return categoryMap[category] || category;
}
```

---

## 🧮 Changing GST Percentage

### Set Default GST
1. Open `pages/products.html`
2. Find the GST input field:

```html
<input type="number" id="productGST" placeholder="0" min="0" max="100" value="18" required>
```

3. Change `value="18"` to your desired GST:

```html
value="5"    <!-- 5% GST -->
value="12"   <!-- 12% GST -->
```

---

## 📧 Customizing Email-Like Features

### WhatsApp Message Template
1. Open `js/quotations.js`
2. Find `shareWhatsApp()` function
3. Modify the message:

```javascript
const message = `Hi ${quotation.customerName},\n\nPlease find your quotation details below:\n\nQuotation #: ${quotation.quotationNumber}\nTotal Amount: ₹${quotation.totalAmount.toFixed(2)}\n\nFor more details, please contact us.\n\nThank you!`;
```

Change to:

```javascript
const message = `Hello ${quotation.customerName},\n\nYour quotation is ready!\n\nRef: ${quotation.quotationNumber}\nAmount: ₹${quotation.totalAmount.toFixed(2)}\n\nLooking forward to your feedback.\n\nBest regards,\nAKB Engineering`;
```

### PDF Header Text
1. Open `js/quotations.js`
2. Find `generateQuotationHTML()` function
3. Modify company name and details in the HTML template

---

## 🔧 Customizing Quotation Template

### Change Quotation Format
1. Open `js/quotations.js`
2. Find `generateQuotationHTML()` function
3. Modify the HTML template (large HTML string)
4. Change styling, layout, colors, fonts

### Add Custom Sections
Add new sections to quotation:

```html
<div class="terms">
    <h4>Delivery Terms:</h4>
    <p>Delivery within 7 days of purchase order</p>
</div>

<div class="terms">
    <h4>Payment Terms:</h4>
    <p>50% advance, 50% on delivery</p>
</div>
```

---

## 📱 Customizing Theme & Style

### Change Font
1. Open `css/style.css`
2. Find the body rule:

```css
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', ...
}
```

3. Replace with your font:

```css
font-family: 'Georgia', serif;
/* or */
font-family: 'Courier New', monospace;
```

### Change Spacing
Modify the spacing variables in `:root`:

```css
--spacing-md: 16px;   /* Change to 20px for more space */
--spacing-lg: 24px;   /* Change to 32px for more space */
```

### Change Border Radius
Make corners more/less rounded:

```css
--radius-md: 12px;   /* Change to 4px for less rounded */
--radius-lg: 16px;   /* Change to 24px for more rounded */
```

---

## 🔢 Changing Currency

### Change from INR (₹) to USD ($)
1. Open `js/app.js`
2. Find `formatCurrency()` function:

```javascript
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}
```

3. Change to:

```javascript
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}
```

### Currency Codes
- USD: US Dollar
- EUR: Euro
- GBP: British Pound
- JPY: Japanese Yen
- AUD: Australian Dollar
- CAD: Canadian Dollar
- INR: Indian Rupee

---

## 📅 Changing Date Format

### Current Format
Indian format: DD/MM/YYYY (15/03/2024)

### Change to Different Format
1. Open `js/app.js`
2. Find `formatDate()` function:

```javascript
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');  // Change 'en-IN'
}
```

3. Change locale:

```javascript
return date.toLocaleDateString('en-US');   // US format: MM/DD/YYYY
return date.toLocaleDateString('en-GB');   // UK format: DD/MM/YYYY
return date.toLocaleDateString('de-DE');   // German format
return date.toLocaleDateString('fr-FR');   // French format
```

---

## 🔐 Customizing Authentication

### Add Login Error Message
1. Open `js/auth.js`
2. Find the login handler
3. Modify error handling:

```javascript
if (user) {
    // Login success
} else {
    this.showError('Invalid credentials. Please try again.');
}
```

### Show Demo Credentials
Edit `index.html` to show/hide demo credentials:

```html
<div class="demo-login">
    <p>Demo Credentials:</p>
    <p><strong>Username:</strong> admin | <strong>Password:</strong> 123456</p>
</div>
```

Remove or comment out to hide.

---

## 🎯 Adding Custom Fields to Products

### Add New Product Field
1. Open `pages/products.html`
2. Add new form field:

```html
<div class="form-input-group">
    <label for="productModel">Model Number</label>
    <input type="text" id="productModel" placeholder="e.g., KP50-100">
</div>
```

2. Update `js/products.js` in `handleProductSubmit()`:

```javascript
const productData = {
    // ... existing fields
    model: document.getElementById('productModel').value.trim()
};
```

3. Update table display in `displayProducts()`:

```html
<td>${product.model}</td>
```

---

## 📊 Customizing Dashboard Cards

### Change Dashboard Stats
1. Open `pages/dashboard.html`
2. Modify the stat cards section:

```html
<div class="stat-card">
    <div class="stat-header">
        <span class="stat-title">Your Custom Stat</span>
        <div class="stat-icon">
            <i class="fas fa-star"></i>
        </div>
    </div>
    <div class="stat-value" id="customStat">0</div>
    <div class="stat-change positive">
        <i class="fas fa-arrow-up"></i> Custom change
    </div>
</div>
```

3. Update `js/app.js` to populate the data.

---

## 🔍 Customizing Search

### Add Search to New Fields
1. Open the relevant module (e.g., `js/products.js`)
2. Find the search function
3. Add field to search:

```javascript
const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.brand.toLowerCase().includes(query.toLowerCase()) ||
    p.model.toLowerCase().includes(query.toLowerCase())  // ADD
);
```

---

## 🎓 Adding Help/Documentation

### Add Help Text to Fields
1. Open the HTML page
2. Add title attribute to input:

```html
<input type="text" title="Enter the product model number" placeholder="Model">
```

Or add help text below field:

```html
<input type="text" id="productName">
<small style="color: var(--text-muted);">Enter product name (e.g., Centrifugal Pump)</small>
```

---

## 🚀 Performance Optimization

### Disable Animations
1. Open `css/style.css`
2. Find animations section
3. Change transition speeds:

```css
--transition-fast: 0s;      /* No animation */
--transition-base: 0s;
--transition-slow: 0s;
```

### Reduce Shadows
Remove/reduce shadows for faster rendering:

```css
--shadow-sm: none;
--shadow-md: 0 2px 4px rgba(0,0,0,0.05);
```

---

## 🔗 Integration Points

### Connect to External Services
### Email Integration
```javascript
// Example: Send email via EmailJS or similar
sendQuotationEmail(quotation) {
    // Add integration code here
}
```

### SMS Integration
```javascript
// Example: Send SMS via Twilio
sendQuotationSMS(quotation) {
    // Add integration code here
}
```

### Database Integration
```javascript
// Example: Save to Firebase or API
syncToServer(data) {
    fetch('https://your-api.com/save', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}
```

---

## 📝 Useful Code Snippets

### Add Console Logging (Debug)
```javascript
console.log('Data:', data);
console.table(products);
console.error('Error:', error);
```

### Add Validation
```javascript
if (!value || value.trim() === '') {
    appManager.showToast('Field cannot be empty', 'error');
    return;
}
```

### Add Loading State
```javascript
element.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
// Do async work
element.innerHTML = result;
```

---

## 🐛 Debugging Tips

### Check Browser Console
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Check for errors (red) and warnings (yellow)
4. Use `console.log()` to debug

### Check Local Storage
1. Open Developer Tools
2. Go to Application tab
3. Click Local Storage
4. See all stored data
5. Edit or delete values

### Test Responsiveness
1. Press F12
2. Click Device Toolbar icon
3. Select device (iPhone, iPad, etc.)
4. Test layout on different sizes

---

## ✅ Best Practices

1. **Always backup** before making changes
2. **Test thoroughly** on multiple browsers
3. **Keep backups** of original files
4. **Comment your changes** in code
5. **Follow existing code style**
6. **Test on mobile** devices
7. **Validate all inputs**
8. **Use console for debugging**

---

## 📞 Need Help?

- Check PROJECT_SUMMARY.md for technical details
- Review README.md for comprehensive documentation
- Check QUICK_START.md for workflows
- Look at existing code for patterns
- Test in browser console for quick debugging

---

**Happy Customizing!** 🎨

