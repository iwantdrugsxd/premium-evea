# Google Form Setup Guide for Vendor Registration

## 📋 Form Fields Required

Create a Google Form with the following fields (in this exact order):

### **Basic Information**
1. **Business Name** (Short answer) - Required
2. **Business Type** (Dropdown) - Required
   - Options: Photography & Videography, Catering & Food Services, Decoration & Florist, Music & Entertainment, Floral Design, Transportation & Logistics, Luxury Services, Wedding Planning, Corporate Events, Birthday & Celebrations, Lighting & Sound, Security Services, Other
3. **Contact Person Name** (Short answer) - Required
4. **Phone Number** (Short answer) - Required
5. **Email Address** (Short answer) - Required
6. **WhatsApp Number** (Short answer) - Optional (defaults to phone number)

### **Location Information**
7. **City** (Short answer) - Required
8. **State** (Dropdown) - Required
   - Options: Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal, Delhi, Jammu and Kashmir, Ladakh, Puducherry, Chandigarh, Dadra and Nagar Haveli and Daman and Diu, Lakshadweep, Andaman and Nicobar Islands
9. **Address** (Paragraph) - Optional

### **Business Details**
10. **Business Description** (Paragraph) - Required
11. **Services Offered** (Checkboxes) - Required
    - Options: Wedding Photography, Event Photography, Catering Services, Event Decoration, Music & DJ, Transportation, Event Planning, Venue Booking, Lighting & Sound, Security Services, Other
12. **Minimum Price** (Short answer) - Optional (numbers only)
13. **Maximum Price** (Short answer) - Optional (numbers only)

### **Online Presence**
14. **Instagram Handle** (Short answer) - Optional (format: @username)
15. **Website URL** (Short answer) - Optional (must include http:// or https://)
16. **Portfolio Images** (Short answer) - Optional
    - Instructions: "Enter image URLs separated by commas (e.g., https://example.com/image1.jpg, https://example.com/image2.jpg)"

## 🔧 Google Apps Script Setup

### Step 1: Create Apps Script Project
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the content from `apps-script.js`
4. Save the project

### Step 2: Set Up Form Trigger
1. In Apps Script, click on "Triggers" (clock icon)
2. Click "Add Trigger"
3. Configure:
   - Function: `onFormSubmit`
   - Event source: "From form"
   - Event type: "On form submit"
   - Select your Google Form
4. Click "Save"

### Step 3: Deploy as Web App
1. Click "Deploy" > "New deployment"
2. Choose "Web app" as type
3. Set:
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click "Deploy"
5. Copy the web app URL (you'll need this for the form)

### Step 4: Update API URL
In the Apps Script code, update this line with your actual domain:
```javascript
const apiUrl = 'https://premium-evea.vercel.app/api/vendors/google-form';
```

## 🧪 Testing

### Test the Integration
1. In Apps Script, run the `testFormSubmission` function
2. Check your database to see if the test vendor was created
3. Submit a real form to verify the complete flow

### Test Form Submission
1. Fill out the Google Form with test data
2. Submit the form
3. Check your Supabase database for the new vendor entry
4. Verify the confirmation email was sent

## 📧 Email Notifications

The script automatically sends confirmation emails to vendors when they register. Make sure:
1. The Apps Script project has Gmail API access
2. The email template in the script matches your brand
3. Test the email functionality

## 🔒 Security Considerations

1. **API Key Protection**: Don't expose your Supabase service key in client-side code
2. **Form Validation**: The API endpoint validates all required fields
3. **Rate Limiting**: Consider adding rate limiting to prevent spam
4. **Data Sanitization**: All form data is sanitized before database insertion

## 🚀 Deployment Checklist

- [ ] Google Form created with all required fields
- [ ] Apps Script project created and configured
- [ ] Form trigger set up
- [ ] API endpoint deployed and tested
- [ ] Test form submission completed
- [ ] Email notifications working
- [ ] Database entries verified

## 📞 Support

If you encounter issues:
1. Check the Apps Script execution logs
2. Verify the API endpoint is accessible
3. Test with the provided test function
4. Check Supabase logs for database errors
