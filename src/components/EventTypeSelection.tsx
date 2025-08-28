'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface EventType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  gradient: string;
  features: string[];
}

interface EventTypeSelectionProps {
  eventTypes: EventType[];
  onSelect: (type: string) => void;
  selectedType: string | null;
}

export default function EventTypeSelection({ eventTypes, onSelect, selectedType }: EventTypeSelectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8"
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-label"
        >
          Step 1 of 4
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          Choose Your Event Type
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="section-description"
        >
          Select the type of event you want to plan
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {eventTypes.map((eventType, index) => {
          const Icon = eventType.icon;
          const isSelected = selectedType === eventType.id;
          
          return (
            <motion.div
              key={eventType.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative group cursor-pointer ${
                isSelected ? 'ring-2 ring-pink-500 ring-offset-2 ring-offset-black' : ''
              }`}
              onClick={() => onSelect(eventType.id)}
            >
              <div className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${eventType.gradient} transition-all duration-500 group-hover:shadow-2xl`}>
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-5 h-5 text-pink-600" />
                      </motion.div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{eventType.name}</h3>
                  <p className="text-white/80 mb-4">{eventType.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {eventType.features.map((feature, featureIndex) => (
                      <motion.span
                        key={featureIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: featureIndex * 0.1 }}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
