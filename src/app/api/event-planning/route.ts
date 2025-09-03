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
      eventId,
      packageId,
      location,
      eventDate,
      budget,
      guestCount,
      selectedPackage,
      additionalNotes,
      selectedServices,
      userEmail,
      userName,
      userPhone
    } = body;

    // Validate required fields
    if (!eventId || !packageId || !location || !eventDate || !budget || !guestCount || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // First, create or get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();

    let userId: number;

    if (userError || !user) {
      // Create new user if doesn't exist
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          email: userEmail,
          full_name: userName || 'Event Planner',
          mobile_number: userPhone || 'N/A',
          location: location
        })
        .select('id')
        .single();

      if (createUserError) {
        console.error('Error creating user:', createUserError);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }
      userId = newUser.id;
    } else {
      userId = user.id;
    }

    // Create event planning request
    const { data: eventRequest, error: eventRequestError } = await supabase
      .from('event_planning_requests')
      .insert({
        user_id: userId,
        event_id: eventId,
        package_id: packageId,
        location,
        event_date: eventDate,
        budget: parseFloat(budget),
        guest_count: parseInt(guestCount),
        selected_package: selectedPackage,
        additional_notes: additionalNotes,
        selected_services: selectedServices || [],
        status: 'pending'
      })
      .select('*')
      .single();

    if (eventRequestError) {
      console.error('Error creating event planning request:', eventRequestError);
      return NextResponse.json(
        { error: 'Failed to create event planning request' },
        { status: 500 }
      );
    }

    // Get event and package details for email
    const { data: event } = await supabase
      .from('events')
      .select('name, description')
      .eq('id', eventId)
      .single();

    const { data: packageData } = await supabase
      .from('event_packages')
      .select('name, description, price')
      .eq('id', packageId)
      .single();

    // Send email to admin
    const emailData = {
      to: 'vnair0795@gmail.com',
      subject: 'New Event Planning Request',
      html: `
        <h2>New Event Planning Request</h2>
        <h3>Event Details:</h3>
        <p><strong>Event Type:</strong> ${event?.name}</p>
        <p><strong>Package:</strong> ${packageData?.name} - ${packageData?.price}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
        <p><strong>Budget:</strong> ₹${budget}</p>
        <p><strong>Guest Count:</strong> ${guestCount}</p>
        <p><strong>Additional Notes:</strong> ${additionalNotes || 'None'}</p>
        
        <h3>User Details:</h3>
        <p><strong>Name:</strong> ${userName || 'Not provided'}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Phone:</strong> ${userPhone || 'Not provided'}</p>
        
        <h3>Selected Services:</h3>
        <ul>
          ${selectedServices?.map((service: string) => `<li>${service}</li>`).join('') || '<li>None selected</li>'}
        </ul>
        
        <p><strong>Request ID:</strong> ${eventRequest.id}</p>
        <p><strong>Status:</strong> ${eventRequest.status}</p>
        
        <p>Please review this request and schedule a consultation call with the user.</p>
      `
    };

    // Send email using the existing email API
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!emailResponse.ok) {
      console.error('Failed to send email');
    }

    return NextResponse.json({
      success: true,
      message: 'Event planning request created successfully',
      requestId: eventRequest.id,
      emailSent: emailResponse.ok
    });

  } catch (error) {
    console.error('Error in event planning API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: requests, error } = await supabase
      .from('event_planning_requests')
      .select(`
        *,
        events(name, description),
        event_packages(name, description, price),
        users(full_name, email, mobile_number)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching event planning requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}
