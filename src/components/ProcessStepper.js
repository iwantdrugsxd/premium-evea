'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Calendar, Phone, CheckCircle, Share2 } from 'lucide-react';

// Step Card Component
function StepCard({ step, index, isActive, isInView, progress }) {
  const stepData = {
    0: {
      title: "Choose Your Event",
      description: "Select from our curated event types or describe your unique vision. Our AI-powered system matches you with the perfect package.",
      icon: Calendar,
      color: "from-purple-500 to-purple-600"
    },
    1: {
      title: "We Call You",
      description: "Within 24 hours, our expert event manager calls you to understand your requirements, budget, and preferences in detail.",
      icon: Phone,
      color: "from-pink-500 to-pink-600"
    },
    2: {
      title: "Perfect Planning",
      description: "Our team creates a detailed timeline, coordinates with verified vendors, and handles every aspect of your event planning.",
      icon: CheckCircle,
      color: "from-blue-500 to-blue-600"
    },
    3: {
      title: "Celebrate & Share",
      description: "Your event comes to life! We capture the moments and help you share your celebration with the world.",
      icon: Share2,
      color: "from-green-500 to-green-600"
    }
  };

  const data = stepData[step];
  const IconComponent = data.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ 
        opacity: isInView ? 1 : 0.3,
        x: isInView ? 0 : 50,
        scale: isActive ? 1.02 : 1
      }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`
        relative p-8 rounded-3xl backdrop-blur-sm border transition-all duration-500
        ${isActive 
          ? 'bg-white/10 border-white/20 shadow-lg shadow-purple-500/20' 
          : 'bg-white/5 border-white/10'
        }
      `}
      style={{
        boxShadow: isActive 
          ? '0 0 30px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)' 
          : 'none'
      }}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: -12 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center z-10"
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
      )}

      <div className="flex items-start space-x-4">
        {/* Icon Container */}
        <div className="relative flex-shrink-0">
          {/* Icon Background Glow */}
          {isActive && (
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${data.color} rounded-2xl blur-lg opacity-50`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          
          {/* Icon */}
          <motion.div
            animate={{ 
              scale: isActive ? 1.1 : 1,
              rotate: isActive ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              scale: { duration: 0.3 },
              rotate: { duration: 0.6, delay: 0.2 }
            }}
            className={`relative p-3 rounded-2xl bg-gradient-to-r ${data.color} flex-shrink-0`}
          >
            <IconComponent className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <motion.h3 
            className="text-2xl font-bold mb-3 text-white"
            animate={{ 
              color: isActive ? '#ffffff' : '#e5e7eb'
            }}
            transition={{ duration: 0.3 }}
          >
            {data.title}
          </motion.h3>
          
          <motion.p 
            className="text-gray-300 leading-relaxed"
            animate={{ 
              color: isActive ? '#d1d5db' : '#9ca3af'
            }}
            transition={{ duration: 0.3 }}
          >
            {data.description}
          </motion.p>
          
          {/* Step number */}
          <motion.div 
            className="mt-4 text-sm text-gray-400"
            animate={{ 
              color: isActive ? '#8B5CF6' : '#6b7280'
            }}
            transition={{ duration: 0.3 }}
          >
            Step {step + 1} of 4
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Connecting Line Component
function ConnectingLine({ progress, totalSteps = 4 }) {
  return (
    <div className="absolute left-8 top-0 bottom-0 w-1 hidden lg:block">
      {/* Background line */}
      <div className="absolute inset-0 bg-white/10 rounded-full" />
      
      {/* Animated progress line */}
      <motion.div
        className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 rounded-full origin-top"
        animate={{ height: `${progress * 100}%` }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Step dots */}
      {Array.from({ length: totalSteps }, (_, index) => (
        <motion.div
          key={index}
          className={`absolute w-4 h-4 rounded-full border-2 ${
            index <= Math.floor(progress * (totalSteps - 1))
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent'
              : 'bg-transparent border-white/30'
          }`}
          style={{ top: `${(index / (totalSteps - 1)) * 100}%`, left: '-6px' }}
          animate={{
            scale: index <= Math.floor(progress * (totalSteps - 1)) ? 1.2 : 1,
            boxShadow: index <= Math.floor(progress * (totalSteps - 1)) 
              ? '0 0 20px rgba(139, 92, 246, 0.5)' 
              : 'none'
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

export default function ProcessStepper() {
  const containerRef = useRef();
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Calculate active step based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const stepProgress = latest * 4; // 4 steps total
      const currentStep = Math.min(Math.floor(stepProgress), 3);
      setActiveStep(currentStep);
      setProgress(stepProgress / 4);
    });

    return unsubscribe;
  }, [scrollYProgress]);

  const steps = [0, 1, 2, 3];

  return (
    <section ref={containerRef} className="relative py-32 px-6 lg:px-8 bg-black/50">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full mb-8">
            <span className="text-purple-300 text-sm font-medium">How It Works</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-8">
            4 Steps to Your<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Perfect Event
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our streamlined process ensures your event planning is effortless and stress-free. 
            From concept to celebration, we handle every detail.
          </p>
        </motion.div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting Line */}
          <ConnectingLine progress={progress} totalSteps={4} />
          
          {/* Steps */}
          <div className="space-y-8 pl-16 lg:pl-20">
            {steps.map((step, index) => {
              const ref = useRef();
              const isInView = useInView(ref, { 
                threshold: 0.3,
                margin: "-100px 0px -100px 0px"
              });
              
              return (
                <div key={step} ref={ref}>
                  <StepCard
                    step={step}
                    index={index}
                    isActive={activeStep === step}
                    isInView={isInView}
                    progress={progress}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">
              Step {activeStep + 1} of 4 - {activeStep === 0 ? 'Choose Your Event' : 
              activeStep === 1 ? 'We Call You' : 
              activeStep === 2 ? 'Perfect Planning' : 'Celebrate & Share'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
