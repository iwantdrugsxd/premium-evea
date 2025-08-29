'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface ConfirmationStepProps {
  form: any;
  onSubmit: (data: any) => void;
  onBack: () => void;
  loading: boolean;
  selectedEventType: string | null;
  selectedPackage: string | null;
}

export default function ConfirmationStep({ form, onSubmit, onBack, loading, selectedEventType, selectedPackage }: ConfirmationStepProps) {
  const { register, handleSubmit, formState: { errors }, watch } = form;
  const watchedValues = watch();

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
          Step 4 of 4
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          Schedule Your Consultation
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="section-description"
        >
          Final step to complete your event planning request
        </motion.p>
      </div>

      {/* Event Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Event Summary</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Event Type:</span>
            <span className="text-white ml-2">{selectedEventType}</span>
          </div>
          <div>
            <span className="text-gray-400">Location:</span>
            <span className="text-white ml-2">{watchedValues.location}</span>
          </div>
          <div>
            <span className="text-gray-400">Date:</span>
            <span className="text-white ml-2">{watchedValues.date}</span>
          </div>
          <div>
            <span className="text-gray-400">Budget:</span>
            <span className="text-white ml-2">₹{watchedValues.budget?.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Guests:</span>
            <span className="text-white ml-2">{watchedValues.guestCount}</span>
          </div>
          <div>
            <span className="text-gray-400">Package:</span>
            <span className="text-white ml-2">{selectedPackage}</span>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Address */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-white">
            Your Email Address
          </label>
          <input
            {...register('userEmail', { 
              required: 'Email address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
            type="email"
            placeholder="your.email@example.com"
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
          />
          {errors.userEmail && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm"
            >
              {errors.userEmail.message}
            </motion.div>
          )}
        </div>

        {/* Preferred Call Time */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-white">
            Preferred Call Time
          </label>
          <select
            {...register('scheduledTime', { required: 'Call time is required' })}
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
          >
            <option value="">Select a time slot</option>
            <option value="09:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
            <option value="17:00">5:00 PM</option>
            <option value="18:00">6:00 PM</option>
          </select>
          {errors.scheduledTime && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm"
            >
              {errors.scheduledTime.message}
            </motion.div>
          )}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center pt-4"
        >
          <p className="text-white/60 text-sm mb-4">
            Need immediate assistance? Contact us!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:admin@evea.com"
              className="btn-primary"
            >
              📧 Email Us
            </a>
            <a
              href="tel:+919876543210"
              className="btn-secondary"
            >
              📞 Call Us
            </a>
          </div>
        </motion.div>

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
            {loading ? 'Scheduling...' : 'Schedule Consultation'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
