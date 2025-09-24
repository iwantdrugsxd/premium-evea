'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Star, Users, Calendar, Award, CheckCircle, Play, Sparkles, Heart, Crown, Zap, Camera, Utensils, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ProcessStepper from '@/components/ProcessStepper';
import PricingSection from '@/components/PricingSection';
import VendorCardsSection from '@/components/VendorCardsSection';
import TestimonialsMarquee from '@/components/TestimonialsMarquee';
import EventPlannerWizard from '@/components/EventPlannerWizard';

export default function HomePage() {
  const router = useRouter();

  const handleStartPlanning = () => {
    router.push('/plan-event');
  };

  const handleScheduleCall = () => {
    // You can implement a modal or redirect to a contact form
    console.log('Schedule a call clicked');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Process Stepper Section */}
      <ProcessStepper />

      {/* Packages Section */}
      <PricingSection />

      {/* Vendor Cards Section */}
      <VendorCardsSection />

      {/* Community Section */}
      {/* <TestimonialsMarquee /> */}

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              Ready to Create <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Magic?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Let's turn your vision into an unforgettable reality. Our team is ready to bring your dreams to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartPlanning}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                Start Planning
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleScheduleCall}
                className="px-8 py-4 bg-white/5 border-2 border-white/10 rounded-2xl font-semibold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <Phone className="w-4 h-4" />
                Schedule a Call
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Free Consultation
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                No Hidden Fees
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                24/7 Support
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}