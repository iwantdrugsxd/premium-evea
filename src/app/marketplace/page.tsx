'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Plus,
  Filter,
  ShoppingCart,
  CheckCircle,
  Phone,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Heart,
  Share2,
  Calendar,
  DollarSign,
  Shield,
  Award,
  Zap
} from 'lucide-react';

export default function MarketplacePage() {
  const [activeFilter, setActiveFilter] = useState('All Vendors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCallScheduler, setShowCallScheduler] = useState(false);

  const filters = [
    'All Vendors', 'Catering', 'Photography', 'Decoration', 
    'Entertainment', 'Venues', 'Transportation', 'Florists'
  ];

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
      reviews: [
        { name: "Pooja M.", rating: 5, comment: "Gorgeous flower arrangements!" },
        { name: "Arjun S.", rating: 4, comment: "Fresh and beautiful flowers" }
      ]
    }
  ];

  const addToCart = (vendor: any) => {
    if (!cart.find(item => item.id === vendor.id)) {
      setCart([...cart, { ...vendor, quantity: 1 }]);
    }
  };

  const removeFromCart = (vendorId: number) => {
    setCart(cart.filter(item => item.id !== vendorId));
  };

  const updateQuantity = (vendorId: number, quantity: number) => {
    setCart(cart.map(item => 
      item.id === vendorId ? { ...item, quantity } : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^\d]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleScheduleCall = () => {
    setShowCallScheduler(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-title"
        >
          Verified<br />
          <span className="gradient-text">Event Partners</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-subtitle"
        >
          Discover and connect with premium vendors. Every partner is verified, insured, and ready to make your event extraordinary.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="search-container">
            <input
              type="text"
              placeholder="Search vendors, services, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
          </div>
        </motion.div>

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          {filters.map((filter, index) => (
            <motion.button
              key={filter}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              onClick={() => setActiveFilter(filter)}
              className={`filter-pill ${activeFilter === filter ? 'active' : ''}`}
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Vendors Grid */}
      <section className="pb-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.map((vendor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="vendor-card"
              >
                {/* Vendor Image */}
                <div className="h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-yellow-400 font-semibold">
                    {vendor.badge}
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <button className="w-8 h-8 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-pink-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-purple-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Vendor Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{vendor.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{vendor.category}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(vendor.rating) ? 'fill-current' : ''}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {vendor.rating} ({vendor.events} events)
                    </span>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/5 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-500">{vendor.price}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">{vendor.priceLabel}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-500">{vendor.events}+</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-500">{vendor.responseTime}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Response</div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setShowVendorDetails(true);
                      }}
                      className="vendor-btn"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => addToCart(vendor)}
                      className="vendor-btn primary"
                    >
                      Add to Package
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor Details Modal */}
      <AnimatePresence>
        {showVendorDetails && selectedVendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowVendorDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedVendor.name}</h2>
                    <p className="text-gray-400">{selectedVendor.category}</p>
                  </div>
                  <button
                    onClick={() => setShowVendorDetails(false)}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">About</h3>
                    <p className="text-gray-400 mb-6">{selectedVendor.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white">{selectedVendor.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Experience:</span>
                        <span className="text-white">{selectedVendor.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Team Size:</span>
                        <span className="text-white">{selectedVendor.teamSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Availability:</span>
                        <span className="text-white">{selectedVendor.availability}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4">Features</h3>
                    <div className="space-y-3">
                      {selectedVendor.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 p-6 bg-white/5 rounded-2xl">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-purple-500">{selectedVendor.price}</div>
                        <div className="text-gray-400">{selectedVendor.priceLabel}</div>
                      </div>
                      <button
                        onClick={() => {
                          addToCart(selectedVendor);
                          setShowVendorDetails(false);
                        }}
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                      >
                        Add to Package
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Reviews</h3>
                  <div className="space-y-4">
                    {selectedVendor.reviews.map((review: any, index: number) => (
                      <div key={index} className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">{review.name}</span>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shopping Cart */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Your Package</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Your package is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-8">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg"></div>
                          <div className="flex-1">
                            <h3 className="font-bold">{item.name}</h3>
                            <p className="text-gray-400 text-sm">{item.category}</p>
                            <div className="text-purple-500 font-bold">{item.price}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/30"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-6 mb-8">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total:</span>
                        <span className="gradient-text">₹{getTotalPrice().toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Package Ready!</h2>
                  <p className="text-gray-400">Your custom package has been created successfully</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                    <span>Total Vendors:</span>
                    <span className="font-bold">{cart.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                    <span>Total Amount:</span>
                    <span className="font-bold gradient-text">₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleScheduleCall}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Schedule Call with EVEA Partners
                  </button>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:border-purple-500 transition-all"
                  >
                    Back to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Scheduler Modal */}
      <AnimatePresence>
        {showCallScheduler && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowCallScheduler(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Schedule Your Call</h2>
                <p className="text-gray-400 mb-8">
                  Our EVEA partners will call you within 24 hours to discuss your package and provide a detailed quotation.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span>Detailed quotation provided on call</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <Award className="w-5 h-5 text-purple-400" />
                    <span>10-person EVEA team assigned</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span>50-50 payment split (before & after event)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      alert('Calendar integration will be added here');
                      setShowCallScheduler(false);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                  >
                    Schedule Call Now
                  </button>
                  <button
                    onClick={() => setShowCallScheduler(false)}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:border-purple-500 transition-all"
                  >
                    Back to Checkout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        onClick={() => setShowCart(true)}
        className="fab"
      >
        <ShoppingCart />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
            {cart.length}
          </span>
        )}
      </motion.button>
    </div>
  );
}
