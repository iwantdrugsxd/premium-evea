'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, Star } from 'lucide-react';

interface EventType {
  id: number;
  name: string;
  icon: string;
  description: string;
  features: string[];
  avgBudget: string;
  duration: string;
  teamSize: string;
  serviceCategories: string[];
  packages: any[];
  availableServices: string[];
}

interface EventTypeSelectionProps {
  eventTypes: EventType[];
  onSelect: (type: string) => void;
  selectedType: string | null;
}

export default function EventTypeSelection({ eventTypes, onSelect, selectedType }: EventTypeSelectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto"
    >
      {/* Enhanced Header Section */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-400/20 backdrop-blur-sm rounded-full text-purple-300 text-sm mb-6 border border-purple-500/30 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="font-semibold">Step 1 of 6</span>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-white via-purple-100 to-cyan-100 bg-clip-text text-transparent"
        >
          Choose Your Event Type
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          Select from our curated Indian event types with traditional services. Each event comes with comprehensive packages tailored to your needs.
        </motion.p>

        {/* Event Count Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 backdrop-blur-sm rounded-full text-gray-300 text-sm mt-6 border border-gray-700"
        >
          <Star className="w-4 h-4 text-yellow-400" />
          <span>{eventTypes.length} Event Types Available</span>
        </motion.div>
      </div>

      {/* Enhanced Event Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {eventTypes.map((eventType, index) => {
          const isSelected = selectedType === eventType.name;
          
          return (
            <motion.div
              key={eventType.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.03,
                y: -8,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className={`relative group cursor-pointer ${
                isSelected ? 'ring-2 ring-purple-500 ring-offset-4 ring-offset-black' : ''
              }`}
              onClick={() => onSelect(eventType.name)}
            >
              {/* Card Container */}
              <div className={`relative h-full backdrop-blur-sm border rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 ${
                isSelected 
                  ? 'bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-cyan-400/10 border-purple-500/50 shadow-2xl shadow-purple-500/30' 
                  : 'bg-gray-900/30 border-gray-700 hover:border-purple-500/30 hover:bg-gray-800/40'
              }`}>
                
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                )}

                {/* Event Icon */}
                <motion.div 
                  className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 shadow-lg shadow-purple-500/25' 
                      : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/30 group-hover:to-blue-500/30'
                  }`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <span className="text-4xl filter drop-shadow-lg">{eventType.icon}</span>
                </motion.div>
                
                {/* Event Name */}
                <h3 className={`text-2xl font-bold text-center mb-4 transition-all duration-300 ${
                  isSelected ? 'text-white' : 'text-gray-100 group-hover:text-white'
                }`}>
                  {eventType.name}
                </h3>

                {/* Service Count Badge */}
                <div className="text-center mb-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    isSelected 
                      ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50' 
                      : 'bg-gray-800/50 text-gray-400 border border-gray-600 group-hover:bg-gray-700/50 group-hover:text-gray-300'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    {eventType.serviceCategories.length} Services
                  </span>
                </div>

                {/* Package Count Badge */}
                <div className="text-center mb-6">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    isSelected 
                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50' 
                      : 'bg-gray-800/50 text-gray-400 border border-gray-600 group-hover:bg-gray-700/50 group-hover:text-gray-300'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    {eventType.packages.length} Packages
                  </span>
              </div>

                {/* Hover Effect Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent rounded-3xl pointer-events-none"
                />

                {/* Click to Select Text */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="text-center mt-4"
                >
                  <span className={`text-xs font-medium transition-all duration-300 ${
                    isSelected ? 'text-purple-300' : 'text-gray-500 group-hover:text-gray-400'
                  }`}>
                    {isSelected ? '✓ Selected' : 'Click to Select'}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-16"
      >
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-400/10 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-3">Ready to Get Started?</h3>
          <p className="text-gray-300 mb-4">
            Select an event type above to begin planning your perfect celebration. Each event comes with comprehensive packages and services.
          </p>
          <div className="flex items-center justify-center gap-2 text-purple-300 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Professional planning • Premium services • Indian hospitality</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
