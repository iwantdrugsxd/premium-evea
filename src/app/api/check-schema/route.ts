import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Checking users table schema...')
    
    // Try to get the table structure by attempting different column names
    const testColumns = [
      'id', 'full_name', 'fullName', 'email', 'mobile_number', 'mobileNumber', 
      'location', 'password', 'created_at', 'updated_at'
    ]
    
    const results = {}
    
    for (const column of testColumns) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select(column)
          .limit(1)
        
        results[column] = {
          exists: !error,
          error: error ? error.message : null
        }
      } catch (e) {
        results[column] = {
          exists: false,
          error: e.message
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      schema: results
    })
    
  } catch (error) {
    console.error('Schema check error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check schema'
    })
  }
}
