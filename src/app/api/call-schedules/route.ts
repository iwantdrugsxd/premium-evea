import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_request_id, scheduled_time, user_whatsapp } = body;

    // Validate required fields
    if (!event_request_id || !scheduled_time || !user_whatsapp) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: event_request_id, scheduled_time, user_whatsapp'
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

    // Get admin settings
    const { data: adminSettings, error: adminError } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (adminError || !adminSettings) {
      console.error('❌ Error fetching admin settings:', adminError);
      console.error('📊 Error details:', {
        message: adminError?.message,
        code: adminError?.code,
        details: adminError?.details,
        hint: adminError?.hint,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({
        success: false,
        error: 'Admin settings not found'
      }, { status: 500 });
    }

    // Create call schedule
    const { data: callSchedule, error: scheduleError } = await supabase
      .from('consultation_calls')
      .insert({
        event_planning_request_id: event_request_id,
        scheduled_time,
        admin_whatsapp: adminSettings.admin_whatsapp,
        user_whatsapp,
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
          user_whatsapp,
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

    // Trigger WhatsApp notification
    try {
      await triggerWhatsAppNotification(callSchedule, eventRequest, adminSettings);
    } catch (whatsappError) {
      console.error('❌ Error sending WhatsApp notification:', whatsappError);
      console.error('📊 Error details:', {
        message: whatsappError instanceof Error ? whatsappError.message : 'Unknown error',
        stack: whatsappError instanceof Error ? whatsappError.stack : undefined,
        timestamp: new Date().toISOString()
      });
    }

    // Send email notification
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
      user_whatsapp: callSchedule.user_whatsapp,
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

async function triggerWhatsAppNotification(callSchedule: any, eventRequest: any, adminSettings: any) {
  try {
    // Send WhatsApp message to admin
    const adminMessage = `🎉 New Event Planning Request!

Event: ${eventRequest.events.name}
Location: ${eventRequest.location}
Date: ${new Date(eventRequest.event_date).toLocaleDateString()}
Time: ${new Date(eventRequest.event_date).toLocaleTimeString()}
Budget: ₹${eventRequest.budget.toLocaleString()}
Guests: ${eventRequest.guest_count}
Package: ${eventRequest.selected_package}

Call Scheduled: ${new Date(callSchedule.scheduled_time).toLocaleString()}
User WhatsApp: ${callSchedule.user_whatsapp}

Please contact the user to discuss their event requirements.`;

    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: adminSettings.admin_whatsapp,
        message: adminMessage
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message');
    }

    console.log('WhatsApp notification sent successfully');
  } catch (error) {
    console.error('❌ Error in WhatsApp notification:', error);
    console.error('📊 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

async function sendEmailNotification(eventRequest: any, callSchedule: any, adminSettings: any) {
  try {
    // This would integrate with your email service (SendGrid, AWS SES, etc.)
    const emailData = {
      to: adminSettings.admin_email,
      subject: 'New Event Planning Request - EVEA',
      html: `
        <h2>🎉 New Event Planning Request</h2>
                 <p><strong>Event:</strong> ${eventRequest.events.name}</p>
         <p><strong>Location:</strong> ${eventRequest.location}</p>
         <p><strong>Date:</strong> ${new Date(eventRequest.event_date).toLocaleDateString()}</p>
         <p><strong>Time:</strong> ${new Date(eventRequest.event_date).toLocaleTimeString()}</p>
        <p><strong>Budget:</strong> ₹${eventRequest.budget.toLocaleString()}</p>
        <p><strong>Guests:</strong> ${eventRequest.guest_count}</p>
        <p><strong>Package:</strong> ${eventRequest.selected_package}</p>
        <p><strong>Call Scheduled:</strong> ${new Date(callSchedule.scheduled_time).toLocaleString()}</p>
        <p><strong>User WhatsApp:</strong> ${callSchedule.user_whatsapp}</p>
        <p><strong>Additional Notes:</strong> ${eventRequest.additional_notes || 'None'}</p>
      `
    };

    // For now, just log the email data
    console.log('Email notification data:', emailData);
    
    // TODO: Integrate with actual email service
    // const response = await fetch('/api/email/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(emailData)
    // });

    console.log('Email notification logged successfully');
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
