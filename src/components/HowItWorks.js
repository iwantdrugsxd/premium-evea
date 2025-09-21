'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Calendar, Phone, CheckCircle, Share2, ArrowRight } from 'lucide-react';

// Visual Element Component
function VisualElement({ activeStep }) {
  const visualComponents = {
    0: <Calendar className="w-32 h-32 text-purple-400" />,
    1: <Phone className="w-32 h-32 text-pink-400" />,
    2: <CheckCircle className="w-32 h-32 text-blue-400" />,
    3: <Share2 className="w-32 h-32 text-green-400" />
  };

  return (
    <motion.div
      key={activeStep}
      initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="flex items-center justify-center h-96 w-full"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl scale-150" />
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex items-center justify-center">
          {visualComponents[activeStep]}
        </div>
      </div>
    </motion.div>
  );
}

// Progress Indicator Component
function ProgressIndicator({ progress }) {
  const steps = [0, 1, 2, 3];
  
  return (
    <div className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-0 left-6 w-1 h-full bg-white/10 rounded-full" />
        
        {/* Animated progress line */}
        <motion.div
          className="absolute top-0 left-6 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"
          style={{ height: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Step dots */}
        {steps.map((step, index) => (
          <motion.div
            key={step}
            className={`absolute w-4 h-4 rounded-full border-2 ${
              index <= Math.floor(progress * 3)
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent'
                : 'bg-transparent border-white/30'
            }`}
            style={{ top: `${(index / 3) * 100}%`, left: '2px' }}
            animate={{
              scale: index <= Math.floor(progress * 3) ? 1.2 : 1,
              boxShadow: index <= Math.floor(progress * 3) 
                ? '0 0 20px rgba(139, 92, 246, 0.5)' 
                : 'none'
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}

// Step Card Component
function StepCard({ step, index, isActive, isInView }) {
  const stepData = {
    0: {
      title: "Choose Your Event",
      description: "Select from our curated event types or describe your unique vision. Our AI-powered system matches you with the perfect package.",
      icon: <Calendar className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600"
    },
    1: {
      title: "We Call You",
      description: "Within 24 hours, our expert event manager calls you to understand your requirements, budget, and preferences in detail.",
      icon: <Phone className="w-8 h-8" />,
      color: "from-pink-500 to-pink-600"
    },
    2: {
      title: "Perfect Planning",
      description: "Our team creates a detailed timeline, coordinates with verified vendors, and handles every aspect of your event planning.",
      icon: <CheckCircle className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600"
    },
    3: {
      title: "Celebrate & Share",
      description: "Your event comes to life! We capture the moments and help you share your celebration with the world.",
      icon: <Share2 className="w-8 h-8" />,
      color: "from-green-500 to-green-600"
    }
  };

  const data = stepData[step];

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
        relative p-8 rounded-3xl backdrop-blur-sm border transition-all duration-300
        ${isActive 
          ? 'bg-white/10 border-white/20 shadow-lg shadow-purple-500/10' 
          : 'bg-white/5 border-white/10'
        }
      `}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
      )}

      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-r ${data.color} flex-shrink-0`}>
          {data.icon}
        </div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-3 text-white">
            {data.title}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {data.description}
          </p>
          
          {/* Step number */}
          <div className="mt-4 text-sm text-gray-400">
            Step {step + 1} of 4
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
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
      <div className="max-w-7xl mx-auto">
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Visual Element (Sticky) */}
          <div className="sticky top-32 hidden lg:block">
            <VisualElement activeStep={activeStep} />
          </div>

          {/* Right Column - Steps */}
          <div className="space-y-8">
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
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Visual Element */}
        <div className="lg:hidden mt-16">
          <VisualElement activeStep={activeStep} />
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator progress={progress} />

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 mx-auto"
          >
            Start Your Event Journey
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
