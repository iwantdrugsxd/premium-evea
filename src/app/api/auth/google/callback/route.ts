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

    // Set JWT token in cookie and redirect to plan event
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
          <style>
            body {
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .container {
              text-align: center;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .success-icon {
              width: 60px;
              height: 60px;
              background: #4CAF50;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
              animation: pulse 2s infinite;
            }
            .checkmark {
              color: white;
              font-size: 24px;
              font-weight: bold;
            }
            h2 {
              color: white;
              margin: 0 0 10px 0;
              font-size: 28px;
              font-weight: 600;
            }
            p {
              color: rgba(255, 255, 255, 0.8);
              margin: 0 0 30px 0;
              font-size: 16px;
            }
            .spinner {
              width: 30px;
              height: 30px;
              border: 3px solid rgba(255, 255, 255, 0.3);
              border-top: 3px solid white;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto;
            }
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">
              <div class="checkmark">✓</div>
            </div>
            <h2>Welcome to EVEA!</h2>
            <p>Authentication successful. Redirecting to event planning...</p>
            <div class="spinner"></div>
          </div>
          <script>
            try {
              // Store authentication data
              localStorage.setItem('authToken', '${result.token}');
              localStorage.setItem('userData', '${JSON.stringify(result.user)}');
              console.log('✅ User authenticated:', ${JSON.stringify(result.user)});
              
              // Redirect to plan event page
              setTimeout(() => {
                window.location.href = '/plan-event';
              }, 2000);
            } catch (error) {
              console.error('❌ Error storing user data:', error);
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
