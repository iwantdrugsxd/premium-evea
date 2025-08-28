'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Clock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VendorOnboardingSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="gradient-bg"></div>
      
      <div className="flex items-center justify-center min-h-screen px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-24 h-24 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
            </motion.div>

            {/* Success Message */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Application <span className="gradient-text">Submitted!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-400 mb-8"
            >
              Thank you for applying to join our vendor network. We're excited to review your application!
            </motion.p>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6 mb-12"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Review Process</h3>
                  <p className="text-gray-400">We'll review your application within 2-3 business days</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-pink-500/20 border border-pink-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email Notification</h3>
                  <p className="text-gray-400">You'll receive an email with our decision and next steps</p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => router.push('/')}
                className="flex-1 py-4 px-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                Back to Home
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => router.push('/marketplace')}
                className="flex-1 py-4 px-8 border-2 border-white/10 rounded-xl text-white hover:border-purple-500 transition-all"
              >
                Browse Marketplace
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
