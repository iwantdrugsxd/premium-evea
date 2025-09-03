'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Phone, Mail, MapPin, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ConfirmationData {
  eventType: string;
  location: string;
  date: string;
  budget: number;
  guestCount: number;
  scheduledTime: string;
  userEmail: string;
  package: string;
}

export default function PlanEventConfirmation() {
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get confirmation data from localStorage or URL params
    const getConfirmationData = () => {
      try {
        // Try to get from localStorage first
        const stored = localStorage.getItem('planEventConfirmation');
        if (stored) {
          const data = JSON.parse(stored);
          setConfirmationData(data);
          setLoading(false);
          return;
        }

        // Try to get from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const eventRequestId = urlParams.get('event_request_id');
        
        if (eventRequestId) {
          // Fetch confirmation data from API
          fetchConfirmationData(eventRequestId);
        } else {
          setError('No confirmation data found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting confirmation data:', error);
        setError('Failed to load confirmation data');
        setLoading(false);
      }
    };

    getConfirmationData();
  }, []);

  const fetchConfirmationData = async (eventRequestId: string) => {
    try {
      const response = await fetch(`/api/event-requests/${eventRequestId}/confirmation`);
      const data = await response.json();

      if (data.success) {
        setConfirmationData(data.confirmation);
        // Store in localStorage for future reference
        localStorage.setItem('planEventConfirmation', JSON.stringify(data.confirmation));
      } else {
        setError(data.error || 'Failed to fetch confirmation data');
      }
    } catch (error) {
      console.error('Error fetching confirmation data:', error);
      setError('Failed to fetch confirmation data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="text-white mt-4">Loading your confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !confirmationData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-gray-300 mb-8">{error || 'No confirmation data found'}</p>
          <Link 
            href="/plan-event"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Plan Event
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Liquid Background */}
      <div className="liquid-bg">
        <div className="liquid-blob blob1"></div>
        <div className="liquid-blob blob2"></div>
        <div className="liquid-blob blob3"></div>
        <div className="liquid-blob blob4"></div>
        <div className="liquid-blob blob5"></div>
      </div>
      
      {/* Grid Overlay */}
      <div className="grid-overlay"></div>

      {/* Grain Overlay */}
      <div className="grain"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl w-full"
        >
          {/* Success Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold text-white mb-4"
            >
              🎉 Confirmation Successful!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-300"
            >
              Your event planning request has been confirmed
            </motion.p>
          </div>

          {/* Confirmation Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
          >
            {/* Event Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-pink-400" />
                Event Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-gray-400 w-24">Event Type:</span>
                    <span className="text-white font-semibold capitalize">{confirmationData.eventType}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-pink-400 mr-3" />
                    <span className="text-white">{confirmationData.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-pink-400 mr-3" />
                    <span className="text-white">
                      {new Date(confirmationData.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-gray-400 w-24">Budget:</span>
                    <span className="text-white font-semibold">₹{confirmationData.budget.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-400 w-24">Guests:</span>
                    <span className="text-white font-semibold">{confirmationData.guestCount}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-400 w-24">Package:</span>
                    <span className="text-white font-semibold capitalize">{confirmationData.package}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Call Schedule */}
            <div className="mb-8 p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl border border-pink-500/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-3 text-pink-400" />
                Consultation Call Scheduled
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-pink-400 mr-3" />
                  <span className="text-white">
                    {new Date(confirmationData.scheduledTime).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-pink-400 mr-3" />
                  <span className="text-white">{confirmationData.userEmail}</span>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <p className="text-yellow-200 text-sm">
                  💡 Our team will call you at the scheduled time to discuss your event details and answer any questions you may have.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">What's Next?</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <p className="text-gray-300">You'll receive a confirmation email with all the details</p>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <p className="text-gray-300">Our team will call you at the scheduled time</p>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <p className="text-gray-300">We'll discuss your requirements and create a customized plan</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl text-center font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
              >
                Back to Home
              </Link>
              
              <Link
                href="/plan-event"
                className="flex-1 bg-white/10 text-white py-3 px-6 rounded-xl text-center font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Plan Another Event
              </Link>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-gray-400 text-sm">
              Need help? Contact us at{' '}
              <a href="mailto:support@evea.com" className="text-pink-400 hover:text-pink-300">
                support@evea.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
