'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react';
import StepEventType from './EventPlannerSteps/StepEventType';
import StepPackage from './EventPlannerSteps/StepPackage';
import StepServices from './EventPlannerSteps/StepServices';
import StepEventDetails from './EventPlannerSteps/StepEventDetails';
import EventSummary from './EventPlannerSteps/EventSummary';

// Animation variants for step transitions
const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const stepTransition = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 }
};

// Progress bar animation
const progressVariants = {
  initial: { width: 0 },
  animate: (progress) => ({
    width: `${progress}%`,
    transition: { duration: 0.5, ease: "easeOut" }
  })
};

export default function EventPlannerWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  
  // Form state management
  const [formData, setFormData] = useState({
    eventType: null,
    package: null,
    services: [],
    eventDetails: {
      eventName: '',
      eventDate: '',
      eventTime: '',
      guestCount: '',
      venue: '',
      specialRequests: ''
    }
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  // Update form data
  const updateFormData = (stepData) => {
    setFormData(prev => ({
      ...prev,
      ...stepData
    }));
  };

  // Step validation
  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.eventType !== null;
      case 2:
        return formData.package !== null;
      case 3:
        return formData.services.length > 0;
      case 4:
        return formData.eventDetails.eventName && 
               formData.eventDetails.eventDate && 
               formData.eventDetails.guestCount;
      default:
        return false;
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepEventType
            selectedType={formData.eventType}
            onSelect={(eventType) => updateFormData({ eventType })}
          />
        );
      case 2:
        return (
          <StepPackage
            selectedPackage={formData.package}
            onSelect={(pkg) => updateFormData({ package: pkg })}
          />
        );
      case 3:
        return (
          <StepServices
            selectedServices={formData.services}
            onUpdate={(services) => updateFormData({ services })}
          />
        );
      case 4:
        return (
          <StepEventDetails
            eventDetails={formData.eventDetails}
            onUpdate={(eventDetails) => updateFormData({ eventDetails })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            Plan Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Perfect Event</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Let's create an unforgettable experience together. Follow these simple steps to plan your dream event.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Wizard Container */}
          <div className="flex-1">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-400">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-gray-400">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                  custom={progress}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="relative min-h-[600px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={stepTransition}
                  className="absolute inset-0"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                  ${currentStep === 1 
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                  }
                `}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </motion.button>

              <div className="flex items-center gap-4">
                {/* Mobile Summary Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSummary(!showSummary)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Summary
                </motion.button>

                {currentStep < totalSteps ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className={`
                      flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all
                      ${isStepValid(currentStep)
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                        : 'bg-white/5 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-green-500/25 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Event Planning
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Summary Sidebar */}
          <div className="hidden lg:block w-80">
            <EventSummary formData={formData} />
          </div>
        </div>

        {/* Mobile Summary Modal */}
        <AnimatePresence>
          {showSummary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setShowSummary(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Event Summary</h3>
                  <button
                    onClick={() => setShowSummary(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <EventSummary formData={formData} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
