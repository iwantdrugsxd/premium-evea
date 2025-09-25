# 🏢 Vendor Creation Scripts Setup Guide

## 📋 Overview

I've created 3 separate scripts to handle the complete vendor creation process:

1. **`1-create-vendor-users.js`** - Creates vendor users in Supabase Auth
2. **`2-create-vendor-data.js`** - Creates vendor profiles in users table and vendors table
3. **`3-upload-portfolio-images.js`** - Uploads portfolio images to Cloudinary and updates vendor records

## 🚀 Quick Start

### **Option 1: Run All Scripts (Recommended)**
```bash
node run-all-vendor-scripts.js
```

### **Option 2: Run Individual Scripts**
```bash
# Step 1: Create users
node 1-create-vendor-users.js

# Step 2: Create vendor data
node 2-create-vendor-data.js

# Step 3: Upload images
node 3-upload-portfolio-images.js
```

## ⚙️ Setup Required

### **1. Environment Variables**
Add to your `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **2. Install Dependencies**
```bash
npm install @supabase/supabase-js cloudinary
```

## 📊 What Each Script Does

### **Script 1: Create Vendor Users**
- Creates users in Supabase Auth with temporary passwords
- Creates user profiles in `users` table
- Saves results to `vendor-users-results.json`

**Vendor Users Created:**
- Baldev Singh Rajpurohit (rajpurohitdecorator@gmail.com)
- Parag Thakkar (parag.thakkar@example.com)
- Hardik Neelam Thakkar (Hardikthakkar1909@gmail.com)

### **Script 2: Create Vendor Data**
- Creates vendor records in `vendors` table
- Links vendors to their user accounts
- Maps service categories and locations
- Saves results to `vendor-data-results.json`

**Vendor Data:**
- Business names, descriptions, contact info
- Service categories and areas
- Addresses and locations
- Instagram handles and social media

### **Script 3: Upload Portfolio Images**
- Converts Google Drive URLs to direct download URLs
- Uploads images to Cloudinary with optimization
- Updates vendor records with Cloudinary URLs
- Saves results to `portfolio-upload-results.json`

**Images Uploaded:**
- Rajpurohit Decorator: 5 images
- R R decorators: 1 image
- La Fiesta Decors: 10 images

## 🔧 Script Features

### **Error Handling**
- ✅ Continues processing if one vendor fails
- ✅ Detailed error messages for each step
- ✅ Saves results for debugging

### **Rate Limiting**
- ✅ 1-second delay between API calls
- ✅ Prevents Cloudinary rate limiting
- ✅ Prevents Supabase rate limiting

### **Data Validation**
- ✅ Validates email addresses
- ✅ Handles missing data gracefully
- ✅ Maps service categories correctly

### **Image Optimization**
- ✅ Converts to WebP format
- ✅ Resizes to 800x600 pixels
- ✅ Organizes in vendor-specific folders

## 📁 Output Files

After running the scripts, you'll get:

- **`vendor-users-results.json`** - User creation results
- **`vendor-data-results.json`** - Vendor data creation results
- **`portfolio-upload-results.json`** - Image upload results

## 🧪 Testing

### **Test Individual Scripts**
```bash
# Test user creation
node 1-create-vendor-users.js

# Check results
cat vendor-users-results.json
```

### **Test Complete Flow**
```bash
# Run all scripts
node run-all-vendor-scripts.js

# Check all results
ls -la *-results.json
```

## 🐛 Troubleshooting

### **Common Issues**

1. **"Could not load vendor-users-results.json"**
   - Run scripts in order: 1 → 2 → 3

2. **"Invalid api_key"**
   - Check Cloudinary credentials in .env.local

3. **"Invalid JWT"**
   - Check Supabase credentials in .env.local

4. **"Rate limit exceeded"**
   - Scripts include delays, but you can increase them if needed

### **Debug Mode**
Add console.log statements to see detailed output:
```javascript
console.log('Debug: Processing vendor:', vendor.businessName);
```

## 🎯 Expected Results

After running all scripts:

- ✅ 3 vendor users created in Supabase Auth
- ✅ 3 user profiles created in users table
- ✅ 3 vendor records created in vendors table
- ✅ 16 portfolio images uploaded to Cloudinary
- ✅ Vendor records updated with Cloudinary URLs

## 🚀 Next Steps

1. **Set up your environment variables**
2. **Run the master script**: `node run-all-vendor-scripts.js`
3. **Check your Supabase dashboard** to see the created data
4. **Check your Cloudinary dashboard** to see the uploaded images
5. **Test your website** to see vendors displayed

The scripts are designed to be safe and can be run multiple times without issues!
