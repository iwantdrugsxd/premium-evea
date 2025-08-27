import { NextRequest, NextResponse } from 'next/server';

// Mock vendors database (replace with Supabase)
const vendors = [
  {
    id: 1,
    name: "Royal Feast Catering",
    category: "Luxury Catering Services",
    rating: 4.9,
    events: 234,
    price: "₹800",
    priceLabel: "Per Plate",
    responseTime: "24hr",
    badge: "Premium",
    image: "catering",
    description: "Premium catering services with celebrity chefs and international cuisine. Perfect for luxury events and corporate functions.",
    features: ["Multi-cuisine", "Dietary Options", "Live Cooking", "Premium Service"],
    location: "Mumbai, Delhi, Bangalore",
    experience: "8+ years",
    teamSize: "25-50 people",
    availability: "Next 3 months",
    portfolio: [
      {
        id: 1,
        title: "Luxury Wedding Reception",
        description: "5-star hotel wedding reception with international cuisine",
        image: "https://images.unsplash.com/photo-1555244162-cc22863d92b5?w=800&h=600&fit=crop",
        category: "Wedding"
      },
      {
        id: 2,
        title: "Corporate Gala Dinner",
        description: "Annual corporate event with 500+ attendees",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
        category: "Corporate"
      },
      {
        id: 3,
        title: "Birthday Celebration",
        description: "Intimate birthday party with custom menu",
        image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
        category: "Birthday"
      }
    ],
    reviews: [
      { name: "Priya S.", rating: 5, comment: "Amazing food and service!" },
      { name: "Raj K.", rating: 5, comment: "Exceeded all expectations" }
    ]
  },
  {
    id: 2,
    name: "Cinematic Moments Studio",
    category: "Photography & Videography",
    rating: 5.0,
    events: 189,
    price: "₹1L",
    priceLabel: "Per Day",
    responseTime: "2hr",
    badge: "Verified",
    image: "photography",
    description: "Professional photography and videography services capturing every precious moment of your special day.",
    features: ["4K Video", "Drone Shots", "Photo Editing", "Same Day Preview"],
    location: "Pan India",
    experience: "12+ years",
    teamSize: "8-15 people",
    availability: "Next 6 months",
    portfolio: [
      {
        id: 4,
        title: "Destination Wedding",
        description: "Complete wedding coverage in Goa",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
        category: "Wedding"
      },
      {
        id: 5,
        title: "Corporate Event",
        description: "Annual conference photography",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
        category: "Corporate"
      },
      {
        id: 6,
        title: "Birthday Party",
        description: "Sweet 16 birthday celebration",
        image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
        category: "Birthday"
      }
    ],
    reviews: [
      { name: "Anita M.", rating: 5, comment: "Stunning photos and videos!" },
      { name: "Vikram R.", rating: 5, comment: "Professional and creative" }
    ]
  },
  {
    id: 3,
    name: "Dream Decor Studios",
    category: "Premium Decoration",
    rating: 4.8,
    events: 156,
    price: "₹50K",
    priceLabel: "Starting",
    responseTime: "4hr",
    badge: "Exclusive",
    image: "decoration",
    description: "Transform any space into a magical setting with our premium decoration services and creative designs.",
    features: ["Theme Design", "LED Lighting", "Floral Arrangements", "Custom Props"],
    location: "Mumbai, Pune, Goa",
    experience: "6+ years",
    teamSize: "15-30 people",
    availability: "Next 2 months",
    portfolio: [
      {
        id: 7,
        title: "Royal Wedding Setup",
        description: "Luxury wedding decoration with custom themes",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
        category: "Wedding"
      },
      {
        id: 8,
        title: "Corporate Stage Setup",
        description: "Professional stage decoration for conferences",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
        category: "Corporate"
      },
      {
        id: 9,
        title: "Theme Birthday Party",
        description: "Disney-themed birthday decoration",
        image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
        category: "Birthday"
      }
    ],
    reviews: [
      { name: "Meera P.", rating: 5, comment: "Absolutely magical decor!" },
      { name: "Suresh L.", rating: 4, comment: "Beautiful and elegant" }
    ]
  },
  {
    id: 4,
    name: "Beats Entertainment",
    category: "DJ & Live Music",
    rating: 4.7,
    events: 98,
    price: "₹30K",
    priceLabel: "Per Event",
    responseTime: "1hr",
    badge: "Featured",
    image: "entertainment",
    description: "Create the perfect atmosphere with our professional DJs and live music performances.",
    features: ["Multiple Genres", "Live Bands", "Sound System", "Lighting Effects"],
    location: "All Major Cities",
    experience: "10+ years",
    teamSize: "5-12 people",
    availability: "Next 4 months",
    portfolio: [
      {
        id: 10,
        title: "Wedding Reception Party",
        description: "High-energy wedding reception with live band",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
        category: "Wedding"
      },
      {
        id: 11,
        title: "Corporate Awards Night",
        description: "Professional entertainment for corporate event",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
        category: "Corporate"
      },
      {
        id: 12,
        title: "Birthday Bash",
        description: "Fun-filled birthday party with DJ",
        image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
        category: "Birthday"
      }
    ],
    reviews: [
      { name: "Rahul D.", rating: 5, comment: "Amazing music and energy!" },
      { name: "Kavya S.", rating: 4, comment: "Great playlist and mixing" }
    ]
  },
  {
    id: 5,
    name: "The Grand Ballroom",
    category: "Luxury Venues",
    rating: 4.9,
    events: 67,
    price: "₹2L",
    priceLabel: "Per Day",
    responseTime: "6hr",
    badge: "New",
    image: "venue",
    description: "Exclusive luxury venues perfect for weddings, corporate events, and special celebrations.",
    features: ["Multiple Halls", "Catering Kitchen", "Parking", "Valet Service"],
    location: "Mumbai, Delhi, Bangalore",
    experience: "3+ years",
    teamSize: "20-40 people",
    availability: "Next 8 months",
    portfolio: [
      {
        id: 13,
        title: "Luxury Wedding Venue",
        description: "Exclusive wedding venue with garden and ballroom",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
        category: "Wedding"
      },
      {
        id: 14,
        title: "Corporate Conference Center",
        description: "State-of-the-art conference facilities",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
        category: "Corporate"
      },
      {
        id: 15,
        title: "Private Party Hall",
        description: "Intimate venue for special celebrations",
        image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
        category: "Birthday"
      }
    ],
    reviews: [
      { name: "Aditya K.", rating: 5, comment: "Stunning venue and service!" },
      { name: "Neha R.", rating: 5, comment: "Perfect for our wedding" }
    ]
  },
  {
    id: 6,
    name: "Floral Fantasy",
    category: "Floral Design",
    rating: 4.8,
    events: 123,
    price: "₹25K",
    priceLabel: "Starting",
    responseTime: "3hr",
    badge: "Trending",
    image: "floral",
    description: "Create breathtaking floral arrangements and decorations for any occasion.",
    features: ["Fresh Flowers", "Seasonal Designs", "Custom Arrangements", "Installation"],
    location: "Pan India",
    experience: "7+ years",
    teamSize: "10-20 people",
    availability: "Next 3 months",
    portfolio: [
      {
        id: 16,
        title: "Wedding Floral Setup",
        description: "Romantic wedding decoration with fresh flowers",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
        category: "Wedding"
      },
      {
        id: 17,
        title: "Corporate Floral Arrangements",
        description: "Elegant floral decor for corporate events",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
        category: "Corporate"
      },
      {
        id: 18,
        title: "Birthday Flower Decor",
        description: "Colorful floral arrangements for birthday",
        image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
        category: "Birthday"
      }
    ],
    reviews: [
      { name: "Pooja M.", rating: 5, comment: "Gorgeous flower arrangements!" },
      { name: "Arjun S.", rating: 4, comment: "Fresh and beautiful flowers" }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('id');
    const category = searchParams.get('category');

    if (vendorId) {
      const vendor = vendors.find(v => v.id === parseInt(vendorId));
      if (!vendor) {
        return NextResponse.json(
          { error: 'Vendor not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(vendor);
    }

    if (category && category !== 'All Vendors') {
      const filteredVendors = vendors.filter(v => 
        v.category.toLowerCase().includes(category.toLowerCase()) ||
        v.features.some(f => f.toLowerCase().includes(category.toLowerCase()))
      );
      return NextResponse.json(filteredVendors);
    }

    // Return all vendors
    return NextResponse.json(vendors);

  } catch (error) {
    console.error('Vendors API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
