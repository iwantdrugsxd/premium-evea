'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Step2ServiceSelection from '@/components/plan-event/Step2ServiceSelection';
import Step3EventDetails from '@/components/plan-event/Step3EventDetails';
import Step4PackageSelection from '@/components/plan-event/Step4PackageSelection';
import Step5ScheduleConsultation from '@/components/plan-event/Step5ScheduleConsultation';
import Step6ContactInformation from '@/components/plan-event/Step6ContactInformation';
import Step7Confirmation from '@/components/plan-event/Step7Confirmation';
import Step8Success from '@/components/plan-event/Step8Success';

interface FormData {
  eventType: string;
  selectedServices: string[];
  eventLocation: string;
  eventDate: string;
  guestCount: string;
  budget: string;
  additionalNotes: string;
  selectedPackage: string;
  scheduledDate: string;
  scheduledTime: string;
  callDuration: string;
  flexibility: string;
  userName: string;
  userPhone: string;
  userEmail: string;
}

const stepInfo = {
  1: { title: "Choose Your Event Type", subtitle: "Select the type of event you're planning to get started" },
  2: { title: "Select Your Services", subtitle: "Choose the services you need for your perfect event" },
  3: { title: "Event Details", subtitle: "Tell us more about your event requirements" },
  4: { title: "Choose Your Package", subtitle: "Select the package that best fits your needs and budget" },
  5: { title: "Schedule Consultation", subtitle: "Book a call with our experts for personalized planning" },
  6: { title: "Contact Information", subtitle: "Share your details so we can reach out with your quote" },
  7: { title: "Confirm Your Request", subtitle: "Review all details before submitting your event request" }
};

export default function PlanEventPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [scheduledCallInfo, setScheduledCallInfo] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [eventServices, setEventServices] = useState<any[]>([]);
  const [eventPackages, setEventPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<FormData>({
    eventType: '',
    selectedServices: ['venue', 'coordination'],
    eventLocation: '',
    eventDate: '',
    guestCount: '',
    budget: '',
    additionalNotes: '',
    selectedPackage: '',
    scheduledDate: '',
    scheduledTime: '',
    callDuration: '45',
    flexibility: 'flexible',
    userName: '',
    userPhone: '',
    userEmail: ''
  });

  // Custom cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Fetch events data on component mount
  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
        if (response.ok) {
          const result = await response.json();
          setEvents(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch services when event type changes
  useEffect(() => {
    const fetchServices = async () => {
      if (!formData.eventType) return;
      
      try {
        const event = events.find(e => e.name.toLowerCase() === formData.eventType.toLowerCase());
    if (event) {
          const response = await fetch(`/api/events/${event.id}/services`);
          if (response.ok) {
            const result = await response.json();
            setEventServices(result.data.services || []);
          }
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [formData.eventType, events]);

  // Fetch packages when event type changes
  useEffect(() => {
    const fetchPackages = async () => {
      if (!formData.eventType) return;
      
      try {
        const event = events.find(e => e.name.toLowerCase() === formData.eventType.toLowerCase());
        if (event) {
          const response = await fetch(`/api/events/${event.id}/packages`);
          if (response.ok) {
            const result = await response.json();
            setEventPackages(result.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, [formData.eventType, events]);

  const nextStep = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitRequest = async () => {
    setIsSubmitting(true);
    try {
      // Submit to API
      const response = await fetch('/api/event-planning-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      const result = await response.json();

      // Set request ID from API response
      setRequestId(`#EVE-${result.requestId}`);
      
      // Format scheduled call info
      const dateObj = new Date(formData.scheduledDate);
      const dateStr = dateObj.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const timeStr = new Date(`2000-01-01T${formData.scheduledTime}:00`).toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      setScheduledCallInfo(`${dateStr} at ${timeStr}`);
      
      // Move to success step
        nextStep();
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden" style={{ cursor: 'none' }}>
      {/* Navigation */}
      <Navigation />

      {/* Aurora Background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute w-[200%] h-[200%] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent via-pink-500/30 to-transparent animate-spin" 
             style={{ animation: 'aurora 15s linear infinite' }}></div>
      </div>

      {/* Custom Cursor */}
      <div 
        className="fixed w-2.5 h-2.5 bg-purple-500 rounded-full pointer-events-none z-[9999] transition-transform duration-150 mix-blend-screen"
        style={{ 
          left: cursorPosition.x, 
          top: cursorPosition.y,
          transform: isHovering ? 'scale(2)' : 'scale(1)'
        }}
      ></div>
      <div 
        className="fixed w-8 h-8 border-2 border-purple-500/50 rounded-full pointer-events-none z-[9998] transition-all duration-150"
        style={{ 
          left: cursorPosition.x - 15, 
          top: cursorPosition.y - 15,
          transform: isHovering ? 'scale(1.5)' : 'scale(1)'
        }}
      ></div>

      {/* Main Container */}
      <div className="pt-32 pb-20 px-12 max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-12 text-center">
          <div className="flex justify-center items-center gap-5 mb-8">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step < currentStep ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white' :
                  step === currentStep ? 'bg-purple-500 text-white scale-110 shadow-lg shadow-purple-500/50' :
                  'bg-white/10 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 7 && (
                  <div className={`w-15 h-0.5 mx-2.5 ${
                    step < currentStep ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500' : 'bg-white/10'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-2.5">{stepInfo[currentStep as keyof typeof stepInfo]?.title}</h2>
          <p className="text-gray-400">{stepInfo[currentStep as keyof typeof stepInfo]?.subtitle}</p>
        </div>

        {/* Step Content */}
        <div className="bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl p-10">
          {/* Step 1: Event Type Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-4xl font-black mb-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                What type of event are you planning?
              </h2>
              <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                Choose the category that best matches your celebration
              </p>
              
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-400">Loading events...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => {
                        updateFormData('eventType', event.name.toLowerCase());
                        // Auto-route to next step after a short delay
                        setTimeout(() => {
                          nextStep();
                        }, 300);
                      }}
                      className={`bg-white/3 border-2 rounded-2xl p-8 cursor-pointer transition-all text-center hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 ${
                        formData.eventType === event.name.toLowerCase() 
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-white/10 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="text-5xl mb-5">{event.icon || '🎉'}</div>
                      <div className="text-xl font-bold mb-2.5">{event.name}</div>
                      <div className="text-gray-400 text-sm leading-relaxed">{event.description || 'Professional event planning services'}</div>
                    </div>
                  ))}
                </div>
              )}


            </div>
          )}

                    {/* Step 2: Service Selection */}
          {currentStep === 2 && (
            <Step2ServiceSelection
              selectedServices={formData.selectedServices}
              onUpdateServices={(services) => updateFormData('selectedServices', services)}
              onNext={nextStep}
              onBack={prevStep}
              eventServices={eventServices}
            />
          )}

          {/* Step 3: Event Details */}
          {currentStep === 3 && (
            <Step3EventDetails
              formData={{
                eventLocation: formData.eventLocation,
                eventDate: formData.eventDate,
                guestCount: formData.guestCount,
                budget: formData.budget,
                additionalNotes: formData.additionalNotes
              }}
              onUpdateField={updateField}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {/* Step 4: Package Selection */}
              {currentStep === 4 && (
            <Step4PackageSelection
              selectedPackage={formData.selectedPackage}
              onSelectPackage={(packageType) => updateFormData('selectedPackage', packageType)}
              onNext={nextStep}
              onBack={prevStep}
              eventPackages={eventPackages}
            />
          )}

                    {/* Step 5: Schedule Consultation */}
              {currentStep === 5 && (
            <Step5ScheduleConsultation
              formData={{
                scheduledDate: formData.scheduledDate,
                scheduledTime: formData.scheduledTime,
                callDuration: formData.callDuration,
                flexibility: formData.flexibility
              }}
              onUpdateField={updateField}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {/* Step 6: Contact Information */}
              {currentStep === 6 && (
            <Step6ContactInformation
              formData={{
                userName: formData.userName,
                userPhone: formData.userPhone,
                userEmail: formData.userEmail
              }}
              onUpdateField={updateField}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {/* Step 7: Confirmation */}
          {currentStep === 7 && (
            <Step7Confirmation
              formData={formData}
              onSubmit={submitRequest}
              onBack={prevStep}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Step 8: Success */}
          {currentStep === 8 && (
            <Step8Success
              formData={{
                scheduledDate: formData.scheduledDate,
                scheduledTime: formData.scheduledTime
              }}
              requestId={requestId}
            />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes aurora {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}