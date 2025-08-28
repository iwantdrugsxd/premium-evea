import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// TODO: Replace with Supabase integration
// For now, using mock data - replace with actual Supabase queries
let users = [
  {
    id: 1,
    fullName: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$hashedpassword',
    mobileNumber: '+919876543210',
    location: 'Mumbai, Maharashtra',
    googleId: null
  }
];

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }

    // Verify Google access token
    const googleResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    );

    if (!googleResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid Google access token' },
        { status: 401 }
      );
    }

    const googleUser = await googleResponse.json();

    // Check if user exists
    let user = users.find(u => u.email === googleUser.email);

    if (!user) {
      // Create new user
      user = {
        id: users.length + 1,
        fullName: googleUser.name,
        email: googleUser.email,
        password: '', // No password for Google users
        mobileNumber: '',
        location: '',
        googleId: googleUser.id
      };
      users.push(user);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        fullName: user.fullName 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
