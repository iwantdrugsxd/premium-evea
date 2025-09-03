'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CalendarDays, Clock3, Zap } from 'lucide-react';

interface SchedulingDetails {
  preferredDate: string;
  preferredTime: string;
  duration: string;
  flexibility: string;
}

interface SchedulingFormProps {
  onSubmit: (details: SchedulingDetails) => void;
  initialData: SchedulingDetails;
}

export default function SchedulingForm({ onSubmit, initialData }: SchedulingFormProps) {
  const [formData, setFormData] = useState<SchedulingDetails>(initialData);
  const [errors, setErrors] = useState<Partial<SchedulingDetails>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Partial<SchedulingDetails> = {};
    if (!formData.preferredDate) newErrors.preferredDate = 'Please select a preferred date';
    if (!formData.preferredTime) newErrors.preferredTime = 'Please select a preferred time';
    if (!formData.duration) newErrors.duration = 'Please select event duration';
    if (!formData.flexibility) newErrors.flexibility = 'Please select flexibility level';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const handleInputChange = (field: keyof SchedulingDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];

  const durationOptions = [
    { value: '2-3 hours', label: '2-3 hours', icon: Clock3 },
    { value: '4-6 hours', label: '4-6 hours', icon: Clock },
    { value: 'Full day', label: 'Full day (8+ hours)', icon: CalendarDays },
    { value: 'Multi-day', label: 'Multi-day event', icon: Calendar }
  ];

  const flexibilityOptions = [
    { value: 'exact', label: 'Exact date & time required', icon: Zap },
    { value: 'flexible-week', label: 'Flexible within a week', icon: Calendar },
    { value: 'flexible-month', label: 'Flexible within a month', icon: CalendarDays },
    { value: 'very-flexible', label: 'Very flexible - any time', icon: Clock }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full text-purple-300 text-sm mb-4 border border-purple-500/30"
        >
          <Calendar className="w-4 h-4" />
          <span>Step 5 of 6</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl lg:text-5xl font-bold text-white mb-4"
        >
          Schedule Your Event
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300 max-w-2xl mx-auto"
        >
          Choose your preferred date, time, and duration. We'll work with your schedule to make your event perfect.
        </motion.p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Date Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Preferred Date</h3>
          </div>
          
          <input
            type="date"
            value={formData.preferredDate}
            onChange={(e) => handleInputChange('preferredDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-6 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 ${
              errors.preferredDate ? 'border-red-500/50' : 'border-white/10'
            }`}
          />
          {errors.preferredDate && (
            <p className="text-red-400 text-sm mt-2">{errors.preferredDate}</p>
          )}
        </motion.div>

        {/* Time Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Preferred Time</h3>
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleInputChange('preferredTime', time)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  formData.preferredTime === time
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          {errors.preferredTime && (
            <p className="text-red-400 text-sm mt-2">{errors.preferredTime}</p>
          )}
        </motion.div>

        {/* Duration Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <Clock3 className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Event Duration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {durationOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('duration', option.value)}
                  className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                    formData.duration === option.value
                      ? 'bg-green-500/20 border-green-500/50 text-green-300'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  } border`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.duration && (
            <p className="text-red-400 text-sm mt-2">{errors.duration}</p>
          )}
        </motion.div>

        {/* Flexibility Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Schedule Flexibility</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flexibilityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('flexibility', option.value)}
                  className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                    formData.flexibility === option.value
                      ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  } border`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.flexibility && (
            <p className="text-red-400 text-sm mt-2">{errors.flexibility}</p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <button
            type="submit"
            className="px-12 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 rounded-2xl font-bold text-white text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Continue to Contact Details
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
