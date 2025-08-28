# EVEA Backend Setup Guide

## 🚀 **Complete Authentication & Backend Implementation**

### **✅ What's Been Implemented:**

#### **1. Authentication System**
- ✅ **Login Page** (`/login`) - Email/password authentication
- ✅ **Signup Page** (`/signup`) - User registration with all required fields
- ✅ **Google OAuth** - Direct authentication to marketplace
- ✅ **JWT Token Management** - Secure session handling
- ✅ **Profile Dropdown** - Settings, Profile, Logout options
- ✅ **Navigation Updates** - Login button replaces "Plan Your Event"

#### **2. Backend API Routes**
- ✅ **`/api/auth/login`** - User authentication with Passport.js
- ✅ **`/api/auth/signup`** - User registration with password hashing
- ✅ **`/api/auth/google`** - Google OAuth authentication
- ✅ **`/api/events`** - Events with predetermined services and packages
- ✅ **`/api/vendors`** - Marketplace vendors with portfolio images

#### **3. Database Schema (Supabase)**
- ✅ **Complete SQL Schema** - All tables with relationships
- ✅ **Sample Data** - Events, services, packages, vendors, portfolio
- ✅ **Row Level Security** - Secure data access
- ✅ **Indexes** - Optimized performance

### **🔧 Setup Instructions:**

#### **1. Environment Variables**
Create `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

#### **2. Supabase Database Setup**
1. Create a new Supabase project
2. Go to SQL Editor
3. Copy and paste the entire content from `database-schema.sql`
4. Execute the SQL to create all tables and sample data

#### **3. Google OAuth Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
   - `http://localhost:3000/marketplace`

#### **4. Install Dependencies**
```bash
npm install
```

#### **5. Run the Development Server**
```bash
npm run dev
```

### **🎯 Authentication Flow:**

#### **Local Login:**
1. User visits `/login`
2. Enters email/password
3. API validates credentials
4. JWT token generated and stored
5. Redirected to `/marketplace`
6. Profile dropdown shows user info

#### **Google OAuth:**
1. User clicks "Continue with Google"
2. Google OAuth popup opens
3. User authenticates with Google
4. User data fetched and stored
5. JWT token generated
6. Direct redirect to `/marketplace`

#### **Signup Flow:**
1. User visits `/signup`
2. Fills all required fields
3. Password hashed with bcrypt
4. User created in database
5. Redirected to `/login`
6. Can then login normally

### **📊 Database Tables:**

#### **Core Tables:**
- **`users`** - User profiles and authentication
- **`events`** - Event types (Wedding, Corporate, etc.)
- **`event_services`** - Services for each event type
- **`event_packages`** - Predefined packages with rates
- **`vendors`** - Marketplace vendors
- **`vendor_portfolio`** - Vendor portfolio images
- **`vendor_reviews`** - Vendor reviews and ratings

#### **User Data Tables:**
- **`user_events`** - User's planned events
- **`user_vendor_selections`** - Marketplace cart items

### **🔐 Security Features:**
- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **JWT Tokens** - Secure session management
- ✅ **Row Level Security** - Supabase RLS policies
- ✅ **Input Validation** - Form validation and sanitization
- ✅ **CORS Protection** - API route protection

### **🎨 Frontend Integration:**
- ✅ **Responsive Design** - Mobile-friendly authentication
- ✅ **Loading States** - User feedback during operations
- ✅ **Error Handling** - Graceful error messages
- ✅ **Smooth Transitions** - Framer Motion animations
- ✅ **Profile Management** - User profile dropdown

### **📱 User Experience:**
- ✅ **Seamless Navigation** - Login/logout state management
- ✅ **Persistent Sessions** - JWT token storage
- ✅ **Auto-redirect** - Smart routing based on auth state
- ✅ **Profile Access** - Settings, profile, logout options

### **🚀 Next Steps:**
1. Set up Supabase project and run schema
2. Configure environment variables
3. Set up Google OAuth credentials
4. Test authentication flows
5. Deploy to production

### **🔧 Troubleshooting:**
- **Database Connection**: Check Supabase URL and keys
- **Google OAuth**: Verify redirect URIs and credentials
- **JWT Issues**: Ensure JWT_SECRET is set
- **CORS Errors**: Check API route configurations

---

**🎉 Your EVEA platform now has a complete authentication system and backend infrastructure!**
