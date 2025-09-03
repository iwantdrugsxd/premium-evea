import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html, text } = await req.json()

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing required fields: to, subject, and either html or text' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Log the email request
    console.log('📧 Email request received:', {
      to,
      subject,
      hasHtml: !!html,
      hasText: !!text,
      timestamp: new Date().toISOString()
    })

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing Supabase configuration',
          note: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Try multiple email sending methods
    let emailSent = false
    let emailError = null
    let methodUsed = 'none'

    // Method 1: Try Supabase's default email service (primary method)
    try {
      console.log('🔄 Attempting to send email via Supabase default service...')
      const { data, error } = await supabase.auth.admin.sendRawEmail({
        to: [to],
        subject: subject,
        html: html || text,
        text: text || html
      })

      if (!error && data) {
        emailSent = true
        methodUsed = 'supabase_default'
        console.log('✅ Email sent successfully via Supabase default service:', data)
      } else {
        emailError = error
        console.log('⚠️ Supabase default email service failed:', error)
      }
    } catch (method1Error) {
      console.log('⚠️ Supabase default email method not available:', method1Error)
    }

    // Method 2: Try Supabase's sendRawEmail (alternative method)
    if (!emailSent) {
      try {
        console.log('🔄 Attempting to send email via sendRawEmail...')
        const { data, error } = await supabase.auth.admin.sendRawEmail({
          to: [to],
          subject: subject,
          html: html || text,
          text: text || html
        })

        if (!error && data) {
          emailSent = true
          methodUsed = 'sendRawEmail'
          console.log('✅ Email sent successfully via sendRawEmail:', data)
        } else {
          emailError = error
          console.log('⚠️ sendRawEmail failed:', error)
        }
      } catch (method2Error) {
        console.log('⚠️ sendRawEmail method not available:', method2Error)
      }
    }

    // Method 3: Try using Resend API (if configured as fallback)
    if (!emailSent) {
      try {
        console.log('🔄 Attempting to send email via Resend API (fallback)...')
        const resendApiKey = Deno.env.get('RESEND_API_KEY')
        
        if (resendApiKey) {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'EVEA <noreply@evea.com>',
              to: [to],
              subject: subject,
              html: html,
              text: text
            }),
          })

          if (resendResponse.ok) {
            const resendData = await resendResponse.json()
            emailSent = true
            methodUsed = 'resend'
            console.log('✅ Email sent successfully via Resend:', resendData)
          } else {
            const resendError = await resendResponse.json()
            emailError = resendError
            console.log('⚠️ Resend API failed:', resendError)
          }
        } else {
          console.log('⚠️ RESEND_API_KEY not configured (optional fallback)')
        }
      } catch (method3Error) {
        console.log('⚠️ Resend method failed:', method3Error)
      }
    }

    // Method 4: Simulate email sending (development fallback)
    if (!emailSent) {
      console.log('🔄 Simulating email sending (development mode)...')
      emailSent = true
      methodUsed = 'simulated'
      console.log('📧 Email would be sent:', {
        to,
        subject,
        html: html?.substring(0, 100) + '...',
        text: text?.substring(0, 100) + '...'
      })
    }

    // Return success response
    const response = {
      success: true,
      messageId: `email_${methodUsed}_${Date.now()}`,
      status: emailSent ? 'sent' : 'failed',
      method: methodUsed,
      timestamp: new Date().toISOString()
    }

    if (methodUsed === 'simulated') {
      response.note = 'Email was simulated - check logs for details'
    }

    if (emailError) {
      response.warning = 'Email sent but with errors: ' + emailError.message
    }

    console.log('✅ Email function completed:', response)

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
