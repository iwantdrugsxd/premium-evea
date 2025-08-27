import { NextRequest, NextResponse } from 'next/server';

// Mock events database (replace with Supabase)
const events = [
  {
    id: 1,
    name: 'Wedding',
    description: 'Create your dream wedding with our comprehensive planning and execution.',
    icon: 'heart',
    features: ['Full Planning', '500+ Vendors', 'Premium'],
    avgBudget: '₹15L - ₹50L',
    duration: '6-12 months',
    teamSize: '10-15 people',
    services: [
      {
        id: 1,
        name: 'Catering',
        description: 'Premium catering services with celebrity chefs',
        price: '₹800',
        priceLabel: 'Per Plate',
        category: 'Catering'
      },
      {
        id: 2,
        name: 'Photography & Videography',
        description: 'Professional photography and videography services',
        price: '₹1L',
        priceLabel: 'Per Day',
        category: 'Photography'
      },
      {
        id: 3,
        name: 'Decoration',
        description: 'Transform any space into a magical setting',
        price: '₹50K',
        priceLabel: 'Starting',
        category: 'Decoration'
      },
      {
        id: 4,
        name: 'Entertainment',
        description: 'DJ and live music performances',
        price: '₹30K',
        priceLabel: 'Per Event',
        category: 'Entertainment'
      },
      {
        id: 5,
        name: 'Venue',
        description: 'Exclusive luxury venues',
        price: '₹2L',
        priceLabel: 'Per Day',
        category: 'Venues'
      },
      {
        id: 6,
        name: 'Floral Design',
        description: 'Breathtaking floral arrangements',
        price: '₹25K',
        priceLabel: 'Starting',
        category: 'Florists'
      }
    ],
    packages: [
      {
        id: 1,
        name: 'Basic',
        description: 'Essential services for a beautiful wedding',
        price: '₹15L',
        features: [
          'Basic catering (100 guests)',
          'Standard photography (8 hours)',
          'Basic decoration',
          'DJ entertainment',
          'Venue booking assistance',
          'Event coordination'
        ],
        services: [1, 2, 3, 4, 5]
      },
      {
        id: 2,
        name: 'Professional',
        description: 'Premium services for an unforgettable wedding',
        price: '₹25L',
        features: [
          'Premium catering (200 guests)',
          'Professional photography & videography (12 hours)',
          'Premium decoration with themes',
          'Live band + DJ',
          'Luxury venue booking',
          'Full event coordination',
          'Wedding planner'
        ],
        services: [1, 2, 3, 4, 5, 6]
      },
      {
        id: 3,
        name: 'Premium',
        description: 'Luxury services for the perfect wedding',
        price: '₹40L',
        features: [
          'Luxury catering (300+ guests)',
          'Cinematic photography & videography (full day)',
          'Luxury decoration with custom themes',
          'Celebrity entertainment',
          'Exclusive venue booking',
          'Dedicated wedding planner',
          'Instagram story creation',
          'Post-wedding services'
        ],
        services: [1, 2, 3, 4, 5, 6]
      }
    ]
  },
  {
    id: 2,
    name: 'Corporate Event',
    description: 'Professional events that leave lasting impressions on clients and employees.',
    icon: 'building',
    features: ['Tech Setup', 'Streaming', 'Catering'],
    avgBudget: '₹5L - ₹25L',
    duration: '2-6 months',
    teamSize: '8-12 people',
    services: [
      {
        id: 7,
        name: 'Corporate Catering',
        description: 'Professional catering for corporate events',
        price: '₹500',
        priceLabel: 'Per Plate',
        category: 'Catering'
      },
      {
        id: 8,
        name: 'Tech Setup',
        description: 'Audio-visual equipment and technical support',
        price: '₹50K',
        priceLabel: 'Per Day',
        category: 'Technology'
      },
      {
        id: 9,
        name: 'Live Streaming',
        description: 'Professional live streaming services',
        price: '₹30K',
        priceLabel: 'Per Event',
        category: 'Technology'
      }
    ],
    packages: [
      {
        id: 4,
        name: 'Basic Corporate',
        description: 'Essential corporate event services',
        price: '₹5L',
        features: [
          'Basic catering (50 guests)',
          'Standard tech setup',
          'Event coordination'
        ],
        services: [7, 8]
      },
      {
        id: 5,
        name: 'Professional Corporate',
        description: 'Premium corporate event services',
        price: '₹15L',
        features: [
          'Premium catering (100 guests)',
          'Advanced tech setup',
          'Live streaming',
          'Professional coordination'
        ],
        services: [7, 8, 9]
      }
    ]
  },
  {
    id: 3,
    name: 'Birthday Party',
    description: 'Celebrate milestones with unforgettable parties tailored to any age.',
    icon: 'cake',
    features: ['Themes', 'Entertainment', 'Decor'],
    avgBudget: '₹50K - ₹5L',
    duration: '1-3 months',
    teamSize: '5-8 people',
    services: [
      {
        id: 10,
        name: 'Party Catering',
        description: 'Fun and delicious party food',
        price: '₹300',
        priceLabel: 'Per Plate',
        category: 'Catering'
      },
      {
        id: 11,
        name: 'Theme Decoration',
        description: 'Creative theme-based decorations',
        price: '₹20K',
        priceLabel: 'Starting',
        category: 'Decoration'
      },
      {
        id: 12,
        name: 'Party Entertainment',
        description: 'Fun entertainment for all ages',
        price: '₹15K',
        priceLabel: 'Per Event',
        category: 'Entertainment'
      }
    ],
    packages: [
      {
        id: 6,
        name: 'Basic Birthday',
        description: 'Simple and fun birthday celebration',
        price: '₹50K',
        features: [
          'Basic catering (30 guests)',
          'Simple decoration',
          'Basic entertainment'
        ],
        services: [10, 11, 12]
      },
      {
        id: 7,
        name: 'Premium Birthday',
        description: 'Unforgettable birthday celebration',
        price: '₹3L',
        features: [
          'Premium catering (50 guests)',
          'Theme decoration',
          'Professional entertainment',
          'Event coordination'
        ],
        services: [10, 11, 12]
      }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('id');

    if (eventId) {
      const event = events.find(e => e.id === parseInt(eventId));
      if (!event) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(event);
    }

    // Return all events
    return NextResponse.json(events);

  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
