import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_request_id, scheduled_time, user_email } = body;

    // Validate required fields
    if (!event_request_id || !scheduled_time || !user_email) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: event_request_id, scheduled_time, user_email'
      }, { status: 400 });
    }

    // Get event request details
    const { data: eventRequest, error: eventError } = await supabase
      .from('event_planning_requests')
      .select(`
        *,
        events (
          id,
          name,
          description
        )
      `)
      .eq('id', event_request_id)
      .single();

    if (eventError || !eventRequest) {
      console.error('❌ Error fetching event request:', eventError);
      console.error('📊 Error details:', {
        message: eventError?.message,
        code: eventError?.code,
        details: eventError?.details,
        hint: eventError?.hint,
        timestamp: new Date().toISOString(),
        event_request_id
      });
      return NextResponse.json({
        success: false,
        error: 'Event request not found'
      }, { status: 404 });
    }

    // Get admin settings (should be only one)
    const { data: adminSettings, error: adminError } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (adminError) {
      console.error('❌ Error fetching admin settings:', adminError);
      console.error('📊 Error details:', {
        message: adminError.message,
        code: adminError.code,
        details: adminError.details,
        hint: adminError.hint,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({
        success: false,
        error: 'Admin settings not found or multiple records exist'
      }, { status: 500 });
    }

    if (!adminSettings) {
      console.error('❌ No admin settings found');
      return NextResponse.json({
        success: false,
        error: 'Admin settings not configured'
      }, { status: 500 });
    }

    // Create call schedule
    const { data: callSchedule, error: scheduleError } = await supabase
      .from('consultation_calls')
      .insert({
        event_planning_request_id: event_request_id,
        scheduled_time,
        admin_whatsapp: adminSettings.admin_whatsapp,
        user_email,
        status: 'scheduled'
      })
      .select()
      .single();

    if (scheduleError) {
      console.error('❌ Error creating call schedule:', scheduleError);
      console.error('📊 Error details:', {
        message: scheduleError.message,
        code: scheduleError.code,
        details: scheduleError.details,
        hint: scheduleError.hint,
        timestamp: new Date().toISOString(),
        requestData: {
          event_planning_request_id: event_request_id,
          scheduled_time,
          admin_whatsapp: adminSettings.admin_whatsapp,
          user_email,
          status: 'scheduled'
        }
      });
      return NextResponse.json({
        success: false,
        error: 'Failed to create call schedule'
      }, { status: 500 });
    }

    // Update event request status
    const { error: updateError } = await supabase
      .from('event_planning_requests')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', event_request_id);

    if (updateError) {
      console.error('❌ Error updating event request status:', updateError);
      console.error('📊 Error details:', {
        message: updateError.message,
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint,
        timestamp: new Date().toISOString(),
        event_request_id
      });
    }

    // Send email notification to admin
    try {
      await sendEmailNotification(eventRequest, callSchedule, adminSettings);
    } catch (emailError) {
      console.error('❌ Error sending email notification:', emailError);
      console.error('📊 Error details:', {
        message: emailError instanceof Error ? emailError.message : 'Unknown error',
        stack: emailError instanceof Error ? emailError.stack : undefined,
        timestamp: new Date().toISOString()
      });
    }

    console.log('✅ Successfully scheduled consultation call:', {
      event_request_id,
      call_schedule_id: callSchedule.id,
      scheduled_time: callSchedule.scheduled_time,
      user_email: callSchedule.user_email,
      admin_whatsapp: callSchedule.admin_whatsapp,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      call_schedule: callSchedule,
      message: 'Call scheduled successfully'
    });

  } catch (error) {
    console.error('❌ Error in call-schedules API:', error);
    console.error('📊 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const event_request_id = searchParams.get('event_request_id');

    if (!event_request_id) {
      return NextResponse.json({
        success: false,
        error: 'Event request ID is required'
      }, { status: 400 });
    }

    const { data: callSchedules, error } = await supabase
      .from('consultation_calls')
      .select('*')
      .eq('event_planning_request_id', event_request_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching call schedules:', error);
      console.error('📊 Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        timestamp: new Date().toISOString(),
        event_request_id
      });
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch call schedules'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      call_schedules: callSchedules
    });

  } catch (error) {
    console.error('❌ Error in call-schedules API:', error);
    console.error('📊 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

async function sendEmailNotification(eventRequest: any, callSchedule: any, adminSettings: any) {
  try {
    // Create professional HTML email for admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Event Planning Request - EVEA</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
          .detail { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Event Planning Request</h1>
            <p>EVEA - Creating Unforgettable Moments</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>📋 Event Details</h3>
              <div class="detail">
                <span class="label">Event Type:</span>
                <span class="value">${eventRequest.events.name}</span>
              </div>
              <div class="detail">
                <span class="label">Location:</span>
                <span class="value">${eventRequest.location}</span>
              </div>
              <div class="detail">
                <span class="label">Event Date:</span>
                <span class="value">${new Date(eventRequest.event_date).toLocaleDateString()}</span>
              </div>
              <div class="detail">
                <span class="label">Event Time:</span>
                <span class="value">${new Date(eventRequest.event_date).toLocaleTimeString()}</span>
              </div>
              <div class="detail">
                <span class="label">Budget:</span>
                <span class="value">₹${eventRequest.budget.toLocaleString()}</span>
              </div>
              <div class="detail">
                <span class="label">Guest Count:</span>
                <span class="value">${eventRequest.guest_count}</span>
              </div>
              <div class="detail">
                <span class="label">Selected Package:</span>
                <span class="value">${eventRequest.selected_package?.toUpperCase()}</span>
              </div>
              ${eventRequest.additional_notes ? `
              <div class="detail">
                <span class="label">Additional Notes:</span>
                <span class="value">${eventRequest.additional_notes}</span>
              </div>
              ` : ''}
            </div>

            <div class="section">
              <h3>👤 Customer Information</h3>
              <div class="detail">
                <span class="label">Email Address:</span>
                <span class="value">${callSchedule.user_email}</span>
              </div>
              <div class="detail">
                <span class="label">Call Scheduled For:</span>
                <span class="value">${new Date(callSchedule.scheduled_time).toLocaleString()}</span>
              </div>
            </div>

            <div class="section">
              <h3>📞 Quick Actions</h3>
              <div class="highlight">
                <p><strong>Please contact the customer at the scheduled time.</strong></p>
                <p>Email: <a href="mailto:${callSchedule.user_email}">${callSchedule.user_email}</a></p>
                <p>Call: <a href="tel:${adminSettings.admin_whatsapp}">${adminSettings.admin_whatsapp}</a></p>
              </div>
            </div>

            <div class="section">
              <h3>📊 Request Summary</h3>
              <div class="detail">
                <span class="label">Request ID:</span>
                <span class="value">#${eventRequest.id}</span>
              </div>
              <div class="detail">
                <span class="label">Submitted:</span>
                <span class="value">${new Date(eventRequest.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from EVEA Event Planning System</p>
            <p>© 2024 EVEA. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create plain text version
    const adminEmailText = `
🎉 NEW EVENT PLANNING REQUEST - EVEA

EVENT DETAILS:
━━━━━━━━━━━━━━━
Event Type: ${eventRequest.events.name}
Location: ${eventRequest.location}
Event Date: ${new Date(eventRequest.event_date).toLocaleDateString()}
Event Time: ${new Date(eventRequest.event_date).toLocaleTimeString()}
Budget: ₹${eventRequest.budget.toLocaleString()}
Guest Count: ${eventRequest.guest_count}
Selected Package: ${eventRequest.selected_package?.toUpperCase()}
${eventRequest.additional_notes ? `Additional Notes: ${eventRequest.additional_notes}` : ''}

CUSTOMER INFORMATION:
━━━━━━━━━━━━━━━
Email Address: ${callSchedule.user_email}
Call Scheduled For: ${new Date(callSchedule.scheduled_time).toLocaleString()}

QUICK ACTIONS:
━━━━━━━━━━━━━━━
Please contact the customer at the scheduled time.
Email: ${callSchedule.user_email}
Call: ${adminSettings.admin_whatsapp}

REQUEST SUMMARY:
━━━━━━━━━━━━━━━
Request ID: #${eventRequest.id}
Submitted: ${new Date(eventRequest.created_at).toLocaleString()}

---
EVEA - Creating Unforgettable Moments
© 2024 EVEA. All rights reserved.
    `;

    // Use full URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Send email to admin
    const response = await fetch(`${baseUrl}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: adminSettings.admin_email,
        subject: `🎉 New Event Planning Request - ${eventRequest.events.name}`,
        html: adminEmailHtml,
        text: adminEmailText
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }

    console.log('✅ Email notification sent to admin successfully');
  } catch (error) {
    console.error('❌ Error in email notification:', error);
    console.error('📊 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}


