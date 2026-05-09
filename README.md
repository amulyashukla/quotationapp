# AKB Engineering - Quotation Management System

A modern, professional web application for managing quotations, products, customers, and inquiries for industrial pump and engineering companies.

## Features

### 1. **Authentication & Security**
- Secure login system with demo credentials
- Session management
- User profile management
- Logout functionality

### 2. **Dashboard**
- Real-time statistics overview
- Total quotations, pending quotations, revenue tracking
- Recent inquiries and customer activity
- Quick access to main functions
- Date and time display with auto-update

### 3. **Quotation Management**
- Create professional quotations
- Automatic quotation numbering (QT-YYYY-Number)
- Multiple products per quotation
- Automatic GST calculation
- Discount support
- Draft and send functionality
- Status tracking (Draft, Sent, Accepted, Rejected)
- Edit existing quotations
- Delete quotations

### 4. **PDF Export & Printing**
- Professional quotation PDF generation
- Print-ready format
- Company logo and branding
- Signature sections
- Terms and conditions

### 5. **WhatsApp Integration**
- Direct WhatsApp sharing of quotations
- Pre-filled message templates
- Customer contact integration

### 6. **Product Management**
- Add/Edit/Delete products
- Product categories (Pumps, Motors, Valves, etc.)
- Price management
- GST percentage configuration
- Stock quantity tracking
- Warranty information
- Search and filter functionality

### 7. **Customer Management**
- Add/Edit/Delete customers
- Customer contact information
- Address management
- Customer quotation history
- Inquiry history
- Search functionality

### 8. **Inquiry Management**
- Customer inquiry input system
- AI-style automatic parsing of requirements
- Detect: Pump type, HP, building floors, pressure, flow rate, quantity, budget, timeline
- Save inquiry details
- Convert inquiries to quotations
- Inquiry history and status tracking

### 9. **Dark Mode**
- Toggle between light and dark themes
- Persistent theme preference
- Glassmorphism effects in both modes

### 10. **Data Management**
- Export all data as JSON backup
- Import from JSON backup
- Clear all data option
- Local storage persistence
- Storage usage monitoring

### 11. **Settings**
- Company information configuration
- GST registration details
- Terms and conditions
- System statistics
- Data export/import
- Storage usage tracking

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser Local Storage
- **Design**: Glassmorphism, Modern UI/UX
- **PDF Generation**: html2pdf.js
- **Icons**: FontAwesome 6.4.0
- **Browser Support**: All modern browsers

## Installation & Setup

### Method 1: Direct File Access
1. Extract the quotation-app folder
2. Open `index.html` in a web browser
3. Login with demo credentials:
   - **Username**: admin
   - **Password**: 123456

### Method 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server
```

Then navigate to `http://localhost:8000/index.html`

### Method 3: Deploy to Vercel/Netlify
1. Connect your repository
2. Set build command: (leave empty or use default)
3. Set publish directory: `quotation-app/`
4. Deploy

## Project Structure

```
quotation-app/
├── index.html                 # Login page
├── css/
│   └── style.css             # Main stylesheet with glassmorphism
├── js/
│   ├── storage.js            # Local storage management
│   ├── auth.js               # Authentication system
│   ├── app.js                # Main app logic and utilities
│   ├── products.js           # Product management
│   ├── quotations.js         # Quotation management & PDF
│   ├── customers.js          # Customer management
│   ├── inquiries.js          # Inquiry parsing & management
│   └── settings.js           # Settings management
├── pages/
│   ├── dashboard.html        # Main dashboard
│   ├── products.html         # Products page
│   ├── quotations.html       # Quotations page
│   ├── customers.html        # Customers page
│   ├── inquiries.html        # Inquiries page
│   └── settings.html         # Settings page
└── assets/                   # Placeholder for images/logos
```

## Usage Guide

### Login
1. Open `index.html`
2. Enter credentials:
   - Username: `admin`
   - Password: `123456`
3. Click "Sign In"

### Create a Quotation
1. Click "New Quotation" on dashboard or go to Quotations page
2. Select or create a customer
3. Add products with quantities
4. System calculates GST and totals automatically
5. Add notes/terms if needed
6. Click "Generate & Send" or "Save as Draft"

### Parse an Inquiry
1. Go to Inquiries page
2. Enter customer name, email, phone
3. Paste/type inquiry details
4. Click "Parse with AI"
5. System detects requirements (HP, building, pressure, etc.)
6. Click "Submit & Save"
7. Create quotation from inquiry

### Export Quotation to PDF
1. Go to Quotations page
2. Find your quotation
3. Click PDF icon
4. PDF will download automatically

### Share on WhatsApp
1. Go to Quotations page
2. Click WhatsApp icon
3. Message will open in WhatsApp Web/App
4. Send directly to customer

### Manage Products
1. Go to Products page
2. Click "Add Product"
3. Fill product details (name, brand, price, GST, etc.)
4. Click "Save Product"
5. Edit or delete as needed

### Add Customers
1. Go to Customers page
2. Click "Add Customer"
3. Enter customer details
4. Save customer
5. View quotation history for each customer

### Export/Import Data
1. Go to Settings page
2. Click "Export" to download backup (JSON)
3. Click "Import" to restore from backup
4. File will be saved with timestamp

### Configure Company Details
1. Go to Settings page
2. Update company information
3. Enter GST registration number
4. Set terms and conditions
5. Click "Save Company Details"
6. These details appear in all quotations

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save (form-specific) |
| `Esc` | Close modal/dialog |
| `Ctrl+P` | Print quotation |

## Demo Credentials

```
Username: admin
Password: 123456
```

**Note**: You can add more users by modifying the Storage initialization in `storage.js`

## Color Scheme

- **Primary Blue**: #0066cc
- **Secondary Cyan**: #00d4ff
- **Accent Orange**: #ff6b35
- **Success Green**: #10b981
- **Error Red**: #ef4444
- **Warning Yellow**: #f59e0b

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Local Storage Limits

- Most browsers: ~5-10MB
- Data is automatically compressed
- Monitor usage in Settings > System Information
- Export data regularly as backup

## Common Features Explained

### Glassmorphism Design
- Frosted glass effect backgrounds
- Transparency with blur
- Modern, premium appearance
- Smooth hover animations

### AI-Style Inquiry Parsing
- Keyword matching for equipment types
- Number extraction (HP, PSI, GPM, etc.)
- Smart requirement detection
- Pattern recognition for common queries

### Automatic Calculations
- GST calculation per product
- Subtotal summation
- Discount application
- Total amount with formatting

### Quotation Status Flow
```
Draft → Sent → (Accepted/Rejected)
         ↓
      Converted (to order)
```

## Tips & Best Practices

1. **Backup Regularly**: Export your data weekly
2. **Use Customer Management**: Saves time on repeated entries
3. **Add Products First**: Makes quotation creation faster
4. **Parse Inquiries**: Automatically detects customer needs
5. **Use Dark Mode**: Reduces eye strain during long sessions
6. **Mobile Friendly**: All features work on smartphones

## Troubleshooting

### Data Not Saving
- Check browser storage capacity
- Clear cache and try again
- Export backup before clearing
- Check browser's private/incognito mode

### PDF Not Downloading
- Ensure pop-ups are not blocked
- Try different browser
- Check internet connection

### Quotation Number Issues
- Counter is automatic
- Don't manually edit quotation numbers
- Counter increments with each new quotation

## Future Enhancements

- [ ] Email integration for automatic sending
- [ ] Multi-user accounts with roles
- [ ] Cloud backup to Google Drive/Dropbox
- [ ] Barcode/QR code generation
- [ ] Invoice generation from quotations
- [ ] Payment tracking
- [ ] Analytics and reporting
- [ ] Mobile app
- [ ] SMS integration
- [ ] Recurring quotations

## Performance Notes

- Optimized for up to 1000 quotations
- Local storage preferred over server-based
- All calculations done client-side
- Minimal bandwidth usage
- No external API calls required

## Support & Feedback

For issues, suggestions, or feedback:
1. Check this README
2. Review the troubleshooting section
3. Clear cache and try again
4. Export backup before major operations

## License

This is a professional quotation management system designed for AKB Engineering and similar industrial companies.

## Security Notes

- All data stored locally in browser
- No server transmission required
- Password stored in local storage (demo only)
- For production: implement server-side authentication
- Regular backups recommended

## Version History

### v1.0 (Current)
- Initial release
- All core features implemented
- Modern UI with glassmorphism
- Responsive design
- Full quotation workflow

---

**Last Updated**: 2024
**Created for**: AKB Engineering
**Application**: Quotation Management System
