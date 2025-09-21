import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
    const { data: eventRequests, error: eventError } = await supabase
      .from('event_planning_requests')
      .select(`
        *,
        events (
          id,
          name,
          description
        )
      `)
      .eq('id', event_request_id);

    if (eventError) {
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

    if (!eventRequests || eventRequests.length === 0) {
      console.error('❌ Event request not found:', event_request_id);
      return NextResponse.json({
        success: false,
        error: 'Event request not found'
      }, { status: 404 });
    }

    const eventRequest = eventRequests[0];

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

    // Send email notification to admin and vnair0795@gmail.com
    try {
      await sendEmailNotification(eventRequest, callSchedule, adminSettings);
      // Also send to vnair0795@gmail.com with cart details
      await sendCartDetailsEmail(eventRequest, callSchedule);
    } catch (emailError) {
      console.error('❌ Error sending email notification:', emailError);
      console.error('📊 Error details:', {
        message: emailError instanceof Error ? emailError.message : 'Unknown error',
        stack: emailError instanceof Error ? emailError.stack : undefined,
        timestamp: new Date().toISOString()
      });
      
      // Try simple email service as fallback
      try {
        await sendSimpleEmailNotification(eventRequest, callSchedule, adminSettings);
        await sendCartDetailsEmail(eventRequest, callSchedule);
      } catch (simpleEmailError) {
        console.error('❌ Simple email service also failed:', simpleEmailError);
      }
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

async function sendSimpleEmailNotification(eventRequest: any, callSchedule: any, adminSettings: any) {
  try {
    console.log('📧 [CALL-SCHEDULES] Sending simple email notification...');
    
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'eveateam2025@gmail.com',
        pass: process.env.EMAIL_PASS || ''
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Send simple email
    const mailOptions = {
      from: `"EVEA Event Planning" <${process.env.EMAIL_USER || 'eveateam2025@gmail.com'}>`,
      to: adminSettings.admin_email,
      subject: `🎉 New Event Planning Request - ${eventRequest.events.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: white; padding: 20px; border-radius: 10px;">
          <h2 style="color: #8B5CF6; text-align: center; margin-bottom: 30px;">🎉 New Event Planning Request</h2>
          
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px;">
            <h3 style="color: #EC4899; margin-top: 0;">Event Details</h3>
            <p><strong>Event Type:</strong> ${eventRequest.events.name}</p>
            <p><strong>Location:</strong> ${eventRequest.location}</p>
            <p><strong>Budget:</strong> ₹${eventRequest.budget.toLocaleString()}</p>
            <p><strong>Guest Count:</strong> ${eventRequest.guest_count}</p>
            <p><strong>User Email:</strong> ${callSchedule.user_email}</p>
            <p><strong>Call Scheduled:</strong> ${new Date(callSchedule.scheduled_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #3a3a3a;">
            <p style="color: #9CA3AF; font-size: 14px;">
              This is an automated notification from EVEA's event planning system.
            </p>
          </div>
        </div>
      `,
      text: `
New Event Planning Request - ${eventRequest.events.name}
Location: ${eventRequest.location}
Budget: ₹${eventRequest.budget.toLocaleString()}
Guest Count: ${eventRequest.guest_count}
User Email: ${callSchedule.user_email}
Call Scheduled: ${new Date(callSchedule.scheduled_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Simple email notification sent successfully:', {
      messageId: info.messageId,
      response: info.response
    });
  } catch (error) {
    console.error('❌ Simple email notification failed:', error);
    throw error;
  }
}

async function sendEmailNotification(eventRequest: any, callSchedule: any, adminSettings: any) {
  console.log('📧 [CALL-SCHEDULES] Starting email notification process...');
  console.log('📧 [CALL-SCHEDULES] Event Request:', {
    id: eventRequest.id,
    event_id: eventRequest.event_id,
    location: eventRequest.location,
    budget: eventRequest.budget,
    guest_count: eventRequest.guest_count,
    events: eventRequest.events,
    selected_services: eventRequest.selected_services
  });
  console.log('📧 [CALL-SCHEDULES] Call Schedule:', {
    id: callSchedule.id,
    scheduled_time: callSchedule.scheduled_time,
    user_email: callSchedule.user_email,
    status: callSchedule.status
  });
  console.log('📧 [CALL-SCHEDULES] Admin Settings:', {
    admin_email: adminSettings.admin_email,
    admin_whatsapp: adminSettings.admin_whatsapp
  });

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    console.log('📧 [CALL-SCHEDULES] Base URL for email API:', baseUrl);
    
    // Fetch selected services details
    let servicesHtml = '';
    let servicesText = '';
    
    if (eventRequest.selected_services && eventRequest.selected_services.length > 0) {
      console.log('📧 [CALL-SCHEDULES] Fetching selected services details...');
      
      const { data: services, error: servicesError } = await supabase
        .from('event_services')
        .select('service_name, category')
        .in('id', eventRequest.selected_services);
      
      if (!servicesError && services && services.length > 0) {
        console.log('📧 [CALL-SCHEDULES] Found services:', services);
        
        // Group services by category
        const groupedServices = services.reduce((acc: any, service) => {
          if (!acc[service.category]) {
            acc[service.category] = [];
          }
          acc[service.category].push(service.service_name);
          return acc;
        }, {});
        
        // Create HTML for services
        servicesHtml = `
          <h3>🎯 Selected Services:</h3>
          ${Object.entries(groupedServices).map(([category, serviceNames]) => `
            <div style="margin-bottom: 15px;">
              <h4 style="color: #8b5cf6; margin-bottom: 8px;">${category}</h4>
              <ul style="margin: 0; padding-left: 20px;">
                ${(serviceNames as string[]).map(name => `<li style="margin-bottom: 5px;">${name}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        `;
        
        // Create text for services
        servicesText = `
Selected Services:
${Object.entries(groupedServices).map(([category, serviceNames]) => `
${category}:
${(serviceNames as string[]).map(name => `  • ${name}`).join('\n')}
`).join('\n')}
        `;
      }
    }
    
    const emailData = {
      to: adminSettings.admin_email,
      subject: `🎉 New Event Planning Request - ${eventRequest.events.name}`,
      html: `
        <h1>🎉 New Event Planning Request</h1>
        <p><strong>Event Type:</strong> ${eventRequest.events.name}</p>
        <p><strong>Location:</strong> ${eventRequest.location}</p>
        <p><strong>Budget:</strong> ₹${eventRequest.budget.toLocaleString()}</p>
        <p><strong>Guest Count:</strong> ${eventRequest.guest_count}</p>
        <p><strong>Selected Package:</strong> ${eventRequest.selected_package || 'Not specified'}</p>
        <p><strong>User Email:</strong> ${callSchedule.user_email}</p>
        <p><strong>Call Scheduled:</strong> ${new Date(callSchedule.scheduled_time).toLocaleString()}</p>
        <p><strong>Event Request ID:</strong> ${eventRequest.id}</p>
        <p><strong>Call Schedule ID:</strong> ${callSchedule.id}</p>
        ${servicesHtml}
      `,
      text: `
New Event Planning Request - ${eventRequest.events.name}
Location: ${eventRequest.location}
Budget: ₹${eventRequest.budget.toLocaleString()}
Guest Count: ${eventRequest.guest_count}
Selected Package: ${eventRequest.selected_package || 'Not specified'}
User Email: ${callSchedule.user_email}
Call Scheduled: ${new Date(callSchedule.scheduled_time).toLocaleString()}
Event Request ID: ${eventRequest.id}
Call Schedule ID: ${callSchedule.id}
${servicesText}
      `
    };

    console.log('📧 [CALL-SCHEDULES] Email data prepared:', {
      to: emailData.to,
      subject: emailData.subject,
      hasHtml: !!emailData.html,
      hasText: !!emailData.text
    });

    console.log('📧 [CALL-SCHEDULES] Sending email using Nodemailer...');
    
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'eveateam2025@gmail.com',
        pass: process.env.EMAIL_PASS || ''
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Send email
    const mailOptions = {
      from: `"EVEA Event Planning" <${process.env.EMAIL_USER || 'eveateam2025@gmail.com'}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: white; padding: 20px; border-radius: 10px;">
          <h2 style="color: #8B5CF6; text-align: center; margin-bottom: 30px;">🎉 New Event Planning Request</h2>
          
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #EC4899; margin-top: 0;">Event Details</h3>
            <p><strong>Event Type:</strong> ${eventRequest.events.name}</p>
            <p><strong>Location:</strong> ${eventRequest.location}</p>
            <p><strong>Budget:</strong> ₹${eventRequest.budget.toLocaleString()}</p>
            <p><strong>Guest Count:</strong> ${eventRequest.guest_count}</p>
            <p><strong>Selected Package:</strong> ${eventRequest.selected_package || 'Not specified'}</p>
          </div>
          
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #EC4899; margin-top: 0;">Contact Information</h3>
            <p><strong>User Email:</strong> ${callSchedule.user_email}</p>
            <p><strong>Call Scheduled:</strong> ${new Date(callSchedule.scheduled_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <p><strong>Event Request ID:</strong> ${eventRequest.id}</p>
            <p><strong>Call Schedule ID:</strong> ${callSchedule.id}</p>
          </div>
          
          ${servicesHtml ? `
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #EC4899; margin-top: 0;">Selected Services</h3>
            ${servicesHtml}
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #3a3a3a;">
            <p style="color: #9CA3AF; font-size: 14px;">
              This is an automated notification from EVEA's event planning system.
            </p>
          </div>
        </div>
      `,
      text: emailData.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ [CALL-SCHEDULES] Email notification sent successfully:', {
      messageId: info.messageId,
      response: info.response
    });
  } catch (error) {
    console.error('❌ [CALL-SCHEDULES] Email notification failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

// Send cart details email to vnair0795@gmail.com
async function sendCartDetailsEmail(eventRequest: any, callSchedule: any) {
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Format selected services as cart items
    const cartItems = eventRequest.selected_services.map((service: string) => {
      const serviceMap: { [key: string]: string } = {
        'venue': 'Venue Booking',
        'coordination': 'Event Coordination',
        'catering': 'Catering Services',
        'photography': 'Photography & Videography',
        'decoration': 'Decoration & Styling',
        'music': 'Music & Entertainment',
        'transportation': 'Transportation',
        'invitations': 'Invitations & Stationery',
        'livestream': 'Live Streaming',
        'security': 'Security Services',
        'guest-mgmt': 'Guest Management',
        'branding': 'Custom Branding',
        'valet': 'Valet Parking'
      };
      return serviceMap[service] || service;
    });

    const cartItemsHtml = cartItems.map((item: string, index: number) => 
      `<li class="cart-item">${index + 1}. ${item}</li>`
    ).join('');

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'vnair0795@gmail.com',
      subject: `🎉 New Event Planning Request - Cart Details & Call Scheduled`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: white; padding: 20px; border-radius: 10px;">
          <h2 style="color: #8B5CF6; text-align: center; margin-bottom: 30px;">🎉 New Event Planning Request</h2>
          
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #EC4899; margin-top: 0;">Event Details</h3>
            <p><strong>Event Type:</strong> ${eventRequest.events.name}</p>
            <p><strong>Location:</strong> ${eventRequest.location}</p>
            <p><strong>Budget:</strong> ₹${eventRequest.budget.toLocaleString()}</p>
            <p><strong>Guest Count:</strong> ${eventRequest.guest_count}</p>
            <p><strong>User Email:</strong> ${callSchedule.user_email}</p>
            <p><strong>Call Scheduled:</strong> ${new Date(callSchedule.scheduled_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <p><strong>Request ID:</strong> ${eventRequest.id}</p>
          </div>

          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #EC4899; margin-top: 0;">Cart Items (Selected Services)</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${cartItemsHtml}
            </ul>
            <p style="margin-top: 15px; color: #9CA3AF; font-size: 14px;">
              <strong>Total Services:</strong> ${cartItems.length} services selected
            </p>
          </div>

          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px;">
            <h3 style="color: #EC4899; margin-top: 0;">Call Schedule Details</h3>
            <p><strong>Scheduled Time:</strong> ${new Date(callSchedule.scheduled_time).toLocaleString('en-IN', { 
              timeZone: 'Asia/Kolkata',
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}</p>
            <p><strong>Call Status:</strong> ${callSchedule.status}</p>
            <p><strong>User Contact:</strong> ${callSchedule.user_email}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #3a3a3a;">
            <p style="color: #9CA3AF; font-size: 14px;">
              This is an automated notification from EVEA's event planning system.
            </p>
          </div>
        </div>
      `,
      text: `
New Event Planning Request - Cart Details & Call Scheduled

Event Details:
- Event Type: ${eventRequest.events.name}
- Location: ${eventRequest.location}
- Budget: ₹${eventRequest.budget.toLocaleString()}
- Guest Count: ${eventRequest.guest_count}
- User Email: ${callSchedule.user_email}
- Call Scheduled: ${new Date(callSchedule.scheduled_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
- Request ID: ${eventRequest.id}

Cart Items (Selected Services):
${cartItems.map((item: string, index: number) => `${index + 1}. ${item}`).join('\n')}

Total Services: ${cartItems.length} services selected

Call Schedule Details:
- Scheduled Time: ${new Date(callSchedule.scheduled_time).toLocaleString('en-IN', { 
  timeZone: 'Asia/Kolkata',
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
})}
- Call Status: ${callSchedule.status}
- User Contact: ${callSchedule.user_email}
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ [CALL-SCHEDULES] Cart details email sent successfully to vnair0795@gmail.com:', {
      messageId: info.messageId,
      response: info.response
    });
  } catch (error) {
    console.error('❌ [CALL-SCHEDULES] Cart details email failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}


