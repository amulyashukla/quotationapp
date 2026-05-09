<!-- DEPLOYMENT_GUIDE.md -->

# Deployment Guide

Complete instructions for deploying the AKB Engineering Quotation System to various platforms.

---

## 🚀 Pre-Deployment Checklist

Before deploying, verify:

### Code Quality
- [ ] All pages load without errors (F12 console)
- [ ] All features tested in browser
- [ ] No broken links
- [ ] All images/assets present
- [ ] Search and filter working
- [ ] PDF download working
- [ ] Dark mode toggle working

### Data & Settings
- [ ] Company information filled in Settings
- [ ] Default products added
- [ ] Demo data tested
- [ ] Admin credentials changed (if needed)
- [ ] Data backup exported

### Performance
- [ ] Application loads quickly
- [ ] No console errors
- [ ] Mobile responsive (test on multiple sizes)
- [ ] Dark mode displays correctly

### Documentation
- [ ] README.md ready
- [ ] QUICK_START.md ready
- [ ] CUSTOMIZATION_GUIDE.md ready
- [ ] User trained on usage

---

## 1️⃣ Deploy to Vercel (Recommended - Easiest)

### Step 1: Prepare Files
1. Open your quotation-app folder
2. Ensure all files are present
3. No broken links or references

### Step 2: Create Vercel Account
1. Go to https://vercel.com/signup
2. Sign up with GitHub, GitLab, or email
3. Verify email

### Step 3: Connect Project

**Option A: Via GitHub (Recommended)**
```bash
1. Push quotation-app to GitHub repository
2. Go to Vercel dashboard
3. Click "New Project"
4. Select your GitHub repository
5. Configure:
   - Framework: Other (HTML/CSS/JS)
   - Build Command: (leave empty)
   - Output Directory: quotation-app/
   - Root Directory: ./
6. Click "Deploy"
```

**Option B: Direct Upload**
```bash
1. Install Vercel CLI: npm install -g vercel
2. Navigate to quotation-app folder
3. Run: vercel
4. Follow prompts
5. Deployment completes
```

### Step 4: Verify Deployment
1. Visit the provided Vercel URL
2. Test all features
3. Verify data persistence
4. Check mobile responsiveness
5. Test on different browsers

### Step 5: Custom Domain (Optional)
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain
5. Follow DNS configuration instructions

**Result**: Your app is now live at vercel.app or your custom domain!

---

## 2️⃣ Deploy to Netlify

### Step 1: Create Netlify Account
1. Go to https://netlify.com
2. Click "Sign up"
3. Choose GitHub, GitLab, or email
4. Verify account

### Step 2: Deploy Project

**Option A: Drag & Drop (Easiest)**
```bash
1. Go to https://app.netlify.com
2. Drag quotation-app folder onto the drop area
3. Wait for deployment
4. Get Netlify URL
```

**Option B: Connect Git**
```bash
1. Push quotation-app to GitHub
2. Go to Netlify
3. Click "New site from Git"
4. Select your repository
5. Configure:
   - Build command: (leave empty)
   - Publish directory: quotation-app/
6. Click "Deploy"
```

### Step 3: Configure
1. Go to Site settings
2. Update site name
3. Add custom domain (if available)
4. Configure environment (if needed)

**Result**: Live on netlify.app!

---

## 3️⃣ Deploy to GitHub Pages

### Step 1: Create Repository
```bash
1. Go to github.com
2. Click "New repository"
3. Name: quotation-app
4. Make it Public
5. Create
```

### Step 2: Push Code
```bash
# Initialize git in your folder
cd quotation-app
git init

# Add all files
git add .

# Commit
git commit -m "Initial deployment of AKB Quotation System"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/quotation-app.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
```bash
1. Go to repository settings
2. Scroll to "GitHub Pages" section
3. Source: main branch
4. Folder: / (root)
5. Save
6. Wait 1-2 minutes
```

### Step 4: Access Your Site
```
URL: https://YOUR_USERNAME.github.io/quotation-app/
```

**Note**: GitHub Pages serves from repository, so ensure index.html is in root or referenced correctly.

---

## 4️⃣ Deploy to Self-Hosted Server

### Step 1: Prepare Server
Ensure you have:
- Web server (Apache, Nginx, IIS)
- FTP/SSH access
- Sufficient storage (100MB)
- Static file serving enabled

### Step 2: Upload Files

**Option A: FTP**
```bash
1. Use FileZilla or similar FTP client
2. Connect to server
3. Navigate to public_html or www folder
4. Upload quotation-app folder
```

**Option B: SSH**
```bash
# Connect to server
ssh user@your-domain.com

# Navigate to web directory
cd /var/www/html/

# Upload files (from local machine)
# On local: scp -r quotation-app user@your-domain.com:/var/www/html/
```

**Option C: cPanel**
```bash
1. Login to cPanel
2. Go to File Manager
3. Navigate to public_html
4. Upload quotation-app.zip
5. Extract files
```

### Step 3: Configure Web Server

**Apache (htaccess)**
Create `.htaccess` in quotation-app:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /quotation-app/
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /quotation-app/index.html [L]
</IfModule>
```

**Nginx**
Add to nginx.conf:
```nginx
location /quotation-app/ {
    try_files $uri $uri/ /quotation-app/index.html;
}
```

### Step 4: Test
1. Visit your-domain.com/quotation-app/
2. Test all features
3. Verify data persists
4. Check browser console for errors

---

## 5️⃣ Deploy to AWS S3 + CloudFront

### Step 1: Create S3 Bucket
```bash
1. Go to AWS Console
2. Search for S3
3. Click "Create bucket"
4. Name: quotation-app-yourdomain
5. Disable "Block all public access"
6. Create
```

### Step 2: Upload Files
```bash
1. Open bucket
2. Click "Upload"
3. Drag quotation-app folder
4. Upload
```

### Step 3: Enable Static Website Hosting
```bash
1. Go to bucket Properties
2. Find "Static website hosting"
3. Click "Edit"
4. Enable
5. Index: index.html
6. Save
```

### Step 4: Create CloudFront Distribution
```bash
1. Go to CloudFront
2. Click "Create distribution"
3. Origin: Your S3 bucket
4. Settings: Default
5. Create
6. Wait 5-10 minutes for deployment
```

### Step 5: Access
```
URL: https://d111111abcdef8.cloudfront.net/
```

---

## 📝 Post-Deployment Checklist

After deployment, verify:

### Functionality
- [ ] Login works
- [ ] Dashboard loads correctly
- [ ] All pages accessible
- [ ] Forms submit successfully
- [ ] PDF download works
- [ ] WhatsApp share works
- [ ] Search functions work
- [ ] Dark mode toggle works
- [ ] Data persists after refresh

### Performance
- [ ] Page load time < 3 seconds
- [ ] No 404 errors
- [ ] No console errors (F12)
- [ ] Images load correctly
- [ ] Responsive on mobile
- [ ] Responsive on tablet

### Security
- [ ] No sensitive data in URLs
- [ ] HTTPS enabled (if on server)
- [ ] No API keys exposed
- [ ] Password not visible in console
- [ ] Forms validate input

### Analytics (Optional)
- [ ] Google Analytics tracking added
- [ ] User tracking working
- [ ] Traffic being monitored

---

## 🔧 Troubleshooting Deployment

### Issue: Blank Page
**Cause**: Incorrect path or missing files
**Fix**:
1. Check index.html path
2. Verify all assets loaded
3. Check F12 console for errors
4. Verify file structure matches local

### Issue: 404 on Pages
**Cause**: Routing not configured
**Fix**:
1. For Vercel/Netlify: Add vercel.json or netlify.toml
2. For self-hosted: Configure web server rewrite rules

### Issue: PDF Download Not Working
**Cause**: html2pdf.js not loading
**Fix**:
1. Check if html2pdf script loaded
2. Verify CDN URL accessible
3. Check browser console for errors

### Issue: WhatsApp Not Opening
**Cause**: Phone number format or popup blocked
**Fix**:
1. Verify phone format has country code
2. Disable popup blocker
3. Try on different browser

### Issue: Dark Mode Not Working
**Cause**: Theme preference not persisting
**Fix**:
1. Check localStorage is enabled
2. Clear browser cache
3. Test in incognito/private mode

### Issue: Slow Loading
**Cause**: Large database or network latency
**Fix**:
1. Export old data
2. Clear unnecessary records
3. Optimize images
4. Use CDN for assets

---

## 🌐 Domain Setup (Advanced)

### Pointing Custom Domain

**For Vercel**:
1. In Vercel dashboard, go to Settings
2. Domains > Add domain
3. Follow Vercel's DNS setup
4. Takes 5-30 minutes

**For Netlify**:
1. In Netlify, go to Settings
2. Domain management
3. Add custom domain
4. Update DNS records

**For Self-Hosted**:
1. Go to domain registrar
2. Update A record to server IP
3. Or update CNAME to your server
4. Wait 24-48 hours for propagation

### SSL Certificate

**Vercel/Netlify**: Automatic HTTPS included ✅

**Self-Hosted**:
```bash
# Use Let's Encrypt (free)
certbot certonly --webroot -w /var/www/html -d your-domain.com
```

---

## 📊 Environment Variables (Advanced)

If you need configuration:

**Create `.env` file** (local development):
```
VITE_API_URL=https://your-api.com
VITE_COMPANY_NAME=AKB Engineering
VITE_MAX_STORAGE=5000000
```

**Deploy to production**:
1. Set environment variables in platform settings
2. Reference in code: `process.env.VITE_VARIABLE_NAME`

---

## 🔄 Updates & Maintenance

### Deploy Updates
```bash
# Make changes locally
1. Edit files
2. Test thoroughly
3. Commit changes
4. Push to repository

# On Vercel/Netlify: Auto-redeploy on push
# On self-hosted: Upload new files via FTP/SSH
```

### Version Control
```bash
# Tag releases
git tag v1.0
git tag v1.1
git push --tags
```

### Backups
```bash
# Regular backups
1. Export user data monthly
2. Backup database if using backend
3. Save to cloud storage
4. Keep at least 3 versions
```

---

## 📱 Mobile Deployment

### iOS (via Web App)
1. Open in Safari
2. Tap Share
3. Select "Add to Home Screen"
4. Works as standalone app

### Android
1. Open in Chrome
2. Tap menu (three dots)
3. Select "Install app"
4. Works as standalone app

### Progressive Web App (PWA)
Add to `index.html` head:
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#0066cc">
<meta name="mobile-web-app-capable" content="yes">
```

---

## ✅ Deployment Verification Checklist

After going live:

```
FUNCTIONALITY
[ ] Login/Logout works
[ ] Dashboard displays stats
[ ] Can create quotations
[ ] Can create customers
[ ] Can add products
[ ] Can create inquiries
[ ] PDF generation works
[ ] WhatsApp share works
[ ] Search works on all pages
[ ] Export/Import works
[ ] Dark mode works
[ ] Settings save

PERFORMANCE
[ ] Page loads in < 3 seconds
[ ] No lag when creating quotations
[ ] PDF download completes in < 5 seconds
[ ] Mobile responsive (< 768px)
[ ] Tablet responsive (768px-1024px)
[ ] Desktop responsive (> 1024px)

SECURITY
[ ] HTTPS enabled (if applicable)
[ ] No sensitive data in URLs
[ ] Form validation working
[ ] Data persists securely
[ ] Logout clears session

MONITORING
[ ] Analytics tracking working
[ ] Error logging enabled
[ ] Performance metrics tracking
[ ] User activity monitoring
```

---

## 🎯 Go-Live Plan

### Phase 1: Pre-Launch (1 week before)
- [ ] All testing complete
- [ ] Team trained
- [ ] Backup systems ready
- [ ] Support plan in place

### Phase 2: Soft Launch (limited users)
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Collect feedback
- [ ] Make adjustments

### Phase 3: Full Launch
- [ ] All users migrated
- [ ] Data imported
- [ ] Training completed
- [ ] Support available

### Phase 4: Post-Launch (first week)
- [ ] Daily monitoring
- [ ] Bug fixes deployed ASAP
- [ ] User support provided
- [ ] Performance optimized

---

## 📞 Deployment Support

**Platform Documentation**:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- GitHub Pages: https://pages.github.com
- AWS: https://aws.amazon.com/documentation/

**Common Issues**:
- See Troubleshooting section above
- Check platform-specific documentation
- Test locally before deploying
- Check browser console (F12)

---

## 🎉 Deployment Complete!

Your quotation management system is now live and accessible to users.

**Next Steps**:
1. Monitor performance
2. Collect user feedback
3. Plan updates
4. Scale if needed
5. Add advanced features

---

**Congratulations on your deployment!** 🚀

