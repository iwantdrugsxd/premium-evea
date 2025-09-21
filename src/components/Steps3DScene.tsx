'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

// Sequential Glow Path Component
const SequentialGlowPath = ({ activeStep }: { activeStep: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Calculate progress based on active step (0-4)
  const progress = Math.min(activeStep / 4, 1);

  return (
    <div ref={ref} className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 pointer-events-none">
      {/* Base line */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-sm" />
      
      {/* Sequential progress line */}
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 blur-sm"
        initial={{ width: 0 }}
        animate={{ width: isInView ? `${progress * 100}%` : "0%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 blur-md opacity-60"
        initial={{ width: 0 }}
        animate={{ width: isInView ? `${progress * 100}%` : "0%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Step indicators */}
      {[0, 1, 2, 3].map((step) => (
        <motion.div
          key={step}
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
          style={{ left: `${(step + 0.5) * 25}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: activeStep > step ? 1 : 0.5,
            opacity: activeStep > step ? 1 : 0.3
          }}
          transition={{ duration: 0.3, delay: step * 0.2 }}
        >
          <div className={`w-full h-full rounded-full ${
            activeStep > step 
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg shadow-purple-400/50' 
              : 'bg-gray-600'
          }`} />
        </motion.div>
      ))}
    </div>
  );
};

// User Context Hook for Personalization
const useUserContext = () => {
  const [userContext, setUserContext] = useState({
    eventType: 'general',
    preferences: []
  });

  useEffect(() => {
    // Simulate user context detection
    // In real app, this would come from user data, search history, etc.
    const detectUserContext = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const eventType = urlParams.get('event') || 'general';
      
      // Check for keywords in URL or localStorage
      const searchHistory = localStorage.getItem('searchHistory') || '';
      let detectedType = 'general';
      
      if (searchHistory.includes('wedding') || eventType === 'wedding') {
        detectedType = 'wedding';
      } else if (searchHistory.includes('corporate') || eventType === 'corporate') {
        detectedType = 'corporate';
      } else if (searchHistory.includes('birthday') || eventType === 'birthday') {
        detectedType = 'birthday';
      }
      
      setUserContext({
        eventType: detectedType,
        preferences: [detectedType]
      });
    };

    detectUserContext();
  }, []);

  return userContext;
};

// Confetti Component
const ConfettiBurst = ({ trigger }: { trigger: boolean }) => {
  if (!trigger) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981'][Math.floor(Math.random() * 4)]
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 1, 0],
            rotate: [0, 360],
            y: [0, -100],
            x: [0, (Math.random() - 0.5) * 200]
          }}
          transition={{ 
            duration: 2,
            delay: Math.random() * 0.5,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

// Glassmorphism Step Card Component
const StepCard = ({ 
  step, 
  title, 
  description, 
  index,
  isLast = false,
  onStepRevealed
}: {
  step: string;
  title: string;
  description: string;
  index: number;
  isLast?: boolean;
  onStepRevealed?: (stepIndex: number) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Audio for hover interaction (using Web Audio API for better performance)
  const playChime = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Fallback: silent if audio context fails
    }
  };

  useEffect(() => {
    if (isInView && onStepRevealed) {
      onStepRevealed(index);
    }
  }, [isInView, index, onStepRevealed]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowProgress(true);
    playChime();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowProgress(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.8 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`relative group cursor-pointer ${isLast ? 'scale-105' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glassmorphism Card */}
      <motion.div
        className="relative w-80 h-96 rounded-3xl backdrop-blur-xl border border-white/10 overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          boxShadow: isHovered 
            ? '0 25px 50px -12px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(236, 72, 153, 0.3)' 
            : '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
        }}
        animate={{
          y: isHovered ? -5 : 0,
          scale: isHovered ? 1.02 : 1
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
          style={{ 
            backgroundImage: `url(/event-creation-div/${step === '01' ? 'choose_your-event' : step === '02' ? 'we_call_you' : step === '03' ? 'we_execute' : 'we_share_your_story'}.png)` 
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Hover Glow Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-pink-500/10 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-8">
          {/* Progress Indicator */}
          <motion.div
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: showProgress ? 1 : 0,
              scale: showProgress ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-xs text-purple-300 font-medium">
              Step {index + 1} of 4
            </span>
          </motion.div>

          {/* Step Number */}
          <motion.div
            className="text-6xl font-black mb-4"
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              textShadow: isHovered 
                ? '0 0 20px rgba(236, 72, 153, 0.8)' 
                : '0 0 10px rgba(139, 92, 246, 0.5)'
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {step}
          </motion.div>
          
          {/* Title */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
        
        {/* Border Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))',
            padding: '1px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full h-full rounded-3xl bg-transparent" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Storytelling Quotes Component
const StorytellingQuote = ({ quote, isVisible }: { quote: string; isVisible: boolean }) => {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-8 py-4 border border-purple-500/30">
        <p className="text-white text-lg font-medium italic">
          "{quote}"
        </p>
        <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-3 rounded-full" />
      </div>
    </motion.div>
  );
};

// Floating Particles Background
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

// Main Steps Scene Component
const Steps3DScene = () => {
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const userContext = useUserContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Personalized content based on user context
  const getPersonalizedContent = () => {
    const baseSteps = [
      {
        step: "01",
        title: "Choose Your Event & Services",
        description: "Select your event type and services"
      },
      {
        step: "02", 
        title: "We Call You & Fine-tune",
        description: "We discuss and fine-tune everything"
      },
      {
        step: "03",
        title: "We Execute", 
        description: "Our team executes flawlessly"
      },
      {
        step: "04",
        title: "We Tell Your Story",
        description: "We capture and share your story"
      }
    ];

    const personalizedQuotes = {
      wedding: [
        "Your love story begins here",
        "Creating your perfect day",
        "Where forever starts",
        "Your happily ever after, captured"
      ],
      corporate: [
        "Professional excellence starts here",
        "Your success, our mission",
        "Where business meets brilliance",
        "Your achievement, perfectly documented"
      ],
      birthday: [
        "Your celebration starts here",
        "Making your day unforgettable",
        "Where joy comes alive",
        "Your happiness, beautifully captured"
      ],
      general: [
        "Every story starts here",
        "Your vision, our expertise",
        "Where dreams become reality",
        "Your moment, perfectly captured"
      ]
    };

    return {
      steps: baseSteps,
      quotes: personalizedQuotes[userContext.eventType as keyof typeof personalizedQuotes] || personalizedQuotes.general
    };
  };

  const { steps, quotes: motivationalQuotes } = getPersonalizedContent();

  const handleStepRevealed = (stepIndex: number) => {
    setActiveStep(stepIndex + 1);
    setCurrentQuote(stepIndex);
    
    // Trigger celebration for final step
    if (stepIndex === 3) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  if (!mounted) {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black overflow-hidden">
      {/* Background Particles */}
      <FloatingParticles />
      
      {/* Celebration Confetti */}
      <ConfettiBurst trigger={showCelebration} />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center text-white mb-20"
        >
          <div className="text-purple-400 text-lg font-semibold mb-4">How It Works</div>
          <h2 className="text-6xl md:text-8xl font-black mb-8">
            <span 
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
            >
              4 Steps
            </span>
            <br />
            to Your Perfect Event
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From planning to storytelling, we handle everything for your celebration
          </p>
        </motion.div>

        {/* Steps Container */}
        <div className="relative w-full max-w-7xl mx-auto px-6">
          {/* Sequential Glow Path */}
          <SequentialGlowPath activeStep={activeStep} />
          
          {/* Storytelling Quote */}
          <StorytellingQuote 
            quote={motivationalQuotes[currentQuote]} 
            isVisible={activeStep > 0} 
          />
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 items-center justify-items-center">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                step={step.step}
                title={step.title}
                description={step.description}
                index={index}
                isLast={index === steps.length - 1}
                onStepRevealed={handleStepRevealed}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Steps3DScene;
