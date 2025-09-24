'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Calendar, MessageCircle, Mic, Sparkles } from 'lucide-react';

// Step Card Component - Redesigned to match the infographic style
function StepCard({ step, index, isActive, isInView }) {
  const stepData = {
    0: {
      title: "Plan",
      description: "Choose your event type and share your vision with us",
      icon: Calendar,
      color: "#3B82F6", // Blue
      bgColor: "#EFF6FF"
    },
    1: {
      title: "Communicate", 
      description: "We call you to understand your requirements and preferences",
      icon: MessageCircle,
      color: "#14B8A6", // Teal
      bgColor: "#F0FDFA"
    },
    2: {
      title: "Celebrate",
      description: "Your perfect event comes to life with our expert coordination",
      icon: Mic,
      color: "#F97316", // Orange
      bgColor: "#FFF7ED"
    },
    3: {
      title: "Remember",
      description: "Capture and share your beautiful moments forever",
      icon: Sparkles,
      color: "#EAB308", // Yellow
      bgColor: "#FEFCE8"
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
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center text-center"
    >
      {/* Step Square */}
      <div 
        className="relative w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-all duration-300"
        style={{ 
          backgroundColor: data.bgColor,
          transform: isActive ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        <IconComponent 
          className="w-10 h-10" 
          style={{ color: data.color }}
        />
        
        {/* Step Number */}
        <div 
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: data.color }}
        >
          {step + 1}
        </div>
      </div>

      {/* Step Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {data.title}
      </h3>

      {/* Step Description */}
      <p className="text-sm text-gray-600 max-w-32 leading-relaxed">
        {data.description}
      </p>
    </motion.div>
  );
}

// Arrow Component for connecting steps
function ArrowConnector({ isActive }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: isActive ? 1 : 0.5, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center"
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        className="text-gray-400"
      >
        <path 
          d="M9 18L15 12L9 6" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

export default function ProcessStepper() {
  const containerRef = useRef();
  const [activeStep, setActiveStep] = useState(0);
  
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
    });

    return unsubscribe;
  }, [scrollYProgress]);

  const steps = [0, 1, 2, 3];

  return (
    <section ref={containerRef} className="relative py-32 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-8 text-gray-900">
            4 STEPS TO YOUR PERFECT EVENT
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
                  />
                </div>
                
                {/* Arrow between steps (except for last step) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block">
                    <ArrowConnector isActive={activeStep >= index} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 font-medium">
            Plan, Communicate, Celebrate, Remember – your event journey starts here!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
