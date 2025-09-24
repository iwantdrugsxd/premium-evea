'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Calendar, MessageCircle, Mic, Sparkles } from 'lucide-react';

// Step Card Component
function StepCard({ step, index, isActive, isInView, progress }) {
  const stepData = {
    0: {
      title: "Plan",
      description: "Choose your event type and select the services you need for your perfect celebration.",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500"
    },
    1: {
      title: "Communicate",
      description: "We call you within 24 hours to understand your vision, budget, and preferences in detail.",
      icon: MessageCircle,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-500"
    },
    2: {
      title: "Celebrate",
      description: "Our team coordinates everything and brings your event to life with perfect execution.",
      icon: Mic,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500"
    },
    3: {
      title: "Remember",
      description: "We capture the moments and help you share your celebration with the world.",
      icon: Sparkles,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-500"
    }
  };

  const data = stepData[step];
  const IconComponent = data.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isInView ? 1 : 0.7,
        y: isInView ? 0 : 20,
        scale: isActive ? 1.05 : 1
      }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex flex-col items-center text-center"
    >
      {/* Step Number */}
      <motion.div
        animate={{ 
          scale: isActive ? 1.1 : 1,
          boxShadow: isActive 
            ? `0 0 20px ${data.bgColor.replace('bg-', 'rgba(').replace('-500', ', 0.5)')}`
            : 'none'
        }}
        transition={{ duration: 0.3 }}
        className={`relative w-20 h-20 ${data.bgColor} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
      >
        {/* Icon */}
        <IconComponent className="w-10 h-10 text-white" />
        
        {/* Step Number Badge */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
          <span className="text-xs font-bold text-gray-800">{step + 1}</span>
        </div>
      </motion.div>

      {/* Step Title */}
      <motion.h3 
        className="text-lg font-bold mb-2 text-white"
        animate={{ 
          color: isActive ? '#ffffff' : '#e5e7eb'
        }}
        transition={{ duration: 0.3 }}
      >
        {data.title}
      </motion.h3>
      
      {/* Step Description */}
      <motion.p 
        className="text-sm text-gray-400 leading-relaxed max-w-[200px]"
        animate={{ 
          color: isActive ? '#d1d5db' : '#9ca3af'
        }}
        transition={{ duration: 0.3 }}
      >
        {data.description}
      </motion.p>
    </motion.div>
  );
}

// Arrow Component
function Arrow({ isActive, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ 
        opacity: isActive ? 1 : 0.5,
        x: 0
      }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-center justify-center mx-4"
    >
      <svg 
        className="w-6 h-6 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 5l7 7-7 7" 
        />
      </svg>
    </motion.div>
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
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-8 text-white">
            4 STEPS TO YOUR<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              PERFECT EVENT
            </span>
          </h2>
        </motion.div>

        {/* Steps Container - Horizontal Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4">
          {steps.map((step, index) => {
            const ref = useRef();
            const isInView = useInView(ref, { 
              threshold: 0.3,
              margin: "-50px 0px -50px 0px"
            });
            
            return (
              <React.Fragment key={step}>
                <div ref={ref} className="flex-shrink-0">
                  <StepCard
                    step={step}
                    index={index}
                    isActive={activeStep === step}
                    isInView={isInView}
                    progress={progress}
                  />
                </div>
                {/* Arrow between steps (except last one) */}
                {index < steps.length - 1 && (
                  <Arrow 
                    isActive={activeStep > index} 
                    index={index}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-300 font-medium">
            Plan, Communicate, Celebrate, Remember – your event journey starts here!
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">
              Step {activeStep + 1} of 4 - {activeStep === 0 ? 'Plan' : 
              activeStep === 1 ? 'Communicate' : 
              activeStep === 2 ? 'Celebrate' : 'Remember'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
