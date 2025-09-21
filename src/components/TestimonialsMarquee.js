'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, MessageCircle, Share2, Star } from 'lucide-react';

// Particle Effect Component
function ParticleEffect({ isActive, onComplete }) {
  const particles = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {isActive && particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          initial={{ 
            x: '50%', 
            y: '50%', 
            scale: 0,
            opacity: 1
          }}
          animate={{
            x: `${50 + (Math.random() - 0.5) * 100}%`,
            y: `${50 + (Math.random() - 0.5) * 100}%`,
            scale: [0, 1, 0],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 0.8,
            delay: particle * 0.1,
            ease: "easeOut"
          }}
          onAnimationComplete={particle === particles.length - 1 ? onComplete : undefined}
        />
      ))}
    </div>
  );
}

// Enhanced Testimonial Card Component
function TestimonialCard({ testimonial, index, isHovered, onHover, onLike, onShare, isLiked, isShared }) {
  const [showParticles, setShowParticles] = useState(false);

  const handleLike = () => {
    onLike(testimonial.id);
    setShowParticles(true);
  };

  const handleShare = () => {
    onShare(testimonial.id);
  };

  return (
    <motion.div
      layout
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="relative flex-shrink-0 w-80 mx-4"
    >
      <motion.div
        animate={{
          boxShadow: isHovered 
            ? '0 20px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.2)' 
            : '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
        transition={{ duration: 0.3 }}
        className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 cursor-pointer overflow-hidden"
      >
        {/* Dynamic Gradient Border */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
              'linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
              'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: '200% 200%',
            animation: 'gradientShift 3s ease infinite'
          }}
        />

        {/* Particle Effect */}
        <ParticleEffect 
          isActive={showParticles} 
          onComplete={() => setShowParticles(false)}
        />

        {/* Card Content */}
        <div className="relative z-10">
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
                className="w-4 h-4 text-yellow-400 fill-current"
              />
            ))}
          </div>

          {/* Testimonial Text */}
          <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">
            "{testimonial.text}"
          </p>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-colors ${
                  isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <motion.div
                  animate={{ scale: isLiked ? 1.2 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </motion.div>
                <span>{testimonial.likes + (isLiked ? 1 : 0)}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{testimonial.comments}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className={`flex items-center space-x-1 transition-colors ${
                  isShared ? 'text-green-400' : 'text-gray-400 hover:text-green-400'
                }`}
              >
                <motion.div
                  animate={{ scale: isShared ? 1.2 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Share2 className={`w-4 h-4 ${isShared ? 'fill-current' : ''}`} />
                </motion.div>
                <span>{testimonial.shares + (isShared ? 1 : 0)}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Marquee Row Component
function MarqueeRow({ children, direction = 'left', speed = 1, isPaused = false }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex space-x-0"
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
        style={{
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function TestimonialsMarquee() {
  const containerRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [likedCards, setLikedCards] = useState(new Set());
  const [sharedCards, setSharedCards] = useState(new Set());

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const topMarqueeY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const bottomMarqueeY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Priya & Rahul",
      location: "Mumbai • 2 days ago",
      text: "Our dream wedding came true thanks to EVEA! The team handled everything perfectly. Special thanks to our event manager! 💕",
      likes: 234,
      comments: 45,
      shares: 12,
      avatar: "PR"
    },
    {
      id: 2,
      name: "Tech Corp",
      location: "Bangalore • 1 week ago",
      text: "Annual conference for 500+ attendees executed flawlessly. EVEA's corporate package exceeded expectations!",
      likes: 167,
      comments: 23,
      shares: 8,
      avatar: "TC"
    },
    {
      id: 3,
      name: "Sharma Family",
      location: "Delhi • 3 days ago",
      text: "Birthday celebration turned magical! The decoration team transformed our home beautifully. Thank you EVEA! 🎉",
      likes: 89,
      comments: 18,
      shares: 5,
      avatar: "SF"
    },
    {
      id: 4,
      name: "Sarah & Mike",
      location: "Chennai • 1 week ago",
      text: "Destination wedding in Goa was absolutely perfect! EVEA made our special day unforgettable. Highly recommended!",
      likes: 156,
      comments: 32,
      shares: 9,
      avatar: "SM"
    },
    {
      id: 5,
      name: "Corporate Events Ltd",
      location: "Pune • 2 weeks ago",
      text: "Product launch event was a huge success. EVEA's attention to detail and professional execution was outstanding.",
      likes: 98,
      comments: 15,
      shares: 6,
      avatar: "CE"
    },
    {
      id: 6,
      name: "Anita & Rajesh",
      location: "Kolkata • 4 days ago",
      text: "Anniversary celebration was beyond our expectations. The team's creativity and dedication made it perfect!",
      likes: 123,
      comments: 28,
      shares: 7,
      avatar: "AR"
    },
    {
      id: 7,
      name: "Luxury Events Co",
      location: "Mumbai • 5 days ago",
      text: "High-end corporate gala was executed with absolute precision. EVEA's luxury package is worth every penny!",
      likes: 201,
      comments: 41,
      shares: 15,
      avatar: "LE"
    },
    {
      id: 8,
      name: "Wedding Dreams",
      location: "Goa • 3 days ago",
      text: "Beach wedding was absolutely stunning! EVEA's destination wedding expertise made our day perfect.",
      likes: 178,
      comments: 29,
      shares: 11,
      avatar: "WD"
    }
  ];

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  const handleLike = (id) => {
    setLikedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleShare = (id) => {
    setSharedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section 
      ref={containerRef}
      className="py-32 px-6 lg:px-8 bg-black/50 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
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
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Top Marquee - Left to Right */}
          <motion.div
            style={{ y: topMarqueeY }}
            className="mb-8"
          >
            <MarqueeRow 
              direction="left" 
              speed={isHovered ? 0.3 : 1} 
              isPaused={isHovered}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`top-${testimonial.id}-${index}`}
                  testimonial={testimonial}
                  index={index}
                  isHovered={isHovered}
                  onHover={setIsHovered}
                  onLike={handleLike}
                  onShare={handleShare}
                  isLiked={likedCards.has(testimonial.id)}
                  isShared={sharedCards.has(testimonial.id)}
                />
              ))}
            </MarqueeRow>
          </motion.div>

          {/* Bottom Marquee - Right to Left */}
          <motion.div
            style={{ y: bottomMarqueeY }}
            className="mb-8"
          >
            <MarqueeRow 
              direction="right" 
              speed={isHovered ? 0.3 : 1.2} 
              isPaused={isHovered}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`bottom-${testimonial.id}-${index}`}
                  testimonial={testimonial}
                  index={index}
                  isHovered={isHovered}
                  onHover={setIsHovered}
                  onLike={handleLike}
                  onShare={handleShare}
                  isLiked={likedCards.has(testimonial.id)}
                  isShared={sharedCards.has(testimonial.id)}
                />
              ))}
            </MarqueeRow>
          </motion.div>

          {/* Third Marquee - Left to Right (slower) */}
          <motion.div
            style={{ y: topMarqueeY }}
          >
            <MarqueeRow 
              direction="left" 
              speed={isHovered ? 0.2 : 0.8} 
              isPaused={isHovered}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`third-${testimonial.id}-${index}`}
                  testimonial={testimonial}
                  index={index}
                  isHovered={isHovered}
                  onHover={setIsHovered}
                  onLike={handleLike}
                  onShare={handleShare}
                  isLiked={likedCards.has(testimonial.id)}
                  isShared={sharedCards.has(testimonial.id)}
                />
              ))}
            </MarqueeRow>
          </motion.div>
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

      {/* Custom CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
