import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 Event Planning Request Data:', JSON.stringify(body, null, 2));
    
    const {
      eventType,
      selectedServices,
      eventLocation,
      eventDate,
      guestCount,
      budget,
      additionalNotes,
      selectedPackage,
      scheduledDate,
      scheduledTime,
      callDuration,
      flexibility,
      userName,
      userPhone,
      userEmail
    } = body;

    // Validate required fields with detailed logging
    const missingFields = [];
    if (!eventType) missingFields.push('eventType');
    if (!selectedServices || selectedServices.length === 0) missingFields.push('selectedServices');
    if (!userName) missingFields.push('userName');
    if (!userPhone) missingFields.push('userPhone');
    if (!userEmail) missingFields.push('userEmail');

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missingFields: missingFields,
          receivedData: {
            eventType: !!eventType,
            selectedServices: selectedServices?.length || 0,
            userName: !!userName,
            userPhone: !!userPhone,
            userEmail: !!userEmail
          }
        },
        { status: 400 }
      );
    }

    // First, get or create the event type
    let eventId;
    const { data: existingEvent, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('name', eventType)
      .single();

    if (eventError && eventError.code !== 'PGRST116') {
      throw eventError;
    }

    if (existingEvent) {
      eventId = existingEvent.id;
    } else {
      // Create new event type if it doesn't exist
      const { data: newEvent, error: createEventError } = await supabase
        .from('events')
        .insert({
          name: eventType,
          description: `Professional ${eventType} planning services`,
          icon: getEventIcon(eventType),
          features: getEventFeatures(eventType),
          avg_budget: budget || '₹50,000 - ₹5,00,000',
          duration: '1-3 days',
          team_size: '5-15 members',
          service_categories: selectedServices
        })
        .select('id')
        .single();

      if (createEventError) throw createEventError;
      eventId = newEvent.id;
    }

    // Get or create user
    let userId;
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      throw userError;
    }

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          full_name: userName,
          email: userEmail,
          mobile_number: userPhone,
          location: eventLocation || 'Not specified'
        })
        .select('id')
        .single();

      if (createUserError) throw createUserError;
      userId = newUser.id;
    }

    // Create event planning request
    const { data: planningRequest, error: planningError } = await supabase
      .from('event_planning_requests')
      .insert({
        user_id: userId,
        event_id: eventId,
        location: eventLocation || 'Not specified',
        event_date: eventDate ? new Date(eventDate) : new Date(),
        budget: parseFloat(budget?.replace(/[₹,]/g, '') || '0'),
        guest_count: parseInt(guestCount || '0'),
        selected_package: selectedPackage,
        additional_notes: additionalNotes || '',
        selected_services: selectedServices,
        status: 'pending'
      })
      .select('id')
      .single();

    if (planningError) throw planningError;

    // Create consultation call
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`);
    const { data: consultationCall, error: consultationError } = await supabase
      .from('consultation_calls')
      .insert({
        event_planning_request_id: planningRequest.id,
        scheduled_time: scheduledDateTime,
        user_whatsapp: userPhone,
        user_email: userEmail,
        status: 'scheduled',
        notes: `Call duration: ${callDuration} minutes, Flexibility: ${flexibility}`
      })
      .select('id')
      .single();

    if (consultationError) throw consultationError;

    // Send email notification to admin
    await sendAdminNotification({
      requestId: planningRequest.id,
      eventType,
      selectedServices,
      eventLocation,
      eventDate,
      guestCount,
      budget,
      additionalNotes,
      selectedPackage,
      scheduledDate,
      scheduledTime,
      callDuration,
      flexibility,
      userName,
      userPhone,
      userEmail
    });

    return NextResponse.json({
      success: true,
      requestId: planningRequest.id,
      consultationId: consultationCall.id,
      message: 'Event planning request submitted successfully'
    });

  } catch (error) {
    console.error('Error creating event planning request:', error);
    return NextResponse.json(
      { error: 'Failed to create event planning request' },
      { status: 500 }
    );
  }
}

function getEventIcon(eventType: string): string {
  const icons: { [key: string]: string } = {
    'wedding': '💒',
    'corporate': '🏢',
    'birthday': '🎂',
    'anniversary': '💕',
    'cultural': '🎭',
    'other': '🎉'
  };
  return icons[eventType] || '🎉';
}

function getEventFeatures(eventType: string): string[] {
  const features: { [key: string]: string[] } = {
    'wedding': ['Venue Selection', 'Catering', 'Photography', 'Decoration', 'Music'],
    'corporate': ['Venue Booking', 'Catering', 'AV Equipment', 'Networking', 'Branding'],
    'birthday': ['Venue Setup', 'Catering', 'Entertainment', 'Decoration', 'Photography'],
    'anniversary': ['Romantic Setup', 'Catering', 'Photography', 'Music', 'Decoration'],
    'cultural': ['Traditional Setup', 'Cultural Performances', 'Catering', 'Decoration', 'Photography'],
    'other': ['Custom Planning', 'Venue Selection', 'Catering', 'Entertainment', 'Coordination']
  };
  return features[eventType] || ['Custom Planning', 'Full Coordination'];
}

async function sendAdminNotification(data: any) {
  try {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #7c3aed, #db2777, #2563eb); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px;">🎉 New Event Planning Request</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Request ID: #EVE-${data.requestId}</p>
          <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">From: ${data.userName}</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #7c3aed;">
            <h2 style="color: #7c3aed; margin: 0; font-size: 18px;">👋 Hello Admin!</h2>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">${data.userName} has submitted a new event planning request. Here are all the details:</p>
          </div>
          
          <h2 style="color: #7c3aed; margin-top: 0; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">📅 Event Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; font-weight: bold; color: #333; border: 1px solid #dee2e6;">Event Type:</td>
              <td style="padding: 12px; color: #666; border: 1px solid #dee2e6; text-transform: capitalize;">${data.eventType}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; color: #333; border: 1px solid #dee2e6;">Location:</td>
              <td style="padding: 12px; color: #666; border: 1px solid #dee2e6;">${data.eventLocation || 'Not specified'}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; font-weight: bold; color: #333; border: 1px solid #dee2e6;">Event Date:</td>
              <td style="padding: 12px; color: #666; border: 1px solid #dee2e6;">${data.eventDate || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; color: #333; border: 1px solid #dee2e6;">Guest Count:</td>
              <td style="padding: 12px; color: #666; border: 1px solid #dee2e6;">${data.guestCount || 'Not specified'}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; font-weight: bold; color: #333; border: 1px solid #dee2e6;">Budget:</td>
              <td style="padding: 12px; color: #666; border: 1px solid #dee2e6; font-weight: bold; color: #28a745;">₹${data.budget || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; color: #333; border: 1px solid #dee2e6;">Package:</td>
              <td style="padding: 12px; color: #666; border: 1px solid #dee2e6;">${data.selectedPackage || 'Not selected'}</td>
            </tr>
          </table>
          
          <h3 style="color: #7c3aed; margin-top: 25px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">🎯 Selected Services</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <ul style="color: #666; padding-left: 20px; margin: 0;">
              ${data.selectedServices.map((service: string) => `<li style="margin-bottom: 5px;">✅ ${service}</li>`).join('')}
            </ul>
          </div>
          
          ${data.additionalNotes ? `
            <h3 style="color: #7c3aed; margin-top: 25px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">📝 Additional Notes</h3>
            <div style="color: #666; background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
              <p style="margin: 0; font-style: italic;">"${data.additionalNotes}"</p>
            </div>
          ` : ''}
          
          <h2 style="color: #7c3aed; margin-top: 30px; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">📞 Consultation Schedule</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; font-weight: bold; color: #333; border: 1px solid #dee2e6;">Scheduled Date:</td>
              <td style="padding: 12px; color: #666; border: 1px solid #dee2e6; font-weight: bold;">${data.scheduledDate}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; color: #333; border: 1px solid #dee2e6;">Scheduled Time:</td>
              <td style="padding: 12px; color: #666; border: 1px solid #dee2e6; font-weight: bold;">${data.scheduledTime}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; font-weight: bold; color: #333; border: 1px solid #dee2e6;">Call Duration:</td>
              <td style="padding: 12px; color: #666; border: 1px solid #dee2e6;">${data.callDuration} minutes</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; color: #333; border: 1px solid #dee2e6;">Flexibility:</td>
              <td style="padding: 12px; color: #666; border: 1px solid #dee2e6;">${data.flexibility}</td>
            </tr>
          </table>
          
          <h2 style="color: #7c3aed; margin-top: 30px; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">👤 Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; font-weight: bold; color: #333; border: 1px solid #dee2e6;">Name:</td>
              <td style="padding: 12px; color: #666; border: 1px solid #dee2e6; font-weight: bold;">${data.userName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; color: #333; border: 1px solid #dee2e6;">Phone:</td>
              <td style="padding: 12px; color: #666; border: 1px solid #dee2e6;"><a href="tel:${data.userPhone}" style="color: #007bff; text-decoration: none;">${data.userPhone}</a></td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; font-weight: bold; color: #333; border: 1px solid #dee2e6;">Email:</td>
              <td style="padding: 12px; color: #666; border: 1px solid #dee2e6;"><a href="mailto:${data.userEmail}" style="color: #007bff; text-decoration: none;">${data.userEmail}</a></td>
            </tr>
          </table>
          
          <div style="background: linear-gradient(135deg, #d4edda, #c3e6cb); padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin-top: 20px;">
            <h3 style="color: #155724; margin: 0 0 10px 0;">🎯 Action Required</h3>
            <p style="color: #155724; margin: 0; font-size: 14px;">
              Please contact <strong>${data.userName}</strong> at the scheduled time (${data.scheduledDate} at ${data.scheduledTime}) to discuss their ${data.eventType} event requirements.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
          <p>This request was submitted through the EVEA event planning platform.</p>
          <p style="margin-top: 10px; padding: 10px; background: #e9ecef; border-radius: 5px;">
            <strong>Next Steps:</strong> Call ${data.userName} at the scheduled time, discuss requirements, and provide a personalized quote within 24 hours.
          </p>
        </div>
      </div>
    `;

    // Send email directly using nodemailer
    try {
      console.log('📧 Sending admin notification email...');
      
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

      // Email options
      const mailOptions = {
        from: `"EVEA Event Planning" <${process.env.EMAIL_USER || 'eveateam2025@gmail.com'}>`,
        to: 'vnair0795@gmail.com',
        subject: `New Event Planning Request - ${data.eventType} - #EVE-${data.requestId}`,
        html: emailContent,
        text: `New event planning request received for ${data.eventType} event. Request ID: #EVE-${data.requestId}. Scheduled consultation: ${data.scheduledDate} at ${data.scheduledTime}. Contact: ${data.userName} (${data.userPhone}, ${data.userEmail})`,
        priority: 'high'
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Admin notification email sent successfully:', {
        messageId: info.messageId,
        to: 'vnair0795@gmail.com',
        subject: mailOptions.subject
      });

    } catch (emailError) {
      console.error('❌ Error sending admin notification email:', emailError);
    }
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}
