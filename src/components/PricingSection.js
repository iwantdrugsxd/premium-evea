'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { CheckCircle, Crown, Star, Zap } from 'lucide-react';

// Enhanced Pricing Card Component
function PricingCard({ 
  title, 
  price, 
  description, 
  features, 
  isPopular = false, 
  buttonText, 
  buttonVariant = 'primary',
  icon: Icon
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tilt
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      perspective={1000}
      scale={1.02}
      transitionSpeed={1000}
      gyroscope={true}
      className="h-full"
    >
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`
          relative h-full p-8 rounded-3xl backdrop-blur-sm border transition-all duration-300
          ${isPopular 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/5 border-white/10 hover:bg-white/10'
          }
        `}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        {/* Popular Badge */}
        {isPopular && (
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: -12 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm" />
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Most Popular
              </div>
            </div>
          </motion.div>
        )}

        {/* Glowing border animation for popular card */}
        {isPopular && (
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-20"
            animate={{
              background: [
                'linear-gradient(45deg, #8B5CF6, #EC4899, #8B5CF6)',
                'linear-gradient(45deg, #EC4899, #8B5CF6, #EC4899)',
                'linear-gradient(45deg, #8B5CF6, #EC4899, #8B5CF6)'
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
        )}

        {/* Card Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              {Icon && <Icon className="w-8 h-8 text-purple-400 mr-3" />}
              <h3 className="text-2xl font-bold text-white">{title}</h3>
            </div>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              {price}
            </div>
            <p className="text-gray-400">{description}</p>
          </div>

          {/* Features List */}
          <motion.ul 
            className="space-y-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0.8,
                  x: isHovered ? 0 : -10
                }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.1
                }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <CheckCircle className="w-3 h-3 text-white" />
                </motion.div>
                <span className="text-gray-300">{feature}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-full py-4 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden
              ${buttonVariant === 'primary' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25' 
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }
            `}
          >
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">{buttonText}</span>
          </motion.button>
        </div>
      </motion.div>
    </Tilt>
  );
}

export default function PricingSection() {
  const packages = [
    {
      title: "Basic",
      price: "₹50K+",
      description: "Perfect for intimate gatherings",
      features: [
        "Event Planning Consultation",
        "Vendor Coordination", 
        "Basic Decoration Setup",
        "Day-of Coordination"
      ],
      buttonText: "Choose Basic",
      buttonVariant: "secondary",
      icon: Star
    },
    {
      title: "Professional",
      price: "₹1.5L+",
      description: "Comprehensive event management",
      features: [
        "Everything in Basic",
        "Premium Vendor Network",
        "Custom Theme Design",
        "Timeline Management",
        "Guest Management System"
      ],
      isPopular: true,
      buttonText: "Choose Professional",
      buttonVariant: "primary",
      icon: Crown
    },
    {
      title: "Premium",
      price: "₹3L+",
      description: "Luxury event experiences",
      features: [
        "Everything in Professional",
        "Luxury Venue Selection",
        "Celebrity Entertainment",
        "Instagram Story Creation",
        "YouTube Live Streaming"
      ],
      buttonText: "Choose Premium",
      buttonVariant: "secondary",
      icon: Zap
    }
  ];

  return (
    <section className="py-32 px-6 lg:px-8 bg-black/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full mb-8">
            <span className="text-purple-300 text-sm font-medium">Pricing</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-8">
            Event<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Packages
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transparent pricing with no hidden costs. Choose the package that fits your vision and budget.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <PricingCard {...pkg} />
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-white">
              All packages include:
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-gray-300">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Free Consultation</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No Hidden Fees</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}
