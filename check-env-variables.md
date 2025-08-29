# Check Your Environment Variables

## Step 1: Verify Your .env.local File

Make sure your `.env.local` file in the `evea-nextjs` folder contains:

```env
# Resend Email Service
RESEND_API_KEY=re_your_resend_api_key_here

# Your admin email
ADMIN_EMAIL=vnair0795@gmail.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 2: Restart Your Development Server

After updating `.env.local`:

1. **Stop the server** (Ctrl+C in terminal)
2. **Restart the server**:
   ```bash
   npm run dev
   ```

## Step 3: Check Terminal Output

Look for this line when the server starts:
```
- Environments: .env.local
```

This confirms your environment variables are loaded.

## Step 4: Test the Email System

1. Go to `http://localhost:3001/plan-event`
2. Complete the form
3. Check your email at `vnair0795@gmail.com`

## Troubleshooting

### If emails still go to wrong address:
1. **Check database** - Run the SQL script to update admin email
2. **Check .env.local** - Make sure ADMIN_EMAIL is correct
3. **Restart server** - Environment variables need restart
4. **Check terminal logs** - Look for the email address being used
