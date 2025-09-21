'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Phone, Mail, MapPin, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import PhoneNumberCollection from './PhoneNumberCollection';

interface AuthGuardProps {
  children: React.ReactNode;
  formName: string;
  onAuthComplete?: () => void;
  showDebugInfo?: boolean;
}

export default function AuthGuard({ children, formName, onAuthComplete, showDebugInfo = false }: AuthGuardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showPhoneCollection, setShowPhoneCollection] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData');
    
    if (token && user) {
      const userData = JSON.parse(user);
      setUserData(userData);
      setIsLoggedIn(true);
      
      // Check if phone number is missing (common with Google OAuth)
      const phoneNumber = userData.mobileNumber || userData.mobile_number || '';
      if (!phoneNumber.trim()) {
        setShowPhoneCollection(true);
      } else {
        // User is fully authenticated
        onAuthComplete?.();
      }
    } else {
      setShowLoginPrompt(true);
    }
    setLoading(false);
  };

  const handleLoginSuccess = () => {
    checkAuthStatus();
  };

  const handlePhoneCollectionComplete = (phoneNumber: string, location: string) => {
    // Update user data with new phone number
    const updatedUserData = {
      ...userData,
      mobileNumber: phoneNumber,
      location: location
    };
    setUserData(updatedUserData);
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    
    // Hide phone collection form
    setShowPhoneCollection(false);
    
    // User is now fully authenticated
    onAuthComplete?.();
    
  };

  const handlePhoneCollectionSkip = () => {
    // Hide phone collection form but keep user logged in
    setShowPhoneCollection(false);
    
    // User is authenticated (even without phone)
    onAuthComplete?.();
    
  };

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (showLoginPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
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
              You need to be logged in to access the <strong>{formName}</strong> form.
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
              onClick={handleCloseLoginPrompt}
              className="mt-4 text-gray-400 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show phone collection if user is logged in but missing phone number
  if (showPhoneCollection && userData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <PhoneNumberCollection
          userData={userData}
          onComplete={handlePhoneCollectionComplete}
          onSkip={handlePhoneCollectionSkip}
        />
      </div>
    );
  }

  // Show debug info if enabled
  if (showDebugInfo && userData) {
    return (
      <div className="min-h-screen p-4">
        {/* Debug Panel */}
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <h3 className="text-yellow-400 font-bold mb-2">Debug Info:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-yellow-300 font-semibold">Logged In: {isLoggedIn ? 'Yes' : 'No'}</p>
              <pre className="text-yellow-200 mt-2 overflow-auto">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-yellow-300 font-semibold">Form Data:</p>
              <pre className="text-yellow-200 mt-2 overflow-auto">
                {JSON.stringify({
                  userName: userData?.fullName || userData?.full_name || '',
                  userPhone: userData?.mobileNumber || userData?.mobile_number || '',
                  userEmail: userData?.email || ''
                }, null, 2)}
              </pre>
            </div>
          </div>
          <button
            onClick={checkAuthStatus}
            className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Refresh User Data
          </button>
        </div>
        
        {/* Render the protected content */}
        {children}
      </div>
    );
  }

  // User is fully authenticated, render the protected content
  return <>{children}</>;
}
