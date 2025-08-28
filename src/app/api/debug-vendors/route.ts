import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get table structure
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'vendors' });

    if (columnsError) {
      console.error('Error getting columns:', columnsError);
    }

    // Get sample data
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('*')
      .limit(3);

    if (vendorsError) {
      console.error('Error getting vendors:', vendorsError);
    }

    // Try to get table info using raw SQL
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'vendors' });

    return NextResponse.json({
      success: true,
      columns: columns || 'Could not fetch columns',
      vendors: vendors || 'Could not fetch vendors',
      tableInfo: tableInfo || 'Could not fetch table info',
      errors: {
        columns: columnsError?.message,
        vendors: vendorsError?.message,
        table: tableError?.message
      }
    });

  } catch (error) {
    console.error('Debug vendors error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
