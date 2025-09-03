# 🚀 Deploy Supabase Edge Function for Email

## ✅ **Current Status**
- ✅ Edge function `send-email` already exists in `supabase/functions/send-email/`
- ✅ Function code is properly written with CORS and error handling
- ✅ Uses Supabase's built-in email service

## 🎯 **Step-by-Step Deployment**

### **Step 1: Install Supabase CLI (if not already installed)**
```bash
npm install -g supabase
```

### **Step 2: Login to Supabase CLI**
```bash
supabase login
```
- This will open a browser window
- Log in with your Supabase account
- Grant necessary permissions

### **Step 3: Link Your Project**
```bash
cd evea-nextjs
supabase link --project-ref ifnpjmhewowhbsenpaeh
```
- Replace `ifnpjmhewowhbsenpaeh` with your actual project reference ID
- You can find this in your Supabase dashboard URL

### **Step 4: Deploy the Edge Function**
```bash
supabase functions deploy send-email
```

### **Step 5: Get Your Function URL**
After deployment, you'll get a URL like:
```
https://ifnpjmhewowhbsenpaeh.supabase.co/functions/v1/send-email
```

## 🔧 **Update Your API to Use Edge Function**

### **Step 1: Update Call Schedules API**
Replace the email sending logic in `/api/call-schedules/route.ts`:

```typescript
// Replace the current fetch call in sendEmailNotification function
const response = await fetch('https://ifnpjmhewowhbsenpaeh.supabase.co/functions/v1/send-email', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
  },
  body: JSON.stringify({
    to: adminSettings.admin_email,
    subject: `🎉 New Event Planning Request - ${eventRequest.events.name}`,
    html: adminEmailHtml,
    text: adminEmailText
  })
});
```

### **Step 2: Add Environment Variable**
Add to your `.env.local`:
```env
SUPABASE_EDGE_FUNCTION_URL=https://ifnpjmhewowhbsenpaeh.supabase.co/functions/v1/send-email
```

## 🧪 **Test the Deployment**

### **Step 1: Test Edge Function Directly**
```bash
curl -X POST https://ifnpjmhewowhbsenpaeh.supabase.co/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{
    "to": "vnair0795@gmail.com",
    "subject": "Test Email from Edge Function",
    "html": "<h1>Test Email</h1><p>This is a test email from Supabase Edge Function.</p>"
  }'
```

### **Step 2: Test Complete Flow**
1. Go to `/plan-event`
2. Complete all 5 steps
3. Schedule a consultation call
4. Check your email: `vnair0795@gmail.com`

## 🔍 **Troubleshooting**

### **If deployment fails:**
- Check Supabase CLI version: `supabase --version`
- Verify you're logged in: `supabase status`
- Check project link: `supabase projects list`

### **If emails don't send:**
- Check Supabase Dashboard → Edge Functions → Logs
- Verify function is deployed and active
- Check function invocation count

### **If you get CORS errors:**
- The function already has CORS configured
- Make sure you're using the correct function URL

## 📊 **Monitor Function Performance**

### **In Supabase Dashboard:**
1. Go to Edge Functions
2. Click on `send-email`
3. Check:
   - Invocation count
   - Error rate
   - Response times
   - Logs

## 🎉 **Benefits of Using Edge Function**

✅ **More reliable** than external email services  
✅ **Built into Supabase** - no external dependencies  
✅ **Better error handling** and logging  
✅ **Faster execution** - runs on Supabase infrastructure  
✅ **No rate limits** from external services  

## 🚀 **Next Steps**

1. **Deploy the function** using the commands above
2. **Update your API** to use the edge function
3. **Test the complete flow**
4. **Monitor function performance**

This should solve your email issue permanently! 🎉
