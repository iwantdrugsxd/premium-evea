'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, DollarSign, MessageSquare, Star, CheckCircle, Clock, Users as UsersIcon } from 'lucide-react';

interface EventDetails {
  eventName: string;
  guestCount: number;
  location: string;
  specialRequirements: string;
  budget: string;
}

interface EventDetailsFormProps {
  onSubmit: (details: EventDetails) => void;
  initialData: EventDetails;
  selectedEvent: any;
  selectedPackage: any;
}

export default function EventDetailsForm({ onSubmit, initialData, selectedEvent, selectedPackage }: EventDetailsFormProps) {
  const [formData, setFormData] = useState<EventDetails>(initialData);
  const [errors, setErrors] = useState<Partial<EventDetails>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Partial<EventDetails> = {};
    if (!formData.eventName.trim()) newErrors.eventName = 'Please enter an event name';
    if (formData.guestCount < 10) newErrors.guestCount = 'Minimum 10 guests required';
    if (!formData.location.trim()) newErrors.location = 'Please enter event location';
    if (!formData.budget) newErrors.budget = 'Please select a budget range';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const handleInputChange = (field: keyof EventDetails, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const budgetOptions = [
    { value: '₹25K - ₹50K', label: '₹25K - ₹50K', description: 'Basic package with essential services' },
    { value: '₹50K - ₹1L', label: '₹50K - ₹1L', description: 'Standard package with premium services' },
    { value: '₹1L - ₹2.5L', label: '₹1L - ₹2.5L', description: 'Premium package with luxury services' },
    { value: '₹2.5L+', label: '₹2.5L+', description: 'Custom luxury package with all services' }
  ];

  const guestCountOptions = [
    { value: 10, label: '10-25', description: 'Intimate gathering' },
    { value: 50, label: '25-75', description: 'Medium event' },
    { value: 100, label: '75-150', description: 'Large celebration' },
    { value: 200, label: '150-300', description: 'Grand event' },
    { value: 500, label: '300+', description: 'Mega celebration' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full text-purple-300 text-sm mb-4 border border-purple-500/30"
        >
          <Calendar className="w-4 h-4" />
          <span>Step 3 of 6</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl lg:text-5xl font-bold text-white mb-4"
        >
          Event Details
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300 max-w-2xl mx-auto"
        >
          Tell us about your event requirements and we'll create a personalized plan just for you.
        </motion.p>
      </div>

      {/* Selected Event & Package Summary */}
      {(selectedEvent || selectedPackage) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Selection</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {selectedEvent && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{selectedEvent.icon}</span>
                  <h4 className="text-xl font-bold text-white">{selectedEvent.name}</h4>
                </div>
                <p className="text-gray-300 mb-3">{selectedEvent.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.serviceCategories?.slice(0, 4).map((service: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {selectedPackage && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="text-xl font-bold text-white mb-2">{selectedPackage.name}</h4>
                <p className="text-gray-300 mb-3">{selectedPackage.description}</p>
                <p className="text-2xl font-bold text-purple-400">{selectedPackage.price}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Event Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Event Name</h3>
          </div>
          
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => handleInputChange('eventName', e.target.value)}
            placeholder="Give your event a special name (e.g., 'Sarah's Sweet 16', 'Tech Summit 2024')"
            className={`w-full px-6 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 ${
              errors.eventName ? 'border-red-500/50' : 'border-white/10'
            }`}
          />
          {errors.eventName && (
            <p className="text-red-400 text-sm mt-2">{errors.eventName}</p>
          )}
        </motion.div>

        {/* Guest Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Number of Guests</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {guestCountOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInputChange('guestCount', option.value)}
                className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                  formData.guestCount === option.value
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                } border`}
              >
                <div className="text-2xl font-bold mb-2">{option.label}</div>
                <div className="text-sm text-gray-400">{option.description}</div>
              </button>
            ))}
          </div>
          {errors.guestCount && (
            <p className="text-red-400 text-sm mt-2">{errors.guestCount}</p>
          )}
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Event Location</h3>
          </div>
          
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter city, venue name, or specific address"
            className={`w-full px-6 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
              errors.location ? 'border-red-500/50' : 'border-white/10'
            }`}
          />
          {errors.location && (
            <p className="text-red-400 text-sm mt-2">{errors.location}</p>
          )}
        </motion.div>

        {/* Budget Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Budget Range</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInputChange('budget', option.value)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                  formData.budget === option.value
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                } border`}
              >
                <div className="text-xl font-bold mb-2">{option.label}</div>
                <div className="text-sm text-gray-400">{option.description}</div>
              </button>
            ))}
          </div>
          {errors.budget && (
            <p className="text-red-400 text-sm mt-2">{errors.budget}</p>
          )}
        </motion.div>

        {/* Special Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Special Requirements</h3>
          </div>
          
          <textarea
            value={formData.specialRequirements}
            onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
            placeholder="Tell us about your vision, theme, special requirements, or any questions you have..."
            rows={6}
            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 resize-none"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-center"
        >
          <button
            type="submit"
            className="px-12 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 rounded-2xl font-bold text-white text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Continue to Scheduling
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
