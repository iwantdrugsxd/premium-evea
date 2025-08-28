import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Try to get vendors with specific columns
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('id, name, category, rating, events_count, price, price_label, response_time, badge, image, description, features, location, experience, team_size, availability, created_at, updated_at')
      .limit(2);

    // Try to get just the count
    const { count, error: countError } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      vendors: vendors || [],
      vendorCount: count || 0,
      errors: {
        vendors: vendorsError?.message,
        count: countError?.message
      },
      message: 'Check the errors field to see what columns are missing'
    });

  } catch (error) {
    console.error('Debug vendors simple error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
