'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Utensils, Palette, Music, Flower2, Car, Crown, Star, Filter, X } from 'lucide-react';

// Filter Button Component
function FilterButton({ category, isActive, onClick, count }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2
        ${isActive 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
          : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
        }
      `}
    >
      {category.icon && <category.icon className="w-4 h-4" />}
      <span>{category.name}</span>
      {count !== undefined && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white/20 px-2 py-1 rounded-full text-xs"
        >
          {count}
        </motion.span>
      )}
    </motion.button>
  );
}

// Enhanced Vendor Card Component
function VendorCard({ vendor, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <motion.div
        animate={{
          y: isHovered ? -8 : 0,
          scale: isHovered ? 1.02 : 1
        }}
        transition={{ duration: 0.2 }}
        className={`
          relative bg-white/5 backdrop-blur-sm border rounded-3xl p-6 transition-all duration-300 cursor-pointer
          ${isHovered 
            ? 'bg-white/10 border-white/20 shadow-lg shadow-purple-500/10' 
            : 'border-white/10 hover:bg-white/10'
          }
        `}
      >
        {/* Card Image/Icon */}
        <div className={`w-full h-48 bg-gradient-to-r ${vendor.color} rounded-xl mb-6 flex items-center justify-center relative overflow-hidden`}>
          <div className="text-white text-4xl">{vendor.icon}</div>
          
          {/* Hover overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isHovered ? 1 : 0 }}
              className="bg-white/20 backdrop-blur-sm rounded-full p-3"
            >
              <Crown className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* Card Content */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{vendor.title}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-400">({vendor.reviews})</span>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{vendor.description}</p>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {vendor.price}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative overflow-hidden
              ${isHovered 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }
            `}
          >
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: isHovered ? '100%' : '-100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Add to Package</span>
          </motion.button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-300">
            {vendor.category}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VendorMarketplace() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter categories
  const categories = [
    { id: 'all', name: 'All', icon: null },
    { id: 'photography', name: 'Photography', icon: Camera },
    { id: 'catering', name: 'Catering', icon: Utensils },
    { id: 'decor', name: 'Decor', icon: Palette },
    { id: 'entertainment', name: 'Entertainment', icon: Music },
    { id: 'florals', name: 'Florals', icon: Flower2 },
    { id: 'transportation', name: 'Transportation', icon: Car },
    { id: 'luxury', name: 'Luxury', icon: Crown }
  ];

  // Vendor data
  const vendors = [
    {
      id: 1,
      title: "Premium Photography",
      category: "photography",
      rating: 5,
      reviews: 127,
      description: "Professional wedding & event photography with 8+ years experience",
      price: "₹25K+",
      color: "from-blue-500 to-cyan-500",
      icon: <Camera className="w-8 h-8" />
    },
    {
      id: 2,
      title: "Elite Catering",
      category: "catering",
      rating: 5,
      reviews: 89,
      description: "Gourmet cuisine for all occasions with custom menu planning",
      price: "₹800/plate",
      color: "from-purple-500 to-pink-500",
      icon: <Utensils className="w-8 h-8" />
    },
    {
      id: 3,
      title: "Luxury Decor",
      category: "decor",
      rating: 5,
      reviews: 156,
      description: "Transform any space into a magical celebration venue",
      price: "₹15K+",
      color: "from-pink-500 to-red-500",
      icon: <Palette className="w-8 h-8" />
    },
    {
      id: 4,
      title: "Live Music Band",
      category: "entertainment",
      rating: 5,
      reviews: 203,
      description: "Professional musicians for weddings and corporate events",
      price: "₹50K+",
      color: "from-green-500 to-emerald-500",
      icon: <Music className="w-8 h-8" />
    },
    {
      id: 5,
      title: "Floral Arrangements",
      category: "florals",
      rating: 5,
      reviews: 94,
      description: "Beautiful flower arrangements and bouquets for any occasion",
      price: "₹8K+",
      color: "from-pink-400 to-rose-500",
      icon: <Flower2 className="w-8 h-8" />
    },
    {
      id: 6,
      title: "Luxury Transportation",
      category: "transportation",
      rating: 5,
      reviews: 67,
      description: "Premium cars and buses for your special day",
      price: "₹12K+",
      color: "from-gray-600 to-gray-800",
      icon: <Car className="w-8 h-8" />
    },
    {
      id: 7,
      title: "Celebrity Entertainment",
      category: "luxury",
      rating: 5,
      reviews: 45,
      description: "Book famous artists and performers for your event",
      price: "₹2L+",
      color: "from-yellow-500 to-orange-500",
      icon: <Crown className="w-8 h-8" />
    },
    {
      id: 8,
      title: "Videography Studio",
      category: "photography",
      rating: 5,
      reviews: 112,
      description: "Cinematic wedding and event videography services",
      price: "₹35K+",
      color: "from-indigo-500 to-purple-500",
      icon: <Camera className="w-8 h-8" />
    }
  ];

  // Filter vendors based on active filter
  const filteredVendors = useMemo(() => {
    if (activeFilter === 'all') return vendors;
    return vendors.filter(vendor => vendor.category === activeFilter);
  }, [activeFilter, vendors]);

  // Get count for each category
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return vendors.length;
    return vendors.filter(vendor => vendor.category === categoryId).length;
  };

  return (
    <section className="py-32 px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full mb-8">
            <span className="text-purple-300 text-sm font-medium">Vendors</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-8">
            Vendor<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Marketplace
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect with verified vendors across all service categories. Quality guaranteed, prices transparent.
          </p>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          {/* Filter Toggle for Mobile */}
          <div className="lg:hidden mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? <X className="w-4 h-4" /> : null}
            </motion.button>
          </div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: showFilters || isDesktop ? 1 : 0,
              height: showFilters || isDesktop ? 'auto' : 0
            }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            {categories.map((category) => (
              <FilterButton
                key={category.id}
                category={category}
                isActive={activeFilter === category.id}
                onClick={() => setActiveFilter(category.id)}
                count={getCategoryCount(category.id)}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-8 text-center lg:text-left"
        >
          <p className="text-gray-400">
            Showing {filteredVendors.length} of {vendors.length} vendors
            {activeFilter !== 'all' && (
              <span className="text-purple-400 ml-2">
                in {categories.find(c => c.id === activeFilter)?.name}
              </span>
            )}
          </p>
        </motion.div>

        {/* Vendor Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {filteredVendors.map((vendor, index) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results State */}
        <AnimatePresence>
          {filteredVendors.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No vendors found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your filter to see more results
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter('all')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold"
              >
                Show All Vendors
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            Explore Full Marketplace
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
