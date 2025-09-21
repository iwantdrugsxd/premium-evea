'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowLeft, CheckCircle } from 'lucide-react';

interface CallSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleCall: (scheduledTime: string) => void;
  formData: {
    eventType: string;
    selectedServices: string[];
    eventLocation: string;
    eventDate: string;
    guestCount: string;
    budget: string;
    additionalNotes: string;
    selectedPackage: string;
    userName: string;
    userPhone: string;
    userEmail: string;
  };
  requestId: string;
  isSubmitting: boolean;
}

export default function CallSchedulingModal({ 
  isOpen, 
  onClose, 
  onScheduleCall, 
  formData, 
  requestId,
  isSubmitting 
}: CallSchedulingModalProps) {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Generate time slots for the next 7 days
  const generateTimeSlots = () => {
    const slots = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const daySlots = [
        { time: '09:00', label: '9:00 AM', date: date.toISOString().split('T')[0] },
        { time: '10:00', label: '10:00 AM', date: date.toISOString().split('T')[0] },
        { time: '11:00', label: '11:00 AM', date: date.toISOString().split('T')[0] },
        { time: '14:00', label: '2:00 PM', date: date.toISOString().split('T')[0] },
        { time: '15:00', label: '3:00 PM', date: date.toISOString().split('T')[0] },
        { time: '16:00', label: '4:00 PM', date: date.toISOString().split('T')[0] },
        { time: '17:00', label: '5:00 PM', date: date.toISOString().split('T')[0] },
      ];
      
      slots.push(...daySlots);
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getServiceName = (service: string) => {
    const serviceMap: { [key: string]: string } = {
      'venue': 'Venue Booking',
      'coordination': 'Event Coordination',
      'catering': 'Catering',
      'photography': 'Photography',
      'decoration': 'Decoration',
      'music': 'Music & Entertainment',
      'transportation': 'Transportation',
      'invitations': 'Invitations',
      'livestream': 'Live Streaming',
      'security': 'Security Services',
      'guest-mgmt': 'Guest Management',
      'branding': 'Custom Branding',
      'valet': 'Valet Parking'
    };
    return serviceMap[service] || service;
  };

  const getPackageName = (packageType: string) => {
    const packageMap: { [key: string]: string } = {
      'basic': 'Basic Package (₹50,000+)',
      'professional': 'Professional Package (₹1,50,000+)',
      'premium': 'Premium Package (₹3,00,000+)'
    };
    return packageMap[packageType] || 'Not selected';
  };

  const formatBudget = (budget: string) => {
    if (!budget) return 'Not specified';
    return budget.replace('-', ' - ₹').replace('000000', ',00,000').replace('00000', ',00,000');
  };

  const handleScheduleCall = () => {
    if (selectedTime && selectedDate) {
      const scheduledDateTime = `${selectedDate}T${selectedTime}:00.000Z`;
      onScheduleCall(scheduledDateTime);
    }
  };

  const handleTimeSlotSelect = (time: string, date: string) => {
    setSelectedTime(time);
    setSelectedDate(date);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Package Ready!</h2>
                <p className="text-gray-400">Your custom package has been created successfully</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Package Summary */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Package Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Event Type:</span>
                <span className="text-white ml-2 capitalize">{formData.eventType}</span>
              </div>
              <div>
                <span className="text-gray-400">Package:</span>
                <span className="text-white ml-2">{getPackageName(formData.selectedPackage)}</span>
              </div>
              <div>
                <span className="text-gray-400">Location:</span>
                <span className="text-white ml-2">{formData.eventLocation || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-gray-400">Budget:</span>
                <span className="text-white ml-2">₹{formatBudget(formData.budget)}</span>
              </div>
              <div>
                <span className="text-gray-400">Guests:</span>
                <span className="text-white ml-2">{formData.guestCount || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-gray-400">Request ID:</span>
                <span className="text-white ml-2 font-mono">{requestId}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="text-gray-400">Selected Services:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.selectedServices.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                  >
                    {getServiceName(service)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Call Scheduling Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Schedule Your Consultation Call</h3>
            <p className="text-gray-400 mb-4">
              Choose a convenient time for our EVEA partners to call you and discuss your event requirements in detail.
            </p>
            
            {/* Time Slots Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
              {timeSlots.map((slot, index) => {
                const isSelected = selectedTime === slot.time && selectedDate === slot.date;
                return (
                  <button
                    key={index}
                    onClick={() => handleTimeSlotSelect(slot.time, slot.date)}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      isSelected
                        ? 'bg-purple-500 border-purple-400 text-white'
                        : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium">{slot.label}</div>
                    <div className="text-xs opacity-75">{formatDate(slot.date)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </button>
            
            <button
              onClick={handleScheduleCall}
              disabled={!selectedTime || !selectedDate || isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  Schedule Call with EVEA Partners
                </>
              )}
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300 text-sm">
              <strong>Note:</strong> Our team will call you at the selected time to discuss your event requirements, 
              provide detailed quotes, and answer any questions you may have. The call typically lasts 30-45 minutes.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

