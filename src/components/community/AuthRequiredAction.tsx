'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AuthRequiredActionProps {
  children: React.ReactNode;
  action: string;
  onAuthSuccess?: () => void;
}

export default function AuthRequiredAction({ children, action, onAuthSuccess }: AuthRequiredActionProps) {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData');
    
    if (token && user) {
      const userData = JSON.parse(user);
      // Check if phone number is missing (common with Google OAuth)
      const phoneNumber = userData.mobileNumber || userData.mobile_number || '';
      if (!phoneNumber.trim()) {
        // Show phone collection modal
        setShowAuthPrompt(true);
        return false;
      }
      return true;
    } else {
      // Show login prompt
      setShowAuthPrompt(true);
      return false;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!checkAuth()) {
      return;
    }
    
    // If authenticated, execute the original action
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  };

  const handleCloseAuthPrompt = () => {
    setShowAuthPrompt(false);
  };

  return (
    <>
      <div onClick={handleClick}>
        {children}
      </div>

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Login Required
              </h1>
              
              <p className="text-gray-400 mb-6">
                You need to be logged in to {action}.
              </p>
              
              <div className="space-y-4">
                <Link
                  href="/login"
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Login to Continue
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <Link
                  href="/signup"
                  className="w-full py-3 bg-white/10 border border-white/20 rounded-xl font-semibold text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Create Account
                </Link>
              </div>
              
              <button
                onClick={handleCloseAuthPrompt}
                className="mt-4 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
