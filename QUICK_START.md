# Quick Start Guide - AKB Engineering Quotation System

## 🚀 Getting Started in 5 Minutes

### Step 1: Open the Application
Open `index.html` in your web browser (Chrome, Firefox, Safari, or Edge)

### Step 2: Login
Use these demo credentials:
- **Username**: `admin`
- **Password**: `123456`

### Step 3: Explore the Dashboard
You'll see:
- Total Quotations, Pending Quotations, Revenue Stats
- Customer and Inquiry counts
- Quick action buttons

## 📋 Core Workflows

### Workflow 1: Create Your First Quotation

**Time**: ~2 minutes

1. Click **"New Quotation"** on dashboard
2. Enter customer details or select existing customer
3. Click **"Add Product"** and select products from dropdown
4. Enter quantity for each product
5. System auto-calculates pricing and GST
6. Click **"Generate & Send"** to save
7. Use PDF icon to download quotation

### Workflow 2: Add Products to Inventory

**Time**: ~1 minute per product

1. Go to **Products** page (sidebar)
2. Click **"Add Product"** button
3. Fill in:
   - Product name (e.g., "Centrifugal Pump")
   - Brand (e.g., "Kirloskar")
   - Price in rupees
   - GST % (usually 18%)
   - Warranty in months
4. Click **"Save Product"**
5. Products appear in quotation dropdown automatically

### Workflow 3: Process Customer Inquiry

**Time**: ~3 minutes

1. Go to **Inquiries** page
2. Enter customer name, email, phone
3. Paste/type the inquiry details
4. Click **"Parse with AI"**
5. Review detected requirements (HP, building, pressure, etc.)
6. Click **"Submit & Save"**
7. Click **"Create Quotation"** to generate quotation from inquiry

### Workflow 4: Share Quotation via WhatsApp

**Time**: 30 seconds

1. Go to **Quotations** page
2. Find your quotation in list
3. Click **WhatsApp icon** (💬)
4. WhatsApp will open with pre-filled message
5. Send to customer directly

### Workflow 5: Download Quotation PDF

**Time**: 15 seconds

1. Go to **Quotations** page
2. Find quotation
3. Click **PDF icon** (📄)
4. PDF downloads automatically
5. Print or email to customer

## 🎯 Key Pages Overview

### Dashboard
- Overview of all statistics
- Quick access to main features
- Recent activities

### Quotations
- Create new quotations
- View/Edit existing quotations
- Download PDF
- Share via WhatsApp
- Filter by status (Draft, Sent, Accepted, Rejected)

### Products
- Add products to inventory
- Edit product details
- Delete products
- Search products
- Manage pricing and GST

### Customers
- Add new customers
- View customer details
- Edit customer information
- See quotation history
- Search customers

### Inquiries
- Input customer inquiries
- AI parsing of requirements
- Convert inquiries to quotations
- Track inquiry status

### Settings
- Configure company information
- Export data as JSON
- Import data from backup
- View system statistics
- Monitor storage usage

## 💡 Pro Tips

### Tip 1: Create Customers First
Adding customers before creating quotations saves time. They appear in dropdown when creating quotations.

### Tip 2: Use Product Categories
Add products by category (Pumps, Motors, Valves) for better organization.

### Tip 3: Regular Backups
Go to Settings > Export Data weekly to backup your data as JSON.

### Tip 4: Dark Mode
Click moon icon in header to toggle dark mode for comfortable viewing.

### Tip 5: Quick Search
Use search boxes on each page to quickly find quotations, products, or customers.

## 🔑 Demo Workflow (Complete Example)

Let's create a quotation from scratch:

### Step 1: Add a Product (2 min)
1. Go to **Products** page
2. Click **"Add Product"**
3. Fill details:
   - Name: "5 HP Centrifugal Pump"
   - Brand: "Kirloskar"
   - Price: 25,000
   - GST: 18%
   - Warranty: 24 months
4. Click **"Save Product"**

### Step 2: Add a Customer (1 min)
1. Go to **Customers** page
2. Click **"Add Customer"**
3. Fill details:
   - Name: "ABC Manufacturing Ltd"
   - Email: "info@abc-mfg.com"
   - Phone: "9876543210"
   - Address: "123 Industrial Area, City"
4. Click **"Save Customer"**

### Step 3: Create a Quotation (2 min)
1. Go to **Quotations** page
2. Click **"New Quotation"**
3. Select "ABC Manufacturing Ltd" from dropdown
4. Click **"Add Product"**
5. Select "5 HP Centrifugal Pump"
6. Set quantity: 2
7. System shows:
   - Unit Price: ₹25,000
   - Quantity: 2
   - Total: ₹50,000
   - GST (18%): ₹9,000
   - **Grand Total: ₹59,000**
8. Click **"Generate & Send"**

### Step 4: Download and Share (1 min)
1. Quotation appears in list as "QT-2024-1001"
2. Click PDF icon to download
3. Click WhatsApp icon to share
4. Quotation is ready!

**Total Time**: ~6 minutes to complete full workflow

## 📊 Dashboard Statistics Explained

| Stat | Meaning |
|------|---------|
| Total Quotations | All quotations created |
| Pending Quotations | Quotations in Draft status |
| Revenue | Total from Accepted quotations |
| Total Customers | All customers in database |
| Total Inquiries | All inquiries received |

## 🎨 Theme Colors

- **Blue**: Primary actions and branding
- **Cyan**: Secondary features
- **Green**: Positive actions (Accept, Save)
- **Red**: Negative actions (Delete, Reject)
- **Yellow**: Warnings (Pending, Draft)
- **Orange**: Important information

## 🔒 Security & Data

### Where is Data Stored?
- **Local Browser Storage**: All data stays on your computer
- **No Server Upload**: Nothing goes to the cloud
- **100% Private**: Only you can access your data
- **Export Anytime**: Backup data as JSON file

### Data Backup
1. Go to **Settings** page
2. Click **"Export Data"**
3. JSON file downloads with all your data
4. Save it to cloud storage or external drive
5. To restore: Upload the JSON file in Settings

## ❓ Common Questions

**Q: Will my data be lost if I close the browser?**
A: No! Data is saved in browser's local storage and persists even after closing browser.

**Q: Can I use this on my phone?**
A: Yes! The application is fully responsive and works on smartphones.

**Q: How do I add more users?**
A: Current version has one admin account. Edit `storage.js` to add more users.

**Q: Can I integrate with real email/WhatsApp?**
A: WhatsApp works directly. Email integration requires backend server setup.

**Q: What if I run out of storage?**
A: Monitor usage in Settings. Export and clear old data if needed.

**Q: Can I deploy this online?**
A: Yes! Deploy to Vercel, Netlify, or any static hosting. No backend required.

## 🐛 Troubleshooting

**Issue**: Data not saving
- **Solution**: Check if browser storage is not full. Export data first, clear storage, then import.

**Issue**: Can't login
- **Solution**: Refresh page, clear cache, try again. Default credentials: admin/123456

**Issue**: PDF not downloading
- **Solution**: Check if pop-ups are blocked. Disable pop-up blocker for this site.

**Issue**: WhatsApp not opening
- **Solution**: Make sure you have WhatsApp Web or app installed. Enter phone number with country code.

**Issue**: Need to reset password
- **Solution**: Edit `storage.js` and modify password, or export data and clear browser storage.

## 📞 Getting Help

1. **Check README.md** for detailed documentation
2. **Review this guide** for common workflows
3. **Use Settings** to check system information
4. **Export data** as backup before making major changes
5. **Clear cache** if experiencing issues

## 🎓 Learning Path

### Day 1: Basics
- [ ] Login to system
- [ ] Explore Dashboard
- [ ] Review all pages

### Day 2: Data Entry
- [ ] Add 5 products
- [ ] Add 3 customers
- [ ] Add 2 inquiries

### Day 3: Quotations
- [ ] Create 3 quotations
- [ ] Download PDF
- [ ] Share via WhatsApp

### Day 4: Management
- [ ] Edit products
- [ ] Update customer info
- [ ] Filter quotations

### Day 5: Admin Tasks
- [ ] Configure company details
- [ ] Export data backup
- [ ] Monitor storage usage

## 🎉 You're Ready!

You now have a professional quotation management system ready to use. 

**Next Steps:**
1. Add your products
2. Add your customers
3. Create your first quotation
4. Download and share with client

**Happy Quoting!** 🚀

---

**Support**: Refer to README.md for advanced features and detailed documentation.
