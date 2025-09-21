'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Crown, Zap, Check } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹50K+',
    description: 'Perfect for intimate gatherings',
    icon: Star,
    color: 'from-gray-500 to-gray-600',
    features: [
      'Event Planning Consultation',
      'Vendor Coordination',
      'Basic Decoration Setup',
      'Day-of Coordination'
    ],
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '₹1.5L+',
    description: 'Comprehensive event management',
    icon: Crown,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Everything in Basic',
      'Premium Vendor Network',
      'Custom Theme Design',
      'Timeline Management',
      'Guest Management System'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹3L+',
    description: 'Luxury event experiences',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    features: [
      'Everything in Professional',
      'Luxury Venue Selection',
      'Celebrity Entertainment',
      'Instagram Story Creation',
      'YouTube Live Streaming'
    ],
    popular: false
  }
];

export default function StepPackage({ selectedPackage, onSelect }) {
  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Choose your package
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Select the package that best fits your budget and requirements. All packages include our core services.
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {packages.map((pkg, index) => {
          const IconComponent = pkg.icon;
          const isSelected = selectedPackage === pkg.id;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
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
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onSelect(pkg.id)}
                  className={`
                    relative h-full p-8 rounded-3xl backdrop-blur-sm border-2 cursor-pointer transition-all duration-300
                    ${isSelected 
                      ? 'bg-white/10 border-purple-500/50 shadow-lg shadow-purple-500/20' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }
                  `}
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <motion.div
                      initial={{ scale: 0, rotate: -12 }}
                      animate={{ scale: 1, rotate: -12 }}
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                    >
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Most Popular
                      </div>
                    </motion.div>
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  )}

                  {/* Glow Effect for Selected */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"
                      animate={{
                        opacity: [0.2, 0.3, 0.2],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}

                  {/* Card Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${pkg.color} flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                      <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        {pkg.price}
                      </div>
                      <p className="text-gray-400">{pkg.description}</p>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </Tilt>
            </motion.div>
          );
        })}
      </div>

      {/* Selection Feedback */}
      {selectedPackage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              {packages.find(pkg => pkg.id === selectedPackage)?.name} package selected
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
