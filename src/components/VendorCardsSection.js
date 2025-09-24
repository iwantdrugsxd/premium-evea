'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Utensils, 
  Palette, 
  Music, 
  Flower2, 
  Car, 
  Crown, 
  Star, 
  X, 
  Heart, 
  Share2,
  Phone,
  MapPin,
  Clock,
  Award,
  Users,
  ArrowRight
} from 'lucide-react';

// Vendor Card Component
function VendorCard({ vendor, index, onViewDetails }) {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryIcon = (category) => {
    const categoryMap = {
      'Photography & Videography': Camera,
      'Catering & Food Services': Utensils,
      'Decoration & Florist': Palette,
      'Music & Entertainment': Music,
      'Floral Design': Flower2,
      'Transportation & Logistics': Car,
      'Luxury Services': Crown,
      'Wedding Planning': Crown,
      'Corporate Events': Users,
      'Birthday & Celebrations': Crown,
      'Lighting & Sound': Music,
      'Security Services': Award
    };
    
    const IconComponent = categoryMap[category] || Crown;
    return <IconComponent className="w-6 h-6" />;
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Photography & Videography': 'from-blue-500 to-cyan-500',
      'Catering & Food Services': 'from-orange-500 to-red-500',
      'Decoration & Florist': 'from-pink-500 to-rose-500',
      'Music & Entertainment': 'from-purple-500 to-indigo-500',
      'Floral Design': 'from-green-500 to-emerald-500',
      'Transportation & Logistics': 'from-gray-500 to-slate-500',
      'Luxury Services': 'from-yellow-500 to-amber-500',
      'Wedding Planning': 'from-pink-500 to-purple-500',
      'Corporate Events': 'from-blue-500 to-indigo-500',
      'Birthday & Celebrations': 'from-pink-500 to-rose-500',
      'Lighting & Sound': 'from-purple-500 to-pink-500',
      'Security Services': 'from-red-500 to-orange-500'
    };
    
    return colorMap[category] || 'from-purple-500 to-pink-500';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 
          backdrop-blur-xl border border-white/20 shadow-2xl h-full flex flex-col
          transition-all duration-700 group-hover:scale-105 group-hover:shadow-3xl
          ${isHovered ? 'shadow-3xl scale-105' : 'shadow-xl'}
        `}
      >
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={vendor.image || '/api/placeholder/400/300'}
            alt={vendor.business_name || vendor.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-5 left-5">
            <div className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl
              bg-gradient-to-r ${getCategoryColor(vendor.category)} text-white
              backdrop-blur-md border border-white/30 shadow-lg
            `}>
              {getCategoryIcon(vendor.category)}
              <span className="text-sm font-semibold">{vendor.category?.split(',')[0]?.trim() || 'Event Services'}</span>
            </div>
          </div>

          {/* Premium Badge */}
          {vendor.badge === 'Verified' && (
            <div className="absolute top-5 right-5">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-black text-sm font-bold shadow-lg">
                <Crown className="w-4 h-4" />
                VERIFIED
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="absolute bottom-5 left-5">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-white text-sm font-semibold">{vendor.rating || '4.5'}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="absolute top-5 right-5 flex gap-2">
            <button className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-all duration-300 hover:scale-110">
              <Heart className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-blue-500/80 transition-all duration-300 hover:scale-110">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-7 flex-1 flex flex-col">
          {/* Business Name */}
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
            {vendor.business_name || vendor.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span className="font-medium">{vendor.location || 'Multiple Locations'}</span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
            {vendor.description || 'Professional event services with attention to detail and exceptional quality.'}
          </p>

          {/* Action Button */}
          <button
            onClick={() => onViewDetails(vendor)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group-hover:shadow-xl group-hover:scale-105"
          >
            View Details
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Hover Effect Overlay */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5
          opacity-0 group-hover:opacity-100 transition-opacity duration-700
          pointer-events-none rounded-3xl
        `} />

        {/* Glow Effect */}
        <div className={`
          absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20
          rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-700
          -z-10
        `} />
      </div>
    </motion.div>
  );
}

// Vendor Details Modal Component
function VendorDetailsModal({ vendor, isOpen, onClose }) {
  if (!vendor) return null;

  const getCategoryIcon = (category) => {
    const categoryMap = {
      'Photography & Videography': Camera,
      'Catering & Food Services': Utensils,
      'Decoration & Florist': Palette,
      'Music & Entertainment': Music,
      'Floral Design': Flower2,
      'Transportation & Logistics': Car,
      'Luxury Services': Crown,
      'Wedding Planning': Crown,
      'Corporate Events': Users,
      'Birthday & Celebrations': Crown,
      'Lighting & Sound': Music,
      'Security Services': Award
    };
    
    const IconComponent = categoryMap[category] || Crown;
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={onClose}
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
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    {getCategoryIcon(vendor.category)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{vendor.name}</h2>
                    <p className="text-gray-400">{vendor.category}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">About</h3>
                  <p className="text-gray-400 mb-6">{vendor.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white">{vendor.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Experience:</span>
                      <span className="text-white">{vendor.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{vendor.email || 'Contact for details'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response Time:</span>
                      <span className="text-white">{vendor.responseTime}</span>
                    </div>
                  </div>

                  {vendor.serviceAreas && vendor.serviceAreas.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-3">Service Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {vendor.serviceAreas.map((area, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {vendor.servicesOffered && vendor.servicesOffered.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-3">Services Offered</h4>
                      <div className="flex flex-wrap gap-2">
                        {vendor.servicesOffered.map((service, index) => (
                          <span key={index} className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-sm text-pink-300">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 p-6 bg-white/5 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">Pricing & Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Starting Price:</span>
                      <span className="text-2xl font-bold text-purple-400">{vendor.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Price Label:</span>
                      <span className="text-white">{vendor.priceLabel}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Events Completed:</span>
                      <span className="text-white">{vendor.events}+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white">{vendor.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Section */}
              {vendor.portfolio && vendor.portfolio.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Portfolio</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {vendor.portfolio.map((item, index) => (
                      <div key={item.id || index} className="bg-white/5 rounded-xl overflow-hidden">
                        <img 
                          src={item.image_url} 
                          alt={item.title}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzM0MTU1Ii8+CjxwYXRoIGQ9Ik02MCAxMDBMMTAwIDYwTDE0MCAxMDBMMTAwIDE0MEw2MCAxMDBaIiBmaWxsPSIjOTMzM0VBIi8+Cjwvc3ZnPgo=';
                          }}
                        />
                        <div className="p-3">
                          <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-gray-400">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div>
                <h3 className="text-xl font-bold mb-4">Reviews</h3>
                {vendor.reviews && vendor.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {vendor.reviews.map((review, index) => (
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
                ) : (
                  <div className="text-center py-8 bg-white/5 rounded-xl">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No reviews yet</p>
                    <p className="text-sm text-gray-500">Be the first to review this vendor</p>
                  </div>
                )}
              </div>

              {/* Contact Button */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Vendor
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function VendorCardsSection() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch vendors from API with pagination
  const fetchVendors = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/marketplace?page=${page}&limit=12`);
      const result = await response.json();
      
      if (result.success) {
        setVendors(result.vendors);
        setPagination(result.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: result.vendors.length,
          itemsPerPage: 12,
          hasNextPage: false,
          hasPrevPage: false
        });
      } else {
        setError(result.error || 'Failed to fetch vendors');
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors(1);
  }, []);

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowVendorDetails(true);
  };

  const handleCloseDetails = () => {
    setShowVendorDetails(false);
    setSelectedVendor(null);
  };

  return (
    <section className="py-32 px-6 lg:px-8 relative" data-section="vendors">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl mb-8 backdrop-blur-sm">
            <span className="text-purple-300 text-sm font-bold tracking-wider uppercase">Verified Partners</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            Premium<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Vendors
            </span>
          </h2>
          <p className="text-lg text-purple-300 mb-4 font-semibold">
            ✨ Updated and improved design
          </p>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
            Discover our curated selection of verified vendors. Each partner is handpicked for their excellence, reliability, and commitment to delivering exceptional experiences.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading vendors...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/30 transition-all"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && vendors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-4">No vendors found</p>
            <p className="text-sm text-gray-500">Check back later for new vendors</p>
          </motion.div>
        )}

        {/* Vendors Grid */}
        {!loading && !error && vendors.length > 0 && (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {vendors.map((vendor, index) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  index={index}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && vendors.length > 0 && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-12 flex flex-col items-center gap-6"
          >
            {/* Results Count */}
            <p className="text-gray-400 text-center">
              Showing {vendors.length} of {pagination.totalItems} vendors
            </p>
            
            {/* Pagination Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchVendors(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  pagination.hasPrevPage
                    ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30'
                    : 'bg-gray-500/10 border border-gray-500/20 text-gray-500 cursor-not-allowed'
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === pagination.currentPage;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchVendors(pageNum)}
                      className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => fetchVendors(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  pagination.hasNextPage
                    ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30'
                    : 'bg-gray-500/10 border border-gray-500/20 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Results Count for single page */}
        {!loading && !error && vendors.length > 0 && pagination.totalPages === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400">
              Showing {vendors.length} of {pagination.totalItems} vendors
            </p>
          </motion.div>
        )}
      </div>

      {/* Vendor Details Modal */}
      <VendorDetailsModal
        vendor={selectedVendor}
        isOpen={showVendorDetails}
        onClose={handleCloseDetails}
      />
    </section>
  );
}
