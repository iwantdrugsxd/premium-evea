  'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Step2ServiceSelection from '@/components/plan-event/Step2ServiceSelection';
import Step3EventDetails from '@/components/plan-event/Step3EventDetails';
import Step4PackageSelection from '@/components/plan-event/Step4PackageSelection';
import Step5ScheduleConsultation from '@/components/plan-event/Step5ScheduleConsultation';
import Step6ContactInformation from '@/components/plan-event/Step6ContactInformation';
import Step7Confirmation from '@/components/plan-event/Step7Confirmation';
import Step8Success from '@/components/plan-event/Step8Success';
import CallSchedulingModal from '@/components/plan-event/CallSchedulingModal';
import LoginPrompt from '@/components/LoginPrompt';
import PhoneNumberCollection from '@/components/PhoneNumberCollection';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showPhoneCollection, setShowPhoneCollection] = useState(false);
  const [showCallSchedulingModal, setShowCallSchedulingModal] = useState(false);
  const [isSchedulingCall, setIsSchedulingCall] = useState(false);
  
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

  // Map event names to PNG file names
  const getEventImage = (eventName: string) => {
    const name = eventName.toLowerCase();
    if (name.includes('wedding')) return '/event-images/wedding.png';
    if (name.includes('birthday')) return '/event-images/birthday.png';
    if (name.includes('corporate')) return '/event-images/corporate.png';
    if (name.includes('anniversary')) return '/event-images/anniversary.png';
    if (name.includes('cultural')) return '/event-images/cultural-event.png';
    if (name.includes('custom')) return '/event-images/custom-event.png';
    if (name.includes('festival') || name.includes('concert')) return '/event-images/cultural-event.png';
    // Default fallback
    return '/event-images/custom-event.png';
  };

  // Check for existing login state on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData');
    
    if (token && user) {
      const userData = JSON.parse(user);
      setUserData(userData);
      setIsLoggedIn(true);
      
      // Check if phone number is missing (common with Google OAuth)
      const phoneNumber = userData.mobileNumber || userData.mobile_number || '';
      if (!phoneNumber.trim()) {
        setShowPhoneCollection(true);
        return;
      }
      
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        userName: userData.fullName || userData.full_name || '',
        userPhone: phoneNumber,
        userEmail: userData.email || '',
        eventLocation: userData.location || ''
      }));
      
    }
  }, []);

  // Auto-advance to step 5 if user is logged in and on step 4
  useEffect(() => {
    if (isLoggedIn && currentStep === 4 && formData.selectedPackage) {
      setCurrentStep(5);
    }
  }, [isLoggedIn, currentStep, formData.selectedPackage]);

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
        console.log('🔍 Looking for event with type:', formData.eventType);
        console.log('📋 Available events:', events.map(e => ({ id: e.id, name: e.name })));
        
        const event = events.find(e => e.name.toLowerCase() === formData.eventType.toLowerCase());
        console.log('✅ Found event:', event);
        
        if (event) {
          console.log('🚀 Fetching services for event ID:', event.id);
          const response = await fetch(`/api/events/${event.id}/services`);
          if (response.ok) {
            const result = await response.json();
            console.log('📦 Services response:', result);
            setEventServices(result.data.services || []);
          } else {
            console.error('❌ Failed to fetch services:', response.status, response.statusText);
          }
        } else {
          console.log('❌ No event found for type:', formData.eventType);
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
    // Check if we're moving to step 5 (scheduling) and user is not logged in
    if (currentStep === 4 && !isLoggedIn) {
      // Don't advance to step 5, the login prompt will be shown
      return;
    }
    
    if (currentStep < 7) {
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

  const handleLoginSuccess = () => {
    // Get user data from localStorage
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData');
    
    if (token && user) {
      const userData = JSON.parse(user);
      setUserData(userData);
      setIsLoggedIn(true);
      
      // Check if phone number is missing (common with Google OAuth)
      const phoneNumber = userData.mobileNumber || userData.mobile_number || '';
      if (!phoneNumber.trim()) {
        setShowPhoneCollection(true);
        return;
      }
      
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        userName: userData.fullName || userData.full_name || '',
        userPhone: phoneNumber,
        userEmail: userData.email || '',
        eventLocation: userData.location || ''
      }));
      
      // If user was on step 4 (package selection), advance to step 5 (scheduling)
      if (currentStep === 4) {
        setCurrentStep(5);
      }
      
    }
  };

  const handlePhoneCollectionComplete = (phoneNumber: string, location: string) => {
    // Update user data with new phone number
    const updatedUserData = {
      ...userData,
      mobileNumber: phoneNumber,
      location: location
    };
    setUserData(updatedUserData);
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      userName: updatedUserData.fullName || updatedUserData.full_name || '',
      userPhone: phoneNumber,
      userEmail: updatedUserData.email || '',
      eventLocation: location
    }));
    
    // Hide phone collection form
    setShowPhoneCollection(false);
    
    // If user was on step 4 (package selection), advance to step 5 (scheduling)
    if (currentStep === 4) {
      setCurrentStep(5);
    }
    
  };

  const handlePhoneCollectionSkip = () => {
    // Hide phone collection form but keep user logged in
    setShowPhoneCollection(false);
    
    // If user was on step 4 (package selection), advance to step 5 (scheduling)
    if (currentStep === 4) {
      setCurrentStep(5);
    }
    
  };

  const refreshUserData = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData');
    
    if (token && user) {
      const userData = JSON.parse(user);
      setUserData(userData);
      setIsLoggedIn(true);
      
      // Check if phone number is missing
      const phoneNumber = userData.mobileNumber || userData.mobile_number || '';
      if (!phoneNumber.trim()) {
        setShowPhoneCollection(true);
        return true;
      }
      
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        userName: userData.fullName || userData.full_name || '',
        userPhone: phoneNumber,
        userEmail: userData.email || '',
        eventLocation: userData.location || ''
      }));
      
      return true;
    }
    return false;
  };

  const validateFormData = () => {
    // Try to refresh user data if fields are missing
    if (!formData.userName || !formData.userPhone) {
      refreshUserData();
    }

    const requiredFields = {
      eventType: formData.eventType,
      selectedServices: formData.selectedServices,
      userName: formData.userName,
      userPhone: formData.userPhone,
      userEmail: formData.userEmail,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || (Array.isArray(value) && value.length === 0))
      .map(([key]) => key);

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };

  const submitRequest = async () => {
    setIsSubmitting(true);
    try {
      
      // Check if user is logged in
      if (!isLoggedIn || !userData) {
        alert('Please log in to submit your event planning request.');
        setIsSubmitting(false);
        return;
      }

      // Validate form data
      const validation = validateFormData();
      if (!validation.isValid) {
        alert(`Please fill in all required fields: ${validation.missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }
      
      // Submit to API
      const response = await fetch('/api/event-planning-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Show detailed error message
        const errorMessage = result.error || 'Failed to submit request';
        const missingFields = result.missingFields || [];
        const receivedData = result.receivedData || {};
        
        let detailedError = errorMessage;
        if (missingFields.length > 0) {
          detailedError += `\n\nMissing fields: ${missingFields.join(', ')}`;
        }
        if (Object.keys(receivedData).length > 0) {
          detailedError += `\n\nReceived data: ${JSON.stringify(receivedData, null, 2)}`;
        }
        
        console.error('❌ Submission failed:', detailedError);
        alert(detailedError);
        return;
      }

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
      
      // Show call scheduling modal instead of going to success step
      setShowCallSchedulingModal(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleCall = async (scheduledTime: string) => {
    setIsSchedulingCall(true);
    try {
      const response = await fetch('/api/call-schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_request_id: requestId.replace('#EVE-', ''),
          scheduled_time: scheduledTime,
          user_email: formData.userEmail,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowCallSchedulingModal(false);
        setCurrentStep(7); // Move to success step
      } else {
        alert('Failed to schedule call. Please try again.');
      }
    } catch (error) {
      console.error('Call scheduling error:', error);
      alert('Failed to schedule call. Please try again.');
    } finally {
      setIsSchedulingCall(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Main Container */}
      <div className="pt-4 sm:pt-8 md:pt-16 pb-8 sm:pb-12 md:pb-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl mx-auto">



        {/* Phone Number Collection Modal */}
        {showPhoneCollection && userData && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <PhoneNumberCollection
              userData={userData}
              onComplete={handlePhoneCollectionComplete}
              onSkip={handlePhoneCollectionSkip}
            />
          </div>
        )}

        {/* Step Content */}
        <div className="bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Step 1: Event Type Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                What event are you planning?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
                Choose the category that best matches your celebration
              </p>
              
              {loading ? (
                <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                  <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-400">Loading events...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-10">
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
                      className={`relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 h-24 sm:h-28 md:h-32 group ${
                        formData.eventType === event.name.toLowerCase() 
                          ? 'ring-2 sm:ring-4 ring-purple-500 ring-opacity-70 shadow-lg sm:shadow-2xl shadow-purple-500/30' 
                          : 'hover:shadow-lg sm:hover:shadow-xl hover:shadow-purple-500/20'
                      }`}
                    >
                      {/* Background Image */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                        style={{ 
                          backgroundImage: `url(${getEventImage(event.name)})` 
                        }}
                        onError={(e) => {
                          // Fallback to gradient background if image fails to load
                          e.currentTarget.style.backgroundImage = 'none';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        }}
                      />
                      
                      {/* Dark Overlay for Better Text Readability */}
                      <div className={`absolute inset-0 transition-colors duration-300 ${
                        formData.eventType === event.name.toLowerCase() 
                          ? 'bg-black/20' 
                          : 'bg-black/50 group-hover:bg-black/40'
                      }`} />
                      
                      {/* Event Type Name */}
                      <div className="relative h-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-wide text-center px-2 sm:px-4 drop-shadow-lg">
                          {event.name}
                        </span>
                      </div>
                      
                      {/* Selection Indicator */}
                      {formData.eventType === event.name.toLowerCase() && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
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
            <div>
              <Step4PackageSelection
                selectedPackage={formData.selectedPackage}
                onSelectPackage={(packageType) => updateFormData('selectedPackage', packageType)}
                onNext={nextStep}
                onBack={prevStep}
                eventPackages={eventPackages}
              />
              
              {/* Show login prompt if user is not logged in */}
              {!isLoggedIn && formData.selectedPackage && (
                <div className="mt-8 p-6 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                  <h3 className="text-lg font-bold mb-4 text-purple-500">Login Required</h3>
                  <p className="text-gray-400 mb-4">
                    Please log in to continue with scheduling your consultation call.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => window.location.href = '/login'}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-purple-500/40 transition-all"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => window.location.href = '/signup'}
                      className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              )}
            </div>
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

          {/* Step 6: Confirmation */}
          {currentStep === 6 && (
            <Step7Confirmation
              formData={formData}
              onSubmit={submitRequest}
              onBack={prevStep}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Step 7: Success */}
          {currentStep === 7 && (
            <Step8Success
              formData={{
                scheduledDate: formData.scheduledDate,
                scheduledTime: formData.scheduledTime
              }}
              requestId={requestId}
              userName={userData?.full_name}
            />
          )}
        </div>
      </div>

      {/* Call Scheduling Modal */}
      <CallSchedulingModal
        isOpen={showCallSchedulingModal}
        onClose={() => setShowCallSchedulingModal(false)}
        onScheduleCall={handleScheduleCall}
        formData={formData}
        requestId={requestId}
        isSubmitting={isSchedulingCall}
      />

      <style jsx>{`
        @keyframes aurora {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}