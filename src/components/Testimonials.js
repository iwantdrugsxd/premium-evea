'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Star } from 'lucide-react';

// Testimonial Card Component
function TestimonialCard({ testimonial, index, isHovered, onHover }) {
  return (
    <motion.div
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.2 }}
      className={`
        flex-shrink-0 w-80 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6
        transition-all duration-300 cursor-pointer
        ${isHovered ? 'bg-white/10 border-white/20 shadow-lg shadow-purple-500/10' : ''}
      `}
    >
      {/* User Info */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
          {testimonial.avatar}
        </div>
        <div>
          <div className="font-semibold text-white">{testimonial.name}</div>
          <div className="text-sm text-gray-400">{testimonial.location}</div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-300 mb-4 leading-relaxed">
        "{testimonial.text}"
      </p>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-1 hover:text-red-400 transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>{testimonial.likes}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{testimonial.comments}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-1 hover:text-green-400 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{testimonial.shares}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Marquee Component
function Marquee({ children, direction = 'left', speed = 1 }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex space-x-6"
        animate={{
          x: direction === 'left' ? '-100%' : '100%'
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 20 / speed,
            ease: 'linear'
          }
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const testimonials = [
    {
      name: "Priya & Rahul",
      location: "Mumbai • 2 days ago",
      text: "Our dream wedding came true thanks to EVEA! The team handled everything perfectly. Special thanks to our event manager! 💕",
      likes: 234,
      comments: 45,
      shares: 12,
      avatar: "PR",
      rating: 5
    },
    {
      name: "Tech Corp",
      location: "Bangalore • 1 week ago",
      text: "Annual conference for 500+ attendees executed flawlessly. EVEA's corporate package exceeded expectations!",
      likes: 167,
      comments: 23,
      shares: 8,
      avatar: "TC",
      rating: 5
    },
    {
      name: "Sharma Family",
      location: "Delhi • 3 days ago",
      text: "Birthday celebration turned magical! The decoration team transformed our home beautifully. Thank you EVEA! 🎉",
      likes: 89,
      comments: 18,
      shares: 5,
      avatar: "SF",
      rating: 5
    },
    {
      name: "Sarah & Mike",
      location: "Chennai • 1 week ago",
      text: "Destination wedding in Goa was absolutely perfect! EVEA made our special day unforgettable. Highly recommended!",
      likes: 156,
      comments: 32,
      shares: 9,
      avatar: "SM",
      rating: 5
    },
    {
      name: "Corporate Events Ltd",
      location: "Pune • 2 weeks ago",
      text: "Product launch event was a huge success. EVEA's attention to detail and professional execution was outstanding.",
      likes: 98,
      comments: 15,
      shares: 6,
      avatar: "CE",
      rating: 5
    },
    {
      name: "Anita & Rajesh",
      location: "Kolkata • 4 days ago",
      text: "Anniversary celebration was beyond our expectations. The team's creativity and dedication made it perfect!",
      likes: 123,
      comments: 28,
      shares: 7,
      avatar: "AR",
      rating: 5
    }
  ];

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-32 px-6 lg:px-8 bg-black/50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full mb-8">
            <span className="text-purple-300 text-sm font-medium">Community</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-8">
            Real Events.<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Real Stories.
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join our community of event enthusiasts. Share your celebrations, get inspired, and connect with others.
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative">
          {/* First Row - Left to Right */}
          <div className="mb-8">
            <Marquee direction="left" speed={1}>
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`row1-${index}`}
                  testimonial={testimonial}
                  index={index}
                  isHovered={hoveredCard === `row1-${index}`}
                  onHover={(hovered) => setHoveredCard(hovered ? `row1-${index}` : null)}
                />
              ))}
            </Marquee>
          </div>

          {/* Second Row - Right to Left */}
          <div className="mb-8">
            <Marquee direction="right" speed={1.2}>
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`row2-${index}`}
                  testimonial={testimonial}
                  index={index}
                  isHovered={hoveredCard === `row2-${index}`}
                  onHover={(hovered) => setHoveredCard(hovered ? `row2-${index}` : null)}
                />
              ))}
            </Marquee>
          </div>

          {/* Third Row - Left to Right (slower) */}
          <div>
            <Marquee direction="left" speed={0.8}>
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`row3-${index}`}
                  testimonial={testimonial}
                  index={index}
                  isHovered={hoveredCard === `row3-${index}`}
                  onHover={(hovered) => setHoveredCard(hovered ? `row3-${index}` : null)}
                />
              ))}
            </Marquee>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            Join Community
          </motion.button>
        </motion.div>
      </div>

      {/* Gradient Overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
}
