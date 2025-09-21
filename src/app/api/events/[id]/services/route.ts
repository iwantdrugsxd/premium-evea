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

    const { data: services, error } = await supabase
      .from('event_services')
      .select('*')
      .eq('event_id', eventId)
      .order('category', { ascending: true })
      .order('is_required', { ascending: false })
      .order('is_popular', { ascending: false });

    if (error) {
      console.error('Database error, using mock data:', error);
      // Return mock services based on event type
      const mockServices = getMockServicesForEvent(parseInt(eventId));
      
      // Group services by category
      const groupedServices = mockServices.reduce((acc: any, service: any) => {
        const category = service.category || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(service);
        return acc;
      }, {});

      return NextResponse.json({
        success: true,
        data: {
          services: mockServices,
          groupedServices: groupedServices
        },
        message: 'Using mock data - database not accessible'
      });
    }

    // Group services by category
    const groupedServices = services.reduce((acc: any, service: any) => {
      const category = service.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        services: services,
        groupedServices: groupedServices
      }
    });

  } catch (error) {
    console.error('Error fetching event services:', error);
    
    // Return mock services as fallback
    const { id: eventId } = await params;
    const mockServices = getMockServicesForEvent(parseInt(eventId));
    
    // Group services by category
    const groupedServices = mockServices.reduce((acc: any, service: any) => {
      const category = service.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        services: mockServices,
        groupedServices: groupedServices
      },
      message: 'Using mock data - database error occurred'
    });
  }
}

function getMockServicesForEvent(eventId: number) {
  const mockServices = {
    1: [ // Wedding
      { id: 1, event_id: 1, name: 'Wedding Photography', description: 'Professional photography covering ceremony and reception', category: 'Photography', is_required: true, is_popular: true },
      { id: 2, event_id: 1, name: 'Wedding Videography', description: 'Cinematic wedding video with highlights', category: 'Videography', is_required: false, is_popular: true },
      { id: 3, event_id: 1, name: 'Wedding Catering', description: 'Multi-course meal for all guests', category: 'Catering', is_required: true, is_popular: true },
      { id: 4, event_id: 1, name: 'Wedding Decoration', description: 'Complete venue decoration with flowers', category: 'Decoration', is_required: true, is_popular: true },
      { id: 5, event_id: 1, name: 'Wedding Music', description: 'Live band or DJ for ceremony and reception', category: 'Entertainment', is_required: false, is_popular: true },
      { id: 6, event_id: 1, name: 'Wedding Transportation', description: 'Luxury cars for bride, groom, and family', category: 'Transportation', is_required: false, is_popular: false },
      { id: 7, event_id: 1, name: 'Wedding Makeup', description: 'Professional makeup for bride and family', category: 'Beauty', is_required: false, is_popular: true }
    ],
    2: [ // Birthday Party
      { id: 8, event_id: 2, name: 'Birthday Photography', description: 'Fun and candid photography', category: 'Photography', is_required: false, is_popular: true },
      { id: 9, event_id: 2, name: 'Birthday Catering', description: 'Delicious food and beverages', category: 'Catering', is_required: true, is_popular: true },
      { id: 10, event_id: 2, name: 'Birthday Decoration', description: 'Colorful balloons and theme decoration', category: 'Decoration', is_required: true, is_popular: true },
      { id: 11, event_id: 2, name: 'Birthday Cake', description: 'Custom designed birthday cake', category: 'Food', is_required: true, is_popular: true },
      { id: 12, event_id: 2, name: 'Birthday Entertainment', description: 'DJ, games, and activities', category: 'Entertainment', is_required: false, is_popular: true }
    ],
    3: [ // Corporate Event
      { id: 13, event_id: 3, name: 'Corporate Photography', description: 'Professional event photography', category: 'Photography', is_required: true, is_popular: true },
      { id: 14, event_id: 3, name: 'Corporate Catering', description: 'Business lunch or dinner service', category: 'Catering', is_required: true, is_popular: true },
      { id: 15, event_id: 3, name: 'Audio Visual Setup', description: 'Sound system, projector, and lighting', category: 'Technology', is_required: true, is_popular: true },
      { id: 16, event_id: 3, name: 'Event Management', description: 'Complete event coordination', category: 'Management', is_required: true, is_popular: true }
    ],
    4: [ // Anniversary
      { id: 17, event_id: 4, name: 'Anniversary Photography', description: 'Romantic couple photography', category: 'Photography', is_required: true, is_popular: true },
      { id: 18, event_id: 4, name: 'Anniversary Catering', description: 'Elegant dining experience', category: 'Catering', is_required: true, is_popular: true },
      { id: 19, event_id: 4, name: 'Anniversary Decoration', description: 'Romantic and elegant setup', category: 'Decoration', is_required: true, is_popular: true },
      { id: 20, event_id: 4, name: 'Anniversary Music', description: 'Live romantic music', category: 'Entertainment', is_required: false, is_popular: true }
    ],
    5: [ // Festival/Concert
      { id: 21, event_id: 5, name: 'Stage Setup', description: 'Professional stage construction and setup', category: 'Technology', is_required: true, is_popular: true },
      { id: 22, event_id: 5, name: 'Sound System', description: 'High-quality audio equipment', category: 'Technology', is_required: true, is_popular: true },
      { id: 23, event_id: 5, name: 'Lighting', description: 'Professional lighting setup', category: 'Technology', is_required: true, is_popular: true },
      { id: 24, event_id: 5, name: 'Security', description: 'Event security and crowd management', category: 'Management', is_required: true, is_popular: true }
    ],
    6: [ // Custom Event
      { id: 25, event_id: 6, name: 'Custom Photography', description: 'Tailored photography for your event', category: 'Photography', is_required: false, is_popular: true },
      { id: 26, event_id: 6, name: 'Custom Catering', description: 'Personalized food and beverage service', category: 'Catering', is_required: true, is_popular: true },
      { id: 27, event_id: 6, name: 'Custom Decoration', description: 'Unique decoration tailored to your theme', category: 'Decoration', is_required: true, is_popular: true },
      { id: 28, event_id: 6, name: 'Event Planning', description: 'Complete event planning and coordination', category: 'Management', is_required: true, is_popular: true }
    ]
  };

  return mockServices[eventId as keyof typeof mockServices] || [];
}
