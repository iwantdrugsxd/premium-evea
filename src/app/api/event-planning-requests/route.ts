import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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

    // Validate required fields
    if (!eventType || !selectedServices || !userName || !userPhone || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
          <h1 style="margin: 0; font-size: 24px;">New Event Planning Request</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Request ID: #EVE-${data.requestId}</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #7c3aed; margin-top: 0;">Event Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Event Type:</td>
              <td style="padding: 8px 0; color: #666; text-transform: capitalize;">${data.eventType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Location:</td>
              <td style="padding: 8px 0; color: #666;">${data.eventLocation || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Event Date:</td>
              <td style="padding: 8px 0; color: #666;">${data.eventDate || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Guest Count:</td>
              <td style="padding: 8px 0; color: #666;">${data.guestCount || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Budget:</td>
              <td style="padding: 8px 0; color: #666;">₹${data.budget || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Package:</td>
              <td style="padding: 8px 0; color: #666;">${data.selectedPackage || 'Not selected'}</td>
            </tr>
          </table>
          
          <h3 style="color: #7c3aed; margin-top: 25px;">Selected Services</h3>
          <ul style="color: #666; padding-left: 20px;">
            ${data.selectedServices.map((service: string) => `<li>${service}</li>`).join('')}
          </ul>
          
          ${data.additionalNotes ? `
            <h3 style="color: #7c3aed; margin-top: 25px;">Additional Notes</h3>
            <p style="color: #666; background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #7c3aed;">${data.additionalNotes}</p>
          ` : ''}
          
          <h2 style="color: #7c3aed; margin-top: 30px;">Consultation Schedule</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Scheduled Date:</td>
              <td style="padding: 8px 0; color: #666;">${data.scheduledDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Scheduled Time:</td>
              <td style="padding: 8px 0; color: #666;">${data.scheduledTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Call Duration:</td>
              <td style="padding: 8px 0; color: #666;">${data.callDuration} minutes</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Flexibility:</td>
              <td style="padding: 8px 0; color: #666;">${data.flexibility}</td>
            </tr>
          </table>
          
          <h2 style="color: #7c3aed; margin-top: 30px;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Name:</td>
              <td style="padding: 8px 0; color: #666;">${data.userName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Phone:</td>
              <td style="padding: 8px 0; color: #666;">${data.userPhone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Email:</td>
              <td style="padding: 8px 0; color: #666;">${data.userEmail}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
          <p>This request was submitted through the EVEA event planning platform.</p>
          <p>Please contact the client at the scheduled time to discuss their requirements.</p>
        </div>
      </div>
    `;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'vnair0795@gmail.com',
        subject: `New Event Planning Request - ${data.eventType} - #EVE-${data.requestId}`,
        html: emailContent,
        text: `New event planning request received for ${data.eventType} event. Request ID: #EVE-${data.requestId}. Scheduled consultation: ${data.scheduledDate} at ${data.scheduledTime}. Contact: ${data.userName} (${data.userPhone}, ${data.userEmail})`
      })
    });

    if (!response.ok) {
      console.error('Failed to send admin notification email');
    }
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}
