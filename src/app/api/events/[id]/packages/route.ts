import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;

    const { data: packages, error } = await supabase
      .from('event_packages')
      .select('*')
      .eq('event_id', eventId)
      .order('name');

    if (error) {
      console.error('Database error, using mock data:', error);
      // Return mock packages based on event type
      const mockPackages = getMockPackagesForEvent(parseInt(eventId));

      return NextResponse.json({
        success: true,
        data: mockPackages,
        message: 'Using mock data - database not accessible'
      });
    }

    return NextResponse.json({
      success: true,
      data: packages
    });

  } catch (error) {
    console.error('Error fetching event packages:', error);
    
    // Return mock packages as fallback
    const { id: eventId } = await params;
    const mockPackages = getMockPackagesForEvent(parseInt(eventId));

    return NextResponse.json({
      success: true,
      data: mockPackages,
      message: 'Using mock data - database error occurred'
    });
  }
}

function getMockPackagesForEvent(eventId: number) {
  const mockPackages = {
    1: [ // Wedding
      { id: 1, event_id: 1, name: 'Basic Wedding Package', description: 'Essential wedding services for intimate celebration', price: '₹5,00,000 - ₹8,00,000', features: ['Basic Decoration', 'Simple Lighting & Sound', 'Basic Entertainment', 'Venue Setup', 'Basic Catering', 'Simple Photography'] },
      { id: 2, event_id: 1, name: 'Standard Wedding Package', description: 'Complete wedding celebration with traditional services', price: '₹10,00,000 - ₹15,00,000', features: ['Premium Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering Service', 'Professional Photography', 'Luxury Transportation', 'Traditional Mandap Setup'] },
      { id: 3, event_id: 1, name: 'Premium Wedding Package', description: 'Luxury wedding experience with all traditional ceremonies', price: '₹18,00,000 - ₹25,00,000', features: ['Luxury Decoration', 'Advanced Lighting & Sound', 'Celebrity Entertainment', 'Luxury Venue', 'Premium Catering', 'Cinematic Photography & Videography', 'Luxury Transportation', 'Luxury Mandap Setup', 'Wedding Planner'] }
    ],
    2: [ // Birthday Party
      { id: 4, event_id: 2, name: 'Basic Birthday Package', description: 'Essential birthday celebration with core services', price: '₹25,000 - ₹40,000', features: ['Basic Decoration', 'Simple Lighting & Sound', 'Basic Entertainment', 'Venue Assistance', 'Birthday Cake & Basic Catering', 'Simple Photography'] },
      { id: 5, event_id: 2, name: 'Standard Birthday Package', description: 'Complete birthday celebration with premium services', price: '₹50,000 - ₹80,000', features: ['Theme Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering Service', 'Professional Photography', 'Event Coordination', 'Basic Transportation'] },
      { id: 6, event_id: 2, name: 'Premium Birthday Package', description: 'Luxury birthday celebration with all amenities', price: '₹1,00,000 - ₹1,50,000', features: ['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Celebrity Entertainment', 'Luxury Venue', 'Premium Catering', 'Professional Photography & Videography', 'Event Planner', 'Full Transportation'] }
    ],
    3: [ // Corporate Event
      { id: 7, event_id: 3, name: 'Basic Corporate Package', description: 'Essential corporate event services', price: '₹1,00,000 - ₹1,50,000', features: ['Basic Venue Setup', 'Simple Audio-Visual', 'Basic Catering', 'Basic Lighting & Sound', 'Basic Event Coordination'] },
      { id: 8, event_id: 3, name: 'Standard Corporate Package', description: 'Professional corporate event experience', price: '₹2,00,000 - ₹3,50,000', features: ['Premium Venue', 'Professional Audio-Visual', 'Full Catering', 'Professional Lighting & Sound', 'Event Coordination', 'Basic Branding', 'Guest Registration', 'Technical Support'] },
      { id: 9, event_id: 3, name: 'Premium Corporate Package', description: 'Executive corporate event with premium services', price: '₹5,00,000 - ₹10,00,000', features: ['Luxury Venue', 'Advanced Audio-Visual', 'Premium Catering', 'Advanced Lighting & Sound', 'Event Management', 'Full Branding & Marketing', 'Advanced Guest Management', 'Premium Technical Support'] }
    ],
    4: [ // Anniversary
      { id: 10, event_id: 4, name: 'Basic Anniversary Package', description: 'Simple anniversary celebration', price: '₹20,000 - ₹35,000', features: ['Basic Decoration', 'Simple Lighting & Sound', 'Basic Entertainment', 'Basic Venue', 'Simple Catering'] },
      { id: 11, event_id: 4, name: 'Standard Anniversary Package', description: 'Complete anniversary celebration', price: '₹40,000 - ₹70,000', features: ['Premium Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering', 'Professional Photography', 'Event Coordination', 'Basic Transportation'] },
      { id: 12, event_id: 4, name: 'Premium Anniversary Package', description: 'Luxury anniversary celebration', price: '₹80,000 - ₹1,20,000', features: ['Luxury Decoration', 'Advanced Lighting & Sound', 'Premium Entertainment', 'Luxury Venue', 'Premium Catering', 'Professional Photography & Videography', 'Event Planner', 'Full Transportation'] }
    ],
    5: [ // Festival/Concert
      { id: 13, event_id: 5, name: 'Basic Festival Package', description: 'Simple festival celebration setup', price: '₹2,00,000 - ₹3,00,000', features: ['Basic Decoration', 'Simple Lighting & Sound', 'Basic Entertainment', 'Basic Venue', 'Basic Catering', 'Basic Security'] },
      { id: 14, event_id: 5, name: 'Standard Festival Package', description: 'Complete festival celebration experience', price: '₹4,00,000 - ₹6,00,000', features: ['Theme Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering', 'Event Coordination', 'Security Services', 'Technical Support', 'Basic Transportation'] },
      { id: 15, event_id: 5, name: 'Premium Festival Package', description: 'Luxury festival celebration with all amenities', price: '₹8,00,000 - ₹12,00,000', features: ['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Celebrity Entertainment', 'Luxury Venue', 'Premium Catering', 'Event Planner', 'Premium Security', 'Advanced Technical Support', 'Full Transportation'] }
    ],
    6: [ // Custom Event
      { id: 16, event_id: 6, name: 'Basic Custom Package', description: 'Simple custom event setup', price: '₹50,000 - ₹80,000', features: ['Basic Decoration', 'Simple Lighting & Sound', 'Basic Entertainment', 'Venue Assistance', 'Basic Catering', 'Basic Photography'] },
      { id: 17, event_id: 6, name: 'Standard Custom Package', description: 'Complete custom event experience', price: '₹1,00,000 - ₹1,80,000', features: ['Theme Decoration', 'Professional Lighting & Sound', 'Entertainment', 'Premium Venue', 'Full Catering', 'Event Coordination', 'Professional Photography', 'Basic Transportation', 'Guest Management'] },
      { id: 18, event_id: 6, name: 'Premium Custom Package', description: 'Luxury custom event with all amenities', price: '₹2,00,000 - ₹3,00,000', features: ['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Premium Entertainment', 'Luxury Venue', 'Premium Catering', 'Event Planner', 'Professional Photography & Videography', 'Full Transportation', 'Advanced Guest Management'] }
    ]
  };

  return mockPackages[eventId as keyof typeof mockPackages] || [];
}
