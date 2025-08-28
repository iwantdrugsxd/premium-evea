# Environment Variables Setup for EVEA Event Planning

Create a `.env.local` file in the root of your project with the following variables:

## Supabase Configuration
```env
# Supabase URL (from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

# Supabase Service Role Key (from your Supabase project settings)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Supabase Anon Key (for client-side operations)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## WhatsApp Integration (Twilio)
```env
# Twilio Account SID
TWILIO_ACCOUNT_SID=your_twilio_account_sid

# Twilio Auth Token
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# Twilio WhatsApp Number (format: +1234567890)
TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number
```

## Admin Contact Information
```env
# Admin WhatsApp Number
ADMIN_WHATSAPP=+919876543210

# Admin Email
ADMIN_EMAIL=admin@evea.com

# Admin Name
ADMIN_NAME=EVEA Admin
```

## Email Service (Optional - for backup notifications)
```env
# SMTP Configuration (if using email service)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Or use SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
```

## Next.js Configuration
```env
# Next.js Secret (for JWT tokens)
NEXTAUTH_SECRET=your_nextauth_secret

# Next.js URL
NEXTAUTH_URL=http://localhost:3000
```

## Setup Instructions

1. **Supabase Setup:**
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the Project URL and keys
   - Run the `database-schema.sql` in the SQL editor

2. **Twilio Setup:**
   - Sign up for a Twilio account
   - Get your Account SID and Auth Token
   - Set up WhatsApp Business API
   - Get your WhatsApp number

3. **Admin Settings:**
   - Update the admin contact information
   - Ensure the WhatsApp number is in the correct format

4. **Email Service (Optional):**
   - Set up SMTP or SendGrid for email notifications
   - This is used as a backup to WhatsApp notifications

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets
- Regularly rotate your API keys
- Use environment-specific configurations for production

## Testing

After setting up the environment variables:

1. Start your development server: `npm run dev`
2. Test the event planning flow
3. Check the console for WhatsApp message logs
4. Verify database connections

## Production Deployment

For production deployment:

1. Set up environment variables in your hosting platform
2. Use production Supabase project
3. Set up proper Twilio WhatsApp Business API
4. Configure email service for production
5. Update `NEXTAUTH_URL` to your production domain
