'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Phone, MessageSquare, Send, Sparkles } from 'lucide-react';

interface EmailDetails {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface EmailFormProps {
  onSubmit: (details: EmailDetails) => void;
  initialData: EmailDetails;
}

export default function EmailForm({ onSubmit, initialData }: EmailFormProps) {
  const [formData, setFormData] = useState<EmailDetails>(initialData);
  const [errors, setErrors] = useState<Partial<EmailDetails>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Partial<EmailDetails> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.email.trim()) newErrors.email = 'Please enter your email';
    if (!formData.phone.trim()) newErrors.phone = 'Please enter your phone number';
    if (!formData.message.trim()) newErrors.message = 'Please enter a message';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof EmailDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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
          <Mail className="w-4 h-4" />
          <span>Step 6 of 6</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl lg:text-5xl font-bold text-white mb-4"
        >
          Contact Information
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300 max-w-2xl mx-auto"
        >
          Share your details so we can get in touch and start planning your perfect event together.
        </motion.p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Name Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Your Name</h3>
          </div>
          
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            className={`w-full px-6 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 ${
              errors.name ? 'border-red-500/50' : 'border-white/10'
            }`}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-2">{errors.name}</p>
          )}
        </motion.div>

        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Email Address</h3>
          </div>
          
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            className={`w-full px-6 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
              errors.email ? 'border-red-500/50' : 'border-white/10'
            }`}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-2">{errors.email}</p>
          )}
        </motion.div>

        {/* Phone Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Phone Number</h3>
          </div>
          
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter your phone number"
            className={`w-full px-6 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 ${
              errors.phone ? 'border-red-500/50' : 'border-white/10'
            }`}
          />
          {errors.phone && (
            <p className="text-red-400 text-sm mt-2">{errors.phone}</p>
          )}
        </motion.div>

        {/* Message Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Additional Message</h3>
          </div>
          
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Tell us more about your event vision, special requirements, or any questions you have..."
            rows={6}
            className={`w-full px-6 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 resize-none ${
              errors.message ? 'border-red-500/50' : 'border-white/10'
            }`}
          />
          {errors.message && (
            <p className="text-red-400 text-sm mt-2">{errors.message}</p>
          )}
        </motion.div>

        {/* Email Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Email Preview</h3>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <p className="text-gray-300 text-sm mb-2">
              <strong>To:</strong> vnair0795@gmail.com (Admin)
            </p>
            <p className="text-gray-300 text-sm mb-2">
              <strong>Subject:</strong> New Event Planning Request
            </p>
            <p className="text-gray-300 text-sm mb-4">
              <strong>From:</strong> {formData.name || 'Your Name'} ({formData.email || 'your@email.com'})
            </p>
            <div className="border-t border-white/10 pt-4">
              <p className="text-gray-300 text-sm">
                {formData.message || 'Your message will appear here...'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-12 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 rounded-2xl font-bold text-white text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 mx-auto"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sending Email...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Request & Continue
              </>
            )}
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
