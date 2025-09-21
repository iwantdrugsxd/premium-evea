'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, LogIn, UserPlus, ArrowRight } from 'lucide-react';

interface LoginPromptProps {
  onLoginSuccess: () => void;
}

export default function LoginPrompt({ onLoginSuccess }: LoginPromptProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData');
    
    if (token && user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
      onLoginSuccess();
    }
  }, [onLoginSuccess]);

  if (isLoggedIn && userData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Welcome back, {userData.full_name}!
        </h2>
        
        <p className="text-gray-400 mb-8 text-lg">
          You're all set to start planning your perfect event. Let's get started!
        </p>
        
        <motion.button
          onClick={onLoginSuccess}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-purple-500/40 transition-all flex items-center gap-3 mx-auto"
        >
          Continue to Event Planning
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <LogIn className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        Login Required
      </h2>
      
      <p className="text-gray-400 mb-8 text-lg leading-relaxed">
        To proceed with event planning, please sign in to your account or create a new one.
        <br />
        This helps us personalize your experience and save your event details.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/login"
            className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-purple-500/40 transition-all flex items-center gap-3"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </Link>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/signup"
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all flex items-center gap-3"
          >
            <UserPlus className="w-5 h-5" />
            Create Account
          </Link>
        </motion.div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <p className="text-blue-300 text-sm">
          <strong>Why do I need to login?</strong>
        </p>
        <ul className="text-blue-400 text-xs mt-2 space-y-1 text-left">
          <li>• Save your event planning progress</li>
          <li>• Receive personalized quotes and recommendations</li>
          <li>• Access your event history and bookings</li>
          <li>• Get priority customer support</li>
        </ul>
      </div>
    </motion.div>
  );
}
