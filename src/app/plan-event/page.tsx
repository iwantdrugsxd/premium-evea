'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Calendar, MapPin, Users, DollarSign, Star, CheckCircle, ArrowRight, ArrowLeft, Sparkles, Heart, Building, Cake, Gift, Music, Zap } from 'lucide-react';
import EventTypeSelection from '@/components/EventTypeSelection';
import EventDetailsForm from '@/components/EventDetailsForm';
import PackageSelection from '@/components/PackageSelection';
import ConfirmationStep from '@/components/ConfirmationStep';

interface EventType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  gradient: string;
  features: string[];
}

interface Package {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  description: string;
  features: string[];
  popular?: boolean;
  gradient: string;
}

interface FormData {
  eventType: string;
  location: string;
  date: string;
  budget: number;
  guestCount: number;
  additionalNotes: string;
  selectedPackage: string;
  userWhatsapp: string;
  scheduledTime: string;
}

const eventTypes: EventType[] = [
  {
    id: 'wedding',
    name: 'Wedding',
    icon: Heart,
    description: 'Create your dream wedding with comprehensive planning',
    gradient: 'from-pink-500 to-rose-500',
    features: ['Full Planning', '500+ Vendors', 'Premium Service']
  },
  {
    id: 'corporate',
    name: 'Corporate Event',
    icon: Building,
    description: 'Professional events that leave lasting impressions',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['Tech Setup', 'Streaming', 'Catering']
  },
  {
    id: 'birthday',
    name: 'Birthday Party',
    icon: Cake,
    description: 'Celebrate milestones with unforgettable parties',
    gradient: 'from-purple-500 to-pink-500',
    features: ['Themes', 'Entertainment', 'Decor']
  },
  {
    id: 'anniversary',
    name: 'Anniversary',
    icon: Gift,
    description: 'Mark special milestones with elegant celebrations',
    gradient: 'from-emerald-500 to-teal-500',
    features: ['Intimate', 'Romantic', 'Memorable']
  },
  {
    id: 'festival',
    name: 'Festival/Concert',
    icon: Music,
    description: 'Large-scale events with professional production',
    gradient: 'from-orange-500 to-red-500',
    features: ['Stage Setup', 'Sound', 'Security']
  },
  {
    id: 'custom',
    name: 'Custom Event',
    icon: Zap,
    description: 'Unique celebrations designed for your vision',
    gradient: 'from-indigo-500 to-purple-500',
    features: ['Flexible', 'Creative', 'Unique']
  }
];

// Helper functions to get event icons and gradients
const getEventIcon = (category: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'wedding': Heart,
    'corporate': Building,
    'birthday': Cake,
    'anniversary': Gift,
    'festival': Music,
    'custom': Zap
  };
  return iconMap[category] || Zap;
};

const getEventGradient = (category: string) => {
  const gradientMap: { [key: string]: string } = {
    'wedding': 'from-pink-500 to-rose-500',
    'corporate': 'from-blue-500 to-cyan-500',
    'birthday': 'from-purple-500 to-pink-500',
    'anniversary': 'from-emerald-500 to-teal-500',
    'festival': 'from-orange-500 to-red-500',
    'custom': 'from-indigo-500 to-purple-500'
  };
  return gradientMap[category] || 'from-indigo-500 to-purple-500';
};

export default function PlanEventWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [eventRequestId, setEventRequestId] = useState<number | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  
  const progress = useMotionValue(0);
  const progressSpring = useSpring(progress, { stiffness: 100, damping: 30 });
  const progressPercentage = useTransform(progressSpring, [0, 4], [0, 100]);

  const form = useForm<FormData>({
    defaultValues: {
      eventType: '',
      location: '',
      date: '',
      budget: 100000,
      guestCount: 50,
      additionalNotes: '',
      selectedPackage: '',
      userWhatsapp: '',
      scheduledTime: ''
    }
  });

  const { watch, setValue, handleSubmit, formState: { errors } } = form;
  const watchedValues = watch();

  useEffect(() => {
    progress.set(currentStep - 1);
  }, [currentStep, progress]);

  // Fetch events from API on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        console.log('Fetched events:', data);
        if (data.success) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleEventTypeSelect = (eventType: string) => {
    setSelectedEventType(eventType);
    setValue('eventType', eventType);
    
    console.log('Selected event type:', eventType);
    console.log('Available events:', events);
    
    // Map hardcoded event types to database categories
    const categoryMapping: { [key: string]: string } = {
      'wedding': 'wedding',
      'corporate': 'corporate-event',
      'birthday': 'birthday-party',
      'anniversary': 'anniversary',
      'festival': 'festival-concert',
      'custom': 'custom-event'
    };
    
    const mappedCategory = categoryMapping[eventType];
    console.log('Mapped category:', mappedCategory);
    
    // Find the event ID from the events array
    const event = events.find(e => e.category === mappedCategory);
    console.log('Found event:', event);
    
    if (event) {
      setSelectedEventId(event.id);
      console.log('Set selected event ID:', event.id);
    } else {
      console.log('No event found for category:', mappedCategory);
      console.log('Available categories:', events.map(e => e.category));
      // For now, let's use a fallback ID based on the event type
      const fallbackIds: { [key: string]: number } = {
        'wedding': 1,
        'corporate': 2,
        'birthday': 3,
        'anniversary': 4,
        'festival': 5,
        'custom': 6
      };
      const fallbackId = fallbackIds[eventType];
      if (fallbackId) {
        setSelectedEventId(fallbackId);
        console.log('Using fallback event ID:', fallbackId);
      } else {
        console.log('No fallback ID found for event type:', eventType);
      }
    }
    
    setTimeout(() => setCurrentStep(2), 500);
  };

  const handleEventDetailsSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate that we have an event ID
      if (!selectedEventId) {
        setError('Please select an event type first');
        setLoading(false);
        return;
      }

      console.log('Submitting event details:', {
        event_id: selectedEventId,
        location: data.location,
        date_time: data.date,
        budget: data.budget,
        guest_count: data.guestCount,
        additional_notes: data.additionalNotes
      });

      const response = await fetch('/api/event-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEventId,
          location: data.location,
          date_time: data.date,
          budget: data.budget,
          guest_count: data.guestCount,
          additional_notes: data.additionalNotes
        })
      });

      const responseData = await response.json();

      console.log('Response from API:', responseData);

      if (responseData.success) {
        const newEventRequestId = responseData.event_request.id;
        setEventRequestId(newEventRequestId);
        console.log('✅ Event request created with ID:', newEventRequestId);
        console.log('📊 Event request details:', responseData.event_request);
        console.log('🔧 State update - eventRequestId set to:', newEventRequestId);
        
        // Fetch package recommendations
        const packageResponse = await fetch('/api/packages/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id: selectedEventId,
            budget: data.budget,
            guest_count: data.guestCount
          })
        });

        const packageData = await packageResponse.json();

        if (packageData.success) {
          console.log('📦 Received packages:', packageData.packages);
          console.log('📦 Package IDs:', packageData.packages.map((p: any) => p.id));
          setPackages(packageData.packages);
          setCurrentStep(3);
        } else {
          console.error('❌ Failed to get package recommendations:', packageData);
          setError('Failed to get package recommendations');
        }
      } else {
        setError(responseData.error || 'Failed to submit event details');
      }
    } catch (error) {
      console.error('❌ Frontend error in handleEventDetailsSubmit:', error);
      console.error('📊 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      setError('Failed to submit event details');
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (packageId: string) => {
    console.log('🎯 Package selected in UI:', packageId);
    setSelectedPackage(packageId);
    setValue('selectedPackage', packageId);
  };

  const handlePackageConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedPackage) {
        setError('Please select a package first');
        setLoading(false);
        return;
      }

      // Validate that we have an event request ID
      console.log('🔍 Current state before package confirmation:', {
        eventRequestId,
        eventRequestId_type: typeof eventRequestId,
        currentStep,
        selectedEventType,
        selectedEventId,
        selectedPackage
      });

      if (!eventRequestId) {
        console.error('❌ No event request ID found for package selection');
        setError('Please complete the event details first');
        setLoading(false);
        return;
      }

      console.log('📤 Sending package confirmation data:', {
        event_request_id: eventRequestId,
        selected_package: selectedPackage,
        eventRequestId_type: typeof eventRequestId,
        selectedPackage_type: typeof selectedPackage,
        eventRequestId_value: eventRequestId,
        selectedPackage_value: selectedPackage
      });

      const response = await fetch('/api/event-requests/update-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_request_id: eventRequestId,
          selected_package: selectedPackage
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Package confirmed successfully:', {
          selectedPackage,
          eventRequestId,
          response: data
        });
        setCurrentStep(4);
      } else {
        console.error('❌ Package confirmation failed:', data);
        setError(data.error || 'Failed to confirm package');
      }
    } catch (error) {
      console.error('❌ Frontend error in handlePackageConfirm:', error);
      console.error('📊 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      setError('Failed to confirm package');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Final submit data:', {
        event_request_id: eventRequestId,
        scheduled_time: data.scheduledTime,
        user_whatsapp: data.userWhatsapp
      });

      // Convert time to full datetime (today + selected time)
      const today = new Date();
      const [hours, minutes] = data.scheduledTime.split(':');
      today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const scheduledDateTime = today.toISOString();

      console.log('Scheduled datetime:', scheduledDateTime);

      const response = await fetch('/api/call-schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_request_id: eventRequestId,
          scheduled_time: scheduledDateTime,
          user_whatsapp: data.userWhatsapp
        })
      });

      const responseData = await response.json();

      if (responseData.success) {
        alert('Event planning request submitted successfully! Our team will contact you soon.');
        setCurrentStep(1);
        setSelectedEventType(null);
        setSelectedPackage(null);
        setEventRequestId(null);
        setPackages([]);
        form.reset();
      } else {
        setError(responseData.error || 'Failed to schedule consultation');
      }
    } catch (error) {
      console.error('❌ Frontend error in handleFinalSubmit:', error);
      console.error('📊 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      setError('Failed to schedule consultation');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Choose Event Type', icon: Star },
    { number: 2, title: 'Event Details', icon: Calendar },
    { number: 3, title: 'Select Package', icon: DollarSign },
    { number: 4, title: 'Schedule Call', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Liquid Background */}
      <div className="liquid-bg">
        <div className="liquid-blob blob1"></div>
        <div className="liquid-blob blob2"></div>
        <div className="liquid-blob blob3"></div>
        <div className="liquid-blob blob4"></div>
        <div className="liquid-blob blob5"></div>
      </div>

      {/* Grid Overlay */}
      <div className="grid-overlay"></div>

      {/* Grain Overlay */}
      <div className="grain"></div>

      <div className="relative z-10 flex h-screen">
        {/* Left Side - Progress Visualization */}
        <div className="hidden lg:flex lg:w-1/2 p-12 items-center justify-center">
          <div className="w-full max-w-md">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Your Journey</h2>
                <motion.div className="text-3xl font-black gradient-text">
                  {Math.round(progressPercentage.get())}%
                </motion.div>
              </div>
              
              <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full"
                  style={{ width: progressSpring }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-300 rounded-full blur-sm"
                  style={{ width: progressSpring }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>
            </div>

            {/* Step Indicators */}
            <div className="space-y-8">
              {steps.map((step, index) => {
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                const Icon = step.icon;
                
                return (
                  <motion.div
                    key={step.number}
                    className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/10 backdrop-blur-sm border border-pink-500/30' 
                        : isCompleted 
                        ? 'bg-green-500/10 border border-green-500/30' 
                        : 'bg-white/5 border border-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isActive 
                          ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400' 
                          : isCompleted 
                          ? 'bg-green-500' 
                          : 'bg-white/10'
                      }`}
                      animate={{
                        scale: isActive ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 2,
                        repeat: isActive ? Infinity : 0,
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className="w-6 h-6 text-white" />
                      )}
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">Step {step.number}</div>
                      <div className={`font-semibold ${
                        isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-300'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Current Step */}
        <div className="flex-1 lg:w-1/2 p-6 lg:p-12 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-8 text-red-300 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <EventTypeSelection
                  key="step1"
                  eventTypes={events.length > 0 ? events.map(event => ({
                    id: event.category,
                    name: event.name,
                    icon: getEventIcon(event.category),
                    description: event.description,
                    gradient: getEventGradient(event.category),
                    features: ['Full Planning', '500+ Vendors', 'Premium Service']
                  })) : eventTypes}
                  onSelect={handleEventTypeSelect}
                  selectedType={selectedEventType}
                />
              )}

              {currentStep === 2 && (
                <EventDetailsForm
                  key="step2"
                  form={form}
                  onSubmit={handleEventDetailsSubmit}
                  onBack={() => setCurrentStep(1)}
                  loading={loading}
                  selectedEventType={selectedEventType}
                />
              )}

              {currentStep === 3 && (
                <PackageSelection
                  key="step3"
                  packages={packages}
                  onSelect={handlePackageConfirm}
                  onPackageSelect={handlePackageSelect}
                  onBack={() => setCurrentStep(2)}
                  loading={loading}
                  selectedPackage={selectedPackage}
                />
              )}

              {currentStep === 4 && (
                <ConfirmationStep
                  key="step4"
                  form={form}
                  onSubmit={handleFinalSubmit}
                  onBack={() => setCurrentStep(3)}
                  loading={loading}
                  selectedEventType={selectedEventType}
                  selectedPackage={selectedPackage}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
