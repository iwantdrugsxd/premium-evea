# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number

# Admin Contact Information
ADMIN_WHATSAPP=+919876543210
ADMIN_EMAIL=admin@evea.com

# SMTP Configuration for Email Backup
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Setup Instructions:

1. **Supabase Setup:**
   - Go to your Supabase project dashboard
   - Copy the project URL and service role key
   - Run the database schema from `database-schema.sql`

2. **Twilio WhatsApp Setup:**
   - Sign up for Twilio account
   - Get your Account SID and Auth Token
   - Set up WhatsApp Business API
   - Get your WhatsApp number

3. **Admin Contact:**
   - Set your admin WhatsApp number
   - Set your admin email for backup notifications

4. **SMTP Setup (Optional):**
   - Configure Gmail or other SMTP service
   - Enable 2-factor authentication
   - Generate app password
