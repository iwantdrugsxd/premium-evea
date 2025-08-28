'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft, Calendar, MapPin, Users, DollarSign, Clock, Phone } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  category: string;
  description: string;
  base_price: number;
  min_guests: number;
  max_guests: number;
}

interface EventDetails {
  location: string;
  date_time: string;
  budget: number;
  guest_count: number;
  additional_notes?: string;
}

interface Package {
  id: number;
  name: string;
  event_type: string;
  price_range_min: number;
  price_range_max: number;
  guest_range_min: number;
  guest_range_max: number;
  features: string[];
}

interface CallSchedule {
  scheduled_time: string;
  user_whatsapp: string;
}

export default function PlanEventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [eventRequestId, setEventRequestId] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.events);
      } else {
        setError('Failed to fetch events');
      }
    } catch (error) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setStep(2);
  };

  const handleEventDetailsSubmit = async (details: EventDetails) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/event-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEvent!.id,
          ...details
        })
      });

      const data = await response.json();

      if (data.success) {
        setEventDetails(details);
        setEventRequestId(data.event_request.id);
        
        // Fetch package recommendations
        const packageResponse = await fetch('/api/packages/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id: selectedEvent!.id,
            budget: details.budget,
            guest_count: details.guest_count
          })
        });

        const packageData = await packageResponse.json();

        if (packageData.success) {
          setPackages(packageData.packages);
          setStep(3);
        } else {
          setError('Failed to get package recommendations');
        }
      } else {
        setError(data.error || 'Failed to submit event details');
      }
    } catch (error) {
      setError('Failed to submit event details');
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = async (pkg: Package) => {
    try {
      setLoading(true);
      setError(null);

      // Update the event request with selected package
      const response = await fetch('/api/event-requests/update-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_request_id: eventRequestId,
          selected_package: pkg.name.toLowerCase()
        })
      });

      const data = await response.json();

      if (data.success) {
        setSelectedPackage(pkg);
        setStep(4);
      } else {
        setError(data.error || 'Failed to select package');
      }
    } catch (error) {
      setError('Failed to select package');
    } finally {
      setLoading(false);
    }
  };

  const handleCallSchedule = async (schedule: CallSchedule) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/call-schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_request_id: eventRequestId,
          ...schedule
        })
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        alert('Call scheduled successfully! Admin will contact you soon.');
        // Reset form or redirect
        setStep(1);
        setSelectedEvent(null);
        setEventDetails(null);
        setPackages([]);
        setSelectedPackage(null);
        setEventRequestId(null);
      } else {
        setError(data.error || 'Failed to schedule call');
      }
    } catch (error) {
      setError('Failed to schedule call');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const steps = [
    { number: 1, title: 'Choose Event', icon: Calendar },
    { number: 2, title: 'Event Details', icon: MapPin },
    { number: 3, title: 'Select Package', icon: DollarSign },
    { number: 4, title: 'Schedule Call', icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Plan Your Event
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Let&apos;s create something extraordinary together. Follow these simple steps to plan your perfect event.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-4">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isActive = step === stepItem.number;
              const isCompleted = step > stepItem.number;
              
              return (
                <motion.div
                  key={stepItem.number}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-2 ${
                    isActive ? 'text-purple-400' : isCompleted ? 'text-green-400' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isActive ? 'border-purple-400 bg-purple-400/20' : 
                    isCompleted ? 'border-green-400 bg-green-400/20' : 
                    'border-gray-400 bg-gray-400/20'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="hidden md:block font-medium">{stepItem.title}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-8 text-red-300 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <EventSelectionStep
              key="step1"
              events={events}
              onEventSelect={handleEventSelect}
              loading={loading}
            />
          )}

          {step === 2 && selectedEvent && (
            <EventDetailsStep
              key="step2"
              event={selectedEvent}
              onDetailsSubmit={handleEventDetailsSubmit}
              onBack={goBack}
              loading={loading}
            />
          )}

          {step === 3 && (
            <PackageSelectionStep
              key="step3"
              packages={packages}
              onPackageSelect={handlePackageSelect}
              onBack={goBack}
              loading={loading}
            />
          )}

          {step === 4 && (
            <CallSchedulingStep
              key="step4"
              onScheduleComplete={handleCallSchedule}
              onBack={goBack}
              loading={loading}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Step 1: Event Selection
function EventSelectionStep({ events, onEventSelect, loading }: {
  events: Event[];
  onEventSelect: (event: Event) => void;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Event Type</h2>
      
      {loading ? (
        <div className="text-center text-gray-300">Loading events...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300"
              onClick={() => onEventSelect(event)}
            >
              <h3 className="text-xl font-bold text-white mb-3">{event.name}</h3>
              <p className="text-gray-400 mb-4 line-clamp-3">{event.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-purple-400 font-semibold">
                  Starting from ₹{event.base_price.toLocaleString()}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Step 2: Event Details
function EventDetailsStep({ event, onDetailsSubmit, onBack, loading }: {
  event: Event;
  onDetailsSubmit: (details: EventDetails) => void;
  onBack: () => void;
  loading: boolean;
}) {
  const [details, setDetails] = useState<EventDetails>({
    location: '',
    date_time: '',
    budget: 0,
    guest_count: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDetailsSubmit(details);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <h2 className="text-3xl font-bold text-white mb-8 text-center">Event Details</h2>
      
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="mb-6 p-4 bg-purple-500/20 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
          <p className="text-gray-300">{event.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Location</label>
            <input
              type="text"
              value={details.location}
              onChange={(e) => setDetails({...details, location: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              placeholder="Enter event location"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Date & Time</label>
            <input
              type="datetime-local"
              value={details.date_time}
              onChange={(e) => setDetails({...details, date_time: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Budget (₹)</label>
              <input
                type="number"
                value={details.budget || ''}
                onChange={(e) => setDetails({...details, budget: Number(e.target.value)})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                placeholder="Enter your budget"
                min={event.base_price}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Guest Count</label>
              <input
                type="number"
                value={details.guest_count || ''}
                onChange={(e) => setDetails({...details, guest_count: Number(e.target.value)})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                placeholder="Number of guests"
                min={event.min_guests}
                max={event.max_guests}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Additional Notes (Optional)</label>
            <textarea
              value={details.additional_notes || ''}
              onChange={(e) => setDetails({...details, additional_notes: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              placeholder="Any special requirements or preferences..."
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Get Package Recommendations'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// Step 3: Package Selection
function PackageSelectionStep({ packages, onPackageSelect, onBack, loading }: {
  packages: Package[];
  onPackageSelect: (pkg: Package) => void;
  onBack: () => void;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <h2 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Package</h2>
      
      {loading ? (
        <div className="text-center text-gray-300">Loading packages...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                pkg.name === 'Professional' 
                  ? 'border-purple-400 bg-purple-500/20' 
                  : 'border-white/10 hover:bg-white/10'
              }`}
              onClick={() => onPackageSelect(pkg)}
            >
              {pkg.name === 'Professional' && (
                <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                  RECOMMENDED
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
              <div className="text-2xl font-bold text-purple-400 mb-4">
                ₹{pkg.price_range_min.toLocaleString()} - ₹{pkg.price_range_max.toLocaleString()}
              </div>
              
              <div className="space-y-3 mb-6">
                {pkg.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                Select Package
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Step 4: Call Scheduling
function CallSchedulingStep({ onScheduleComplete, onBack, loading }: {
  onScheduleComplete: (schedule: CallSchedule) => void;
  onBack: () => void;
  loading: boolean;
}) {
  const [schedule, setSchedule] = useState<CallSchedule>({
    scheduled_time: '',
    user_whatsapp: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScheduleComplete(schedule);
  };

  // Generate available time slots (next 7 days, 9 AM to 6 PM)
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    
    for (let day = 0; day < 7; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      
      for (let hour = 9; hour <= 18; hour++) {
        const slot = new Date(date);
        slot.setHours(hour, 0, 0, 0);
        
        if (slot > now) {
          slots.push(slot.toISOString().slice(0, 16));
        }
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <h2 className="text-3xl font-bold text-white mb-8 text-center">Schedule Your Call</h2>
      
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="mb-6 p-4 bg-green-500/20 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-2">Almost Done!</h3>
          <p className="text-gray-300">Schedule a call with our event planning expert to discuss your requirements in detail.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Your WhatsApp Number</label>
            <input
              type="tel"
              value={schedule.user_whatsapp}
              onChange={(e) => setSchedule({...schedule, user_whatsapp: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Preferred Call Time</label>
            <select
              value={schedule.scheduled_time}
              onChange={(e) => setSchedule({...schedule, scheduled_time: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400"
              required
            >
              <option value="">Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {new Date(slot).toLocaleString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Scheduling...' : 'Schedule Call & Complete'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-500/20 rounded-xl">
          <h4 className="text-white font-semibold mb-2">What happens next?</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Admin will receive instant WhatsApp notification</li>
            <li>• You&apos;ll get a confirmation message</li>
            <li>• Our expert will call you at the scheduled time</li>
            <li>• We&apos;ll discuss your requirements in detail</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
