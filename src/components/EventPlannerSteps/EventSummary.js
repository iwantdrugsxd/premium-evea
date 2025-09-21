'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Calendar, Users, MapPin, Star, Crown, Zap, X } from 'lucide-react';

const packageIcons = {
  basic: Star,
  professional: Crown,
  premium: Zap
};

const packageColors = {
  basic: 'from-gray-500 to-gray-600',
  professional: 'from-purple-500 to-pink-500',
  premium: 'from-yellow-500 to-orange-500'
};

export default function EventSummary({ formData }) {
  const { eventType, package: selectedPackage, services, eventDetails } = formData;

  // Calculate estimated total
  const basePrice = selectedPackage === 'basic' ? 50 : selectedPackage === 'professional' ? 150 : 300;
  const servicePrice = services.length * 25;
  const estimatedTotal = basePrice + servicePrice;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-purple-400" />
        Event Summary
      </h3>

      <div className="space-y-6">
        {/* Event Type */}
        {eventType && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-2">Event Type</h4>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium capitalize">{eventType}</span>
            </div>
          </motion.div>
        )}

        {/* Selected Package */}
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-2">Package</h4>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${packageColors[selectedPackage]} flex items-center justify-center`}>
                {React.createElement(packageIcons[selectedPackage], { className: "w-4 h-4 text-white" })}
              </div>
              <div>
                <span className="text-white font-medium capitalize">{selectedPackage}</span>
                <p className="text-sm text-gray-400">
                  {selectedPackage === 'basic' ? '₹50K+' : 
                   selectedPackage === 'professional' ? '₹1.5L+' : '₹3L+'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Selected Services */}
        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-3">Services ({services.length})</h4>
            <div className="space-y-2">
              <AnimatePresence>
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                        <service.icon className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-white text-sm">{service.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{service.price}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Event Details */}
        {eventDetails.eventName && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-3">Event Details</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                <span className="text-white text-sm">{eventDetails.eventName}</span>
              </div>
              
              {eventDetails.eventDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">
                    {new Date(eventDetails.eventDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {eventDetails.eventTime && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{eventDetails.eventTime}</span>
                </div>
              )}
              
              {eventDetails.guestCount && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{eventDetails.guestCount} guests</span>
                </div>
              )}
              
              {eventDetails.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{eventDetails.venue}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Estimated Total */}
        {(selectedPackage || services.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Estimated Total:</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ₹{estimatedTotal}K+
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              *Final pricing will be confirmed after consultation
            </p>
          </motion.div>
        )}

        {/* Empty State */}
        {!eventType && !selectedPackage && services.length === 0 && !eventDetails.eventName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-sm">Complete the steps to see your event summary</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
