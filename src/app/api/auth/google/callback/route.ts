import { NextRequest, NextResponse } from 'next/server'
import { authenticateGoogle } from '@/lib/auth-middleware'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(new URL('/login?error=google_auth_failed', request.url))
    }
    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url))
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${request.nextUrl.origin}/api/auth/google/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text())
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url))
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!userInfoResponse.ok) {
      console.error('User info fetch failed:', await userInfoResponse.text())
      return NextResponse.redirect(new URL('/login?error=user_info_failed', request.url))
    }

    const userInfo = await userInfoResponse.json()
    console.log('Google user info:', userInfo)

    // Authenticate user using Google strategy
    const result = await authenticateGoogle(userInfo)

    if (!result.success) {
      console.error('Google authentication failed:', result.error)
      return NextResponse.redirect(new URL('/login?error=google_auth_failed', request.url))
    }

    // Set JWT token in cookie and localStorage
    const response = NextResponse.redirect(new URL('/plan-event', request.url))
    response.cookies.set('authToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    const script = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Successful</title>
        </head>
        <body>
          <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h2>Authentication Successful!</h2>
            <p>Redirecting to event planning...</p>
          </div>
          <script>
            try {
              localStorage.setItem('authToken', '${result.token}');
              localStorage.setItem('userData', '${JSON.stringify(result.user)}');
              console.log('User data stored:', ${JSON.stringify(result.user)});
              window.location.href = '/plan-event';
            } catch (error) {
              console.error('Error storing user data:', error);
              window.location.href = '/login?error=storage_failed';
            }
          </script>
        </body>
      </html>
    `
    return new Response(script, { headers: { 'Content-Type': 'text/html' } })

  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(new URL('/login?error=callback_failed', request.url))
  }
}
