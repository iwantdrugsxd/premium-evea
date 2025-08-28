'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';

interface EventDetailsFormProps {
  form: any;
  onSubmit: (data: any) => void;
  onBack: () => void;
  loading: boolean;
  selectedEventType: string | null;
}

export default function EventDetailsForm({ form, onSubmit, onBack, loading, selectedEventType }: EventDetailsFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  const budget = watch('budget');
  const guestCount = watch('guestCount');

  const formatBudget = (value: number) => {
    if (value >= 1000000) {
      return `₹${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}K`;
    }
    return `₹${value}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8"
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-label"
        >
          Step 2 of 4
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          Event Details
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="section-description"
        >
          Tell us about your event requirements
        </motion.p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Location */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-white">
            <MapPin className="w-4 h-4 inline mr-2" />
            Event Location
          </label>
          <div className="relative">
            <input
              {...register('location', { required: 'Location is required' })}
              type="text"
              placeholder="Enter city or venue name"
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            />
            {errors.location && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-2"
              >
                {errors.location.message}
              </motion.div>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-white">
            <Calendar className="w-4 h-4 inline mr-2" />
            Event Date
          </label>
          <div className="relative">
            <input
              {...register('date', { required: 'Date is required' })}
              type="datetime-local"
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            />
            {errors.date && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-2"
              >
                {errors.date.message}
              </motion.div>
            )}
          </div>
        </div>

        {/* Budget Slider */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-white">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Budget Range
          </label>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Your Budget:</span>
              <motion.span
                key={budget}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold gradient-text"
              >
                {formatBudget(budget)}
              </motion.span>
            </div>
            <input
              {...register('budget', { 
                required: 'Budget is required',
                min: { value: 10000, message: 'Minimum budget is ₹10K' },
                max: { value: 10000000, message: 'Maximum budget is ₹1Cr' }
              })}
              type="range"
              min="10000"
              max="10000000"
              step="10000"
              className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
            />
            {errors.budget && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm"
              >
                {errors.budget.message}
              </motion.div>
            )}
          </div>
        </div>

        {/* Guest Count */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-white">
            <Users className="w-4 h-4 inline mr-2" />
            Number of Guests
          </label>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Guest Count:</span>
              <motion.span
                key={guestCount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold gradient-text"
              >
                {guestCount}
              </motion.span>
            </div>
            <input
              {...register('guestCount', { 
                required: 'Guest count is required',
                min: { value: 10, message: 'Minimum 10 guests' },
                max: { value: 1000, message: 'Maximum 1000 guests' }
              })}
              type="range"
              min="10"
              max="1000"
              step="10"
              className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
            />
            {errors.guestCount && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm"
              >
                {errors.guestCount.message}
              </motion.div>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-white">
            Additional Notes (Optional)
          </label>
          <textarea
            {...register('additionalNotes')}
            rows={4}
            placeholder="Tell us about your vision, theme, or any special requirements..."
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-8">
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary flex-1"
          >
            Back
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Continue'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
