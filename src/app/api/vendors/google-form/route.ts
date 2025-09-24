import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['business_name', 'contact_person_name', 'phone', 'email', 'city', 'state'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare vendor data
    const vendorData = {
      business_name: body.business_name,
      business_type: body.business_type || 'Event Services',
      contact_person_name: body.contact_person_name,
      phone: body.phone,
      email: body.email,
      whatsapp_number: body.whatsapp_number || body.phone,
      city: body.city,
      state: body.state,
      address: body.address || '',
      description: body.description || '',
      portfolio_images: body.portfolio_images || [],
      services_offered: body.services_offered || [],
      price_range_min: body.price_range_min || null,
      price_range_max: body.price_range_max || null,
      instagram_handle: body.instagram_handle || '',
      website_url: body.website_url || '',
      average_rating: 0,
      total_events_completed: 0,
      is_verified: false, // New vendors start as unverified
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert into database
    const { data, error } = await supabase
      .from('vendors')
      .insert([vendorData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create vendor profile' },
        { status: 500 }
      );
    }

    // Log successful submission
    console.log('Vendor created from Google Form:', data);

    return NextResponse.json({
      success: true,
      message: 'Vendor profile created successfully',
      vendor: data
    });

  } catch (error) {
    console.error('Google Form submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check if the integration is working
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Google Form integration endpoint is active',
    timestamp: new Date().toISOString()
  });
}
