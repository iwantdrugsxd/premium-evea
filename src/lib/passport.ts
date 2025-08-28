import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

// Local Strategy for email/password authentication
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      // Find user by email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !user) {
        return done(null, false, { message: 'Invalid email or password' })
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid email or password' })
      }

      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }
))

// Google OAuth Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', profile.id)
        .single()

      if (existingUser) {
        return done(null, existingUser)
      }

      // Check if user exists with same email
      const { data: emailUser, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', profile.emails?.[0]?.value)
        .single()

      if (emailUser) {
        // Update existing user with Google ID
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ google_id: profile.id })
          .eq('id', emailUser.id)
          .select()
          .single()

        if (updateError) {
          return done(updateError)
        }

        return done(null, updatedUser)
      }

      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          full_name: profile.displayName,
          email: profile.emails?.[0]?.value,
          google_id: profile.id,
          mobile_number: '',
          location: ''
        }])
        .select()
        .single()

      if (createError) {
        return done(createError)
      }

      return done(null, newUser)
    } catch (error) {
      return done(error)
    }
  }
))

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !user) {
      return done(null, false)
    }

    return done(null, user)
  } catch (error) {
    return done(error)
  }
})

export default passport
