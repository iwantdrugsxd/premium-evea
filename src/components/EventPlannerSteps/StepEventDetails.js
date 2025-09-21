'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, Users, MapPin, MessageSquare } from 'lucide-react';

// Floating Label Input Component
function FloatingLabelInput({ 
  id, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  icon: Icon,
  required = false,
  validation = null
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = value && value.length > 0;
  const isActive = isFocused || isFilled;

  return (
    <div className="relative">
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className={`w-5 h-5 transition-colors ${
              isActive ? 'text-purple-400' : 'text-gray-500'
            }`} />
          </div>
        )}
        
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-4 rounded-xl border-2 bg-white/5 backdrop-blur-sm transition-all duration-300
            ${Icon ? 'pl-12' : 'pl-4'}
            ${isActive 
              ? 'border-purple-500/50 bg-white/10' 
              : 'border-white/10 hover:border-white/20'
            }
            ${validation === 'valid' ? 'border-green-500/50' : ''}
            ${validation === 'invalid' ? 'border-red-500/50' : ''}
            focus:outline-none focus:ring-2 focus:ring-purple-500/20
          `}
          placeholder={isActive ? '' : placeholder}
          required={required}
        />
        
        <motion.label
          htmlFor={id}
          className={`
            absolute left-4 transition-all duration-300 pointer-events-none
            ${Icon ? 'left-12' : 'left-4'}
            ${isActive 
              ? 'top-2 text-xs text-purple-400' 
              : 'top-1/2 transform -translate-y-1/2 text-gray-400'
            }
          `}
          animate={{
            y: isActive ? -8 : 0,
            scale: isActive ? 0.85 : 1,
          }}
        >
          {label}
        </motion.label>
      </div>

      {/* Validation Indicator */}
      {validation === 'valid' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
        >
          <CheckCircle className="w-5 h-5 text-green-400" />
        </motion.div>
      )}

      {validation === 'invalid' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
        >
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Textarea with Floating Label
function FloatingLabelTextarea({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon,
  required = false,
  validation = null
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = value && value.length > 0;
  const isActive = isFocused || isFilled;

  return (
    <div className="relative">
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-4 z-10">
            <Icon className={`w-5 h-5 transition-colors ${
              isActive ? 'text-purple-400' : 'text-gray-500'
            }`} />
          </div>
        )}
        
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-4 rounded-xl border-2 bg-white/5 backdrop-blur-sm transition-all duration-300
            ${Icon ? 'pl-12' : 'pl-4'}
            ${isActive 
              ? 'border-purple-500/50 bg-white/10' 
              : 'border-white/10 hover:border-white/20'
            }
            ${validation === 'valid' ? 'border-green-500/50' : ''}
            ${validation === 'invalid' ? 'border-red-500/50' : ''}
            focus:outline-none focus:ring-2 focus:ring-purple-500/20
            resize-none
          `}
          placeholder={isActive ? '' : placeholder}
          rows={4}
          required={required}
        />
        
        <motion.label
          htmlFor={id}
          className={`
            absolute left-4 transition-all duration-300 pointer-events-none
            ${Icon ? 'left-12' : 'left-4'}
            ${isActive 
              ? 'top-2 text-xs text-purple-400' 
              : 'top-4 text-gray-400'
            }
          `}
          animate={{
            y: isActive ? -8 : 0,
            scale: isActive ? 0.85 : 1,
          }}
        >
          {label}
        </motion.label>
      </div>

      {/* Validation Indicator */}
      {validation === 'valid' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute right-4 top-4"
        >
          <CheckCircle className="w-5 h-5 text-green-400" />
        </motion.div>
      )}
    </div>
  );
}

export default function StepEventDetails({ eventDetails, onUpdate }) {
  const [validation, setValidation] = useState({});

  // Real-time validation
  const validateField = (field, value) => {
    let isValid = false;
    
    switch (field) {
      case 'eventName':
        isValid = value.length >= 3;
        break;
      case 'eventDate':
        isValid = value && new Date(value) > new Date();
        break;
      case 'eventTime':
        isValid = value && value.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);
        break;
      case 'guestCount':
        isValid = value && parseInt(value) > 0;
        break;
      case 'venue':
        isValid = value.length >= 3;
        break;
      case 'specialRequests':
        isValid = true; // Optional field
        break;
      default:
        isValid = false;
    }

    setValidation(prev => ({
      ...prev,
      [field]: isValid ? 'valid' : (value ? 'invalid' : null)
    }));

    return isValid;
  };

  const handleFieldChange = (field, value) => {
    onUpdate({
      ...eventDetails,
      [field]: value
    });
    
    // Validate field
    validateField(field, value);
  };

  const isFormValid = () => {
    return eventDetails.eventName && 
           eventDetails.eventDate && 
           eventDetails.eventTime && 
           eventDetails.guestCount &&
           validation.eventName === 'valid' &&
           validation.eventDate === 'valid' &&
           validation.eventTime === 'valid' &&
           validation.guestCount === 'valid';
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Event details
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Tell us about your event so we can provide the best possible service.
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Event Name */}
        <div>
          <FloatingLabelInput
            id="eventName"
            label="Event Name"
            type="text"
            value={eventDetails.eventName}
            onChange={(value) => handleFieldChange('eventName', value)}
            placeholder="Enter your event name"
            icon={MessageSquare}
            required
            validation={validation.eventName}
          />
        </div>

        {/* Date and Time Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <FloatingLabelInput
              id="eventDate"
              label="Event Date"
              type="date"
              value={eventDetails.eventDate}
              onChange={(value) => handleFieldChange('eventDate', value)}
              placeholder="Select date"
              icon={Calendar}
              required
              validation={validation.eventDate}
            />
          </div>
          
          <div>
            <FloatingLabelInput
              id="eventTime"
              label="Event Time"
              type="time"
              value={eventDetails.eventTime}
              onChange={(value) => handleFieldChange('eventTime', value)}
              placeholder="Select time"
              icon={Clock}
              required
              validation={validation.eventTime}
            />
          </div>
        </div>

        {/* Guest Count and Venue Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <FloatingLabelInput
              id="guestCount"
              label="Number of Guests"
              type="number"
              value={eventDetails.guestCount}
              onChange={(value) => handleFieldChange('guestCount', value)}
              placeholder="Enter guest count"
              icon={Users}
              required
              validation={validation.guestCount}
            />
          </div>
          
          <div>
            <FloatingLabelInput
              id="venue"
              label="Venue (Optional)"
              type="text"
              value={eventDetails.venue}
              onChange={(value) => handleFieldChange('venue', value)}
              placeholder="Enter venue name"
              icon={MapPin}
              validation={validation.venue}
            />
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <FloatingLabelTextarea
            id="specialRequests"
            label="Special Requests"
            value={eventDetails.specialRequests}
            onChange={(value) => handleFieldChange('specialRequests', value)}
            placeholder="Any special requirements or requests?"
            icon={MessageSquare}
            validation={validation.specialRequests}
          />
        </div>
      </div>

      {/* Form Validation Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {isFormValid() ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-300">
              All required fields completed
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-full">
            <div className="w-4 h-4 rounded-full bg-orange-400 flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <span className="text-sm font-medium text-orange-300">
              Please complete all required fields
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
