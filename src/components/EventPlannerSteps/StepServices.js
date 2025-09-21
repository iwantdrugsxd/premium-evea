'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Camera, Utensils, Palette, Music, Flower2, Car, Crown, Plus, X } from 'lucide-react';

const availableServices = [
  {
    id: 'photography',
    name: 'Photography',
    description: 'Professional event photography',
    icon: Camera,
    color: 'from-blue-500 to-cyan-500',
    price: '₹25K+'
  },
  {
    id: 'catering',
    name: 'Catering',
    description: 'Gourmet cuisine for all occasions',
    icon: Utensils,
    color: 'from-purple-500 to-pink-500',
    price: '₹800/plate'
  },
  {
    id: 'decor',
    name: 'Decoration',
    description: 'Transform any space beautifully',
    icon: Palette,
    color: 'from-pink-500 to-red-500',
    price: '₹15K+'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Live music and performances',
    icon: Music,
    color: 'from-green-500 to-emerald-500',
    price: '₹50K+'
  },
  {
    id: 'florals',
    name: 'Floral Arrangements',
    description: 'Beautiful flower arrangements',
    icon: Flower2,
    color: 'from-pink-400 to-rose-500',
    price: '₹8K+'
  },
  {
    id: 'transportation',
    name: 'Transportation',
    description: 'Premium cars and buses',
    icon: Car,
    color: 'from-gray-600 to-gray-800',
    price: '₹12K+'
  },
  {
    id: 'luxury',
    name: 'Luxury Services',
    description: 'Celebrity entertainment and more',
    icon: Crown,
    color: 'from-yellow-500 to-orange-500',
    price: '₹2L+'
  }
];

// Animated Toggle Component
function AnimatedToggle({ isSelected, onToggle, service }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`
        relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50
        ${isSelected ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'}
      `}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
        animate={{
          x: isSelected ? 24 : 2,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      />
    </motion.button>
  );
}

// Service Card Component
function ServiceCard({ service, isSelected, onToggle }) {
  const IconComponent = service.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/50' 
          : 'bg-white/5 border-white/10 hover:bg-white/10'
        }
      `}
      onClick={onToggle}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-4 h-4 text-white" />
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center`}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>
            <p className="text-sm font-medium text-purple-400">{service.price}</p>
          </div>
        </div>
        
        <AnimatedToggle
          isSelected={isSelected}
          onToggle={onToggle}
          service={service}
        />
      </div>
    </motion.div>
  );
}

// Selected Service Tag Component
function SelectedServiceTag({ service, onRemove }) {
  const IconComponent = service.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: -100 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-sm"
    >
      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center`}>
        <IconComponent className="w-2.5 h-2.5 text-white" />
      </div>
      <span className="text-white font-medium">{service.name}</span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-3 h-3" />
      </motion.button>
    </motion.div>
  );
}

export default function StepServices({ selectedServices, onUpdate }) {
  const handleServiceToggle = (serviceId) => {
    const service = availableServices.find(s => s.id === serviceId);
    if (!service) return;

    if (selectedServices.some(s => s.id === serviceId)) {
      // Remove service
      onUpdate(selectedServices.filter(s => s.id !== serviceId));
    } else {
      // Add service
      onUpdate([...selectedServices, service]);
    }
  };

  const handleRemoveService = (serviceId) => {
    onUpdate(selectedServices.filter(s => s.id !== serviceId));
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Select your services
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Choose the services you need for your event. You can add or remove services anytime.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Available Services */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-400" />
            Available Services
          </h3>
          
          <div className="space-y-4">
            {availableServices.map((service, index) => {
              const isSelected = selectedServices.some(s => s.id === service.id);
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ServiceCard
                    service={service}
                    isSelected={isSelected}
                    onToggle={() => handleServiceToggle(service.id)}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Services */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Selected Services ({selectedServices.length})
          </h3>
          
          <div className="min-h-[200px] p-6 bg-white/5 rounded-xl border border-white/10">
            {selectedServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400">No services selected yet</p>
                <p className="text-sm text-gray-500">Choose services from the left to get started</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <AnimatePresence>
                  {selectedServices.map((service) => (
                    <SelectedServiceTag
                      key={service.id}
                      service={service}
                      onRemove={() => handleRemoveService(service.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Total Cost Estimate */}
          {selectedServices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Estimated Total:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ₹{selectedServices.length * 25}K+
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                *Final pricing will be confirmed after consultation
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Selection Feedback */}
      {selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
