'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Check } from 'lucide-react';

interface PhoneNumberCollectionProps {
  userData: any;
  onComplete: (phoneNumber: string, location: string) => void;
  onSkip: () => void;
}

export default function PhoneNumberCollection({ userData, onComplete, onSkip }: PhoneNumberCollectionProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);
    try {
      // Update user profile with phone number and location
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          mobileNumber: phoneNumber.trim(),
          location: location.trim()
        })
      });

      if (response.ok) {
        // Update localStorage with new data
        const updatedUserData = {
          ...userData,
          mobileNumber: phoneNumber.trim(),
          location: location.trim()
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        onComplete(phoneNumber.trim(), location.trim());
      } else {
        console.error('Failed to update profile');
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-gray-400">
            Hi {userData.fullName}! Please provide your phone number to complete your profile.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number Field */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Location Field */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
              Location (Optional)
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              placeholder="Enter your location"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!phoneNumber.trim() || isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating profile...
              </>
            ) : (
              <>
                Complete Profile
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Skip Button */}
        <div className="mt-6 text-center">
          <motion.button
            onClick={onSkip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Skip for now
          </motion.button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm">
            <strong>Why do we need your phone number?</strong>
          </p>
          <ul className="text-blue-400 text-xs mt-2 space-y-1">
            <li>• For consultation calls and event coordination</li>
            <li>• To send important updates about your event</li>
            <li>• For emergency contact during events</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
