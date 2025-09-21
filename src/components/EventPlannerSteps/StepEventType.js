'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Heart, Briefcase, GraduationCap, Users, Calendar, Sparkles } from 'lucide-react';

const eventTypes = [
  {
    id: 'wedding',
    title: 'Wedding',
    description: 'Your perfect day, perfectly planned',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-500/30'
  },
  {
    id: 'corporate',
    title: 'Corporate Event',
    description: 'Professional events that impress',
    icon: Briefcase,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'birthday',
    title: 'Birthday Party',
    description: 'Celebrate in style',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 'graduation',
    title: 'Graduation',
    description: 'Mark your achievement',
    icon: GraduationCap,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30'
  },
  {
    id: 'conference',
    title: 'Conference',
    description: 'Knowledge sharing events',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-500/20 to-red-500/20',
    borderColor: 'border-orange-500/30'
  },
  {
    id: 'anniversary',
    title: 'Anniversary',
    description: 'Celebrate milestones',
    icon: Calendar,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'from-indigo-500/20 to-purple-500/20',
    borderColor: 'border-indigo-500/30'
  }
];

export default function StepEventType({ selectedType, onSelect }) {
  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          What type of event are you planning?
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Choose the event type that best matches your vision. We'll customize our services accordingly.
        </p>
      </div>

      {/* Event Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventTypes.map((eventType, index) => {
          const IconComponent = eventType.icon;
          const isSelected = selectedType === eventType.id;

          return (
            <motion.div
              key={eventType.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(eventType.id)}
              className={`
                relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300
                ${isSelected 
                  ? `bg-gradient-to-br ${eventType.bgColor} ${eventType.borderColor} border-2` 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                </motion.div>
              )}

              {/* Glow Effect for Selected */}
              {isSelected && (
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${eventType.color} opacity-20 blur-xl`}
                  animate={{
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}

              {/* Card Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${eventType.color} flex items-center justify-center mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {eventType.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {eventType.description}
                </p>
              </div>

              {/* Hover Overlay */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-black/20 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Selection Feedback */}
      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              {eventTypes.find(et => et.id === selectedType)?.title} selected
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
