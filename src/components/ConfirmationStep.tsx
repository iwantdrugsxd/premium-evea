'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Calendar, MapPin, Users, DollarSign, Clock, Star, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';

interface EventDetails {
  eventName: string;
  guestCount: number;
  location: string;
  specialRequirements: string;
  budget: string;
}

interface SchedulingDetails {
  preferredDate: string;
  preferredTime: string;
  duration: string;
  flexibility: string;
}

interface EmailDetails {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ConfirmationStepProps {
  eventDetails: EventDetails;
  schedulingDetails: SchedulingDetails;
  emailDetails: EmailDetails;
  selectedEvent: any;
  selectedPackage: any;
  emailSent: boolean;
  onReset: () => void;
}

export default function ConfirmationStep({ 
  eventDetails, 
  schedulingDetails, 
  emailDetails, 
  selectedEvent, 
  selectedPackage, 
  emailSent, 
  onReset 
}: ConfirmationStepProps) {
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
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full text-green-300 text-sm mb-4 border border-green-500/30"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Step 6 of 6 - Complete!</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl lg:text-5xl font-bold text-white mb-4"
        >
          {emailSent ? 'Request Submitted!' : 'Review & Confirm'}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300 max-w-2xl mx-auto"
        >
          {emailSent 
            ? 'Your event planning request has been sent successfully! We\'ll get back to you soon.'
            : 'Please review all the details before we send your request to our team.'
          }
        </motion.p>
      </div>

      {/* Success Message */}
      {emailSent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-3xl p-8 mb-8 text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Email Sent Successfully!</h3>
          <p className="text-green-300 mb-4">
            Your request has been sent to <strong>vnair0795@gmail.com</strong>
          </p>
          <p className="text-gray-300">
            Our team will review your requirements and get back to you within 24-48 hours.
          </p>
        </motion.div>
      )}

      {/* Complete Event Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Complete Event Summary</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Event Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Event Information</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Event Name:</span>
                <span className="text-white font-semibold">{eventDetails.eventName}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Event Type:</span>
                <span className="text-white font-semibold">{selectedEvent?.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Package:</span>
                <span className="text-white font-semibold">{selectedPackage?.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Budget:</span>
                <span className="text-white font-semibold">{eventDetails.budget}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Guest Count:</span>
                <span className="text-white font-semibold">{eventDetails.guestCount}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Location:</span>
                <span className="text-white font-semibold">{eventDetails.location}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Scheduling & Contact */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Scheduling & Contact</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Preferred Date:</span>
                <span className="text-white font-semibold">{schedulingDetails.preferredDate}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Preferred Time:</span>
                <span className="text-white font-semibold">{schedulingDetails.preferredTime}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white font-semibold">{schedulingDetails.duration}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Flexibility:</span>
                <span className="text-white font-semibold">{schedulingDetails.flexibility}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Contact Name:</span>
                <span className="text-white font-semibold">{emailDetails.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Email:</span>
                <span className="text-white font-semibold">{emailDetails.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Phone:</span>
                <span className="text-white font-semibold">{emailDetails.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Special Requirements */}
        {eventDetails.specialRequirements && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-pink-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Special Requirements</h4>
            </div>
            <p className="text-gray-300 bg-white/5 rounded-2xl p-4 border border-white/10">
              {eventDetails.specialRequirements}
            </p>
          </div>
        )}

        {/* Additional Message */}
        {emailDetails.message && (
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Additional Message</h4>
            </div>
            <p className="text-gray-300 bg-white/5 rounded-2xl p-4 border border-white/10">
              {emailDetails.message}
            </p>
          </div>
        )}
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 mb-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">What Happens Next?</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-purple-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Email Confirmation</h4>
            <p className="text-gray-300 text-sm">You'll receive a confirmation email within minutes</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Team Review</h4>
            <p className="text-gray-300 text-sm">Our experts will review your requirements within 24-48 hours</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="w-8 h-8 text-green-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Personalized Plan</h4>
            <p className="text-gray-300 text-sm">We'll create a customized event plan just for you</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center space-y-4"
      >
        {emailSent ? (
          <div className="space-y-4">
            <p className="text-gray-300">
              Thank you for choosing us for your event planning needs!
            </p>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl font-semibold text-white hover:bg-white/10 transition-all duration-300"
            >
              <RefreshCw className="w-5 h-5" />
              Plan Another Event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300">
              All set! Click the button below to send your request to our team.
            </p>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 rounded-2xl font-bold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              Send Request to Admin
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
