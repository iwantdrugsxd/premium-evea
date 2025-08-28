import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { event_request_id, scheduled_time, user_whatsapp } = await request.json();

    // Get user from session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not authenticated' 
        },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!event_request_id || !scheduled_time || !user_whatsapp) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    // Verify event request belongs to user
    const { data: eventRequest, error: eventError } = await supabase
      .from('user_event_requests')
      .select('*')
      .eq('id', event_request_id)
      .eq('user_id', user.id)
      .single();

    if (eventError || !eventRequest) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Event request not found' 
        },
        { status: 404 }
      );
    }

    // Insert call schedule
    const { data: schedule, error } = await supabase
      .from('call_schedules')
      .insert({
        user_event_request_id: event_request_id,
        scheduled_time,
        user_whatsapp,
        admin_whatsapp: process.env.ADMIN_WHATSAPP
      })
      .select()
      .single();

    if (error) throw error;

    // Update event request with selected package if provided
    if (eventRequest.selected_package) {
      await supabase
        .from('user_event_requests')
        .update({ 
          selected_package: eventRequest.selected_package,
          status: 'confirmed'
        })
        .eq('id', event_request_id);
    }

    // Trigger WhatsApp notification
    try {
      await triggerWhatsAppNotification(schedule, eventRequest);
    } catch (whatsappError) {
      console.error('WhatsApp notification failed:', whatsappError);
      // Continue even if WhatsApp fails
    }

    return NextResponse.json({ 
      success: true, 
      schedule 
    });
  } catch (error) {
    console.error('Error scheduling call:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to schedule call' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventRequestId = searchParams.get('event_request_id');

    // Get user from session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not authenticated' 
        },
        { status: 401 }
      );
    }

    if (eventRequestId) {
      // Get call schedules for specific event request
      const { data, error } = await supabase
        .from('call_schedules')
        .select('*')
        .eq('user_event_request_id', eventRequestId)
        .order('scheduled_time');

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        schedules: data 
      });
    } else {
      // Get all call schedules for user
      const { data, error } = await supabase
        .from('call_schedules')
        .select(`
          *,
          user_event_requests(
            *,
            events(name, category)
          )
        `)
        .eq('user_event_requests.user_id', user.id)
        .order('scheduled_time');

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        schedules: data 
      });
    }
  } catch (error) {
    console.error('Error fetching call schedules:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch call schedules' 
      },
      { status: 500 }
    );
  }
}

async function triggerWhatsAppNotification(schedule: any, eventRequest: any) {
  try {
    // Get event details
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventRequest.event_id)
      .single();

    // Get user details
    const { data: user } = await supabase.auth.admin.getUserById(eventRequest.user_id);

    // Format message
    const message = `
🎉 *New Event Planning Request*

*Event Type:* ${event?.name || 'Unknown'}
*Location:* ${eventRequest.location}
*Date:* ${new Date(eventRequest.date_time).toLocaleDateString()}
*Time:* ${new Date(eventRequest.date_time).toLocaleTimeString()}
*Budget:* ₹${eventRequest.budget.toLocaleString()}
*Guests:* ${eventRequest.guest_count}
${eventRequest.selected_package ? `*Selected Package:* ${eventRequest.selected_package}` : ''}

*Customer Details:*
📧 Email: ${user?.user?.email || 'Not provided'}
📱 Phone: ${schedule.user_whatsapp}

*Call Scheduled:* ${new Date(schedule.scheduled_time).toLocaleString()}

${eventRequest.additional_notes ? `*Additional Notes:* ${eventRequest.additional_notes}` : ''}

Please contact the customer to discuss their event requirements.
    `;

    // Send WhatsApp message using Twilio
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: process.env.ADMIN_WHATSAPP,
        message: message
      })
    });

    if (!response.ok) {
      throw new Error('WhatsApp API call failed');
    }

    // Send email backup
    await sendEmailNotification(eventRequest, schedule, event, user);

    return { success: true };
  } catch (error) {
    console.error('WhatsApp notification failed:', error);
    throw error;
  }
}

async function sendEmailNotification(eventRequest: any, schedule: any, event: any, user: any) {
  try {
    const emailContent = `
      <h2>New Event Planning Request</h2>
      <p><strong>Event Type:</strong> ${event?.name || 'Unknown'}</p>
      <p><strong>Location:</strong> ${eventRequest.location}</p>
      <p><strong>Date:</strong> ${new Date(eventRequest.date_time).toLocaleDateString()}</p>
      <p><strong>Budget:</strong> ₹${eventRequest.budget.toLocaleString()}</p>
      <p><strong>Guests:</strong> ${eventRequest.guest_count}</p>
      <p><strong>Call Scheduled:</strong> ${new Date(schedule.scheduled_time).toLocaleString()}</p>
      <p><strong>Customer Email:</strong> ${user?.user?.email || 'Not provided'}</p>
      <p><strong>Customer Phone:</strong> ${schedule.user_whatsapp}</p>
      ${eventRequest.selected_package ? `<p><strong>Selected Package:</strong> ${eventRequest.selected_package}</p>` : ''}
      ${eventRequest.additional_notes ? `<p><strong>Additional Notes:</strong> ${eventRequest.additional_notes}</p>` : ''}
    `;

    // Send email using your preferred email service
    // For now, we'll just log it
    console.log('Email notification:', emailContent);
    
    // TODO: Implement actual email sending
    // await fetch('/api/email/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: process.env.ADMIN_EMAIL,
    //     subject: 'New Event Planning Request - EVEA',
    //     html: emailContent
    //   })
    // });

  } catch (error) {
    console.error('Email notification failed:', error);
  }
}
