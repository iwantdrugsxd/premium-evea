import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { uploadImage, uploadMultipleImages } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name') as string;
    const categories = JSON.parse(formData.get('categories') as string);
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const services_offered = JSON.parse(formData.get('services_offered') as string);
    const experience = formData.get('experience') as string;
    const events_count = parseInt(formData.get('events_count') as string) || 0;
    const service_areas = JSON.parse(formData.get('service_areas') as string);
    
    // Log received data for debugging
    console.log('Received form data:', {
      name,
      categories,
      description,
      location,
      email,
      phone,
      address,
      services_offered,
      experience,
      events_count,
      service_areas
    });
    
    // Get files
    const cover_image = formData.get('cover_image') as File;
    const portfolio_images = formData.getAll('portfolio_images') as File[];

    // Validate required fields
    if (!name || !categories.length || !description || !location || !email || !phone || !address) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Ensure experience has a value
    if (!experience || experience.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Experience field is required' },
        { status: 400 }
      );
    }

    // Check if vendor already exists
    const { data: existingVendor, error: checkError } = await supabase
      .from('vendors')
      .select('id')
      .eq('email', email)
      .single();

    if (existingVendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor with this email already exists' },
        { status: 409 }
      );
    }

    // Upload images to Cloudinary
    let cover_image_url = '';
    let portfolio_image_urls: string[] = [];

    try {
      // Upload cover image
      if (cover_image) {
        cover_image_url = await uploadImage(cover_image);
      }

      // Upload portfolio images
      if (portfolio_images.length > 0) {
        portfolio_image_urls = await uploadMultipleImages(portfolio_images);
      }
    } catch (uploadError) {
      console.error('Image upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload images' },
        { status: 500 }
      );
    }

    // Insert vendor data into database - using only existing columns
    const vendorData = {
      name,
      category: categories.join(', '), // Store as comma-separated string
      description,
      location,
      image: cover_image_url, // Use cover image as main image
      features: services_offered, // Store services as features
      rating: 0,
      price: 'Contact for pricing', // Default value since price is required
      price_label: 'Custom Quote', // Default value since price_label is required
      response_time: 'Within 24 hours', // Default value
      availability: 'Available', // Default value
      team_size: '1-5', // Default value
      experience: experience || 'Not specified', // Handle missing experience
      badge: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Log vendor data being inserted
    console.log('Inserting vendor data:', vendorData);

    // Try to insert with basic columns first
    const { data: vendor, error: insertError } = await supabase
      .from('vendors')
      .insert([vendorData])
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create vendor profile',
          details: insertError.message,
          code: insertError.code
        },
        { status: 500 }
      );
    }

    // Insert portfolio images
    if (portfolio_image_urls.length > 0) {
      const portfolioData = portfolio_image_urls.map((url, index) => ({
        vendor_id: vendor.id,
        title: `Portfolio Image ${index + 1}`,
        description: 'Vendor portfolio image',
        image_url: url,
        category: 'portfolio',
        created_at: new Date().toISOString()
      }));

      const { error: portfolioError } = await supabase
        .from('vendor_portfolio')
        .insert(portfolioData);

      if (portfolioError) {
        console.error('Portfolio insert error:', portfolioError);
        // Don't fail the entire request if portfolio insert fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Vendor profile created successfully',
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        status: 'pending' // For admin approval
      }
    });

  } catch (error) {
    console.error('Vendor creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');

    let query = supabase
      .from('vendors')
      .select(`
        *,
        vendor_portfolio (
          id,
          title,
          description,
          image_url,
          category
        ),
        vendor_reviews (
          id,
          user_name,
          rating,
          comment,
          created_at
        )
      `)
      .eq('status', 'approved'); // Only show approved vendors

    if (category) {
      query = query.ilike('category', `%${category}%`);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data: vendors, error } = await query.order('rating', { ascending: false });

    if (error) {
      console.error('Database query error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch vendors' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      vendors: vendors || []
    });

  } catch (error) {
    console.error('Vendor fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
