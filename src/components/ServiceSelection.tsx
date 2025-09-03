'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';

interface Service {
  id: number;
  service_name: string;
  service_description: string;
  category: string;
  is_required: boolean;
  is_popular: boolean;
}

interface ServiceSelectionProps {
  services: Service[];
  onServicesSelected: (services: string[]) => void;
  onBack: () => void;
}

export default function ServiceSelection({ services, onServicesSelected, onBack }: ServiceSelectionProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceToggle = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Add a small delay for better UX
    setTimeout(() => {
      onServicesSelected(selectedServices);
      setIsSubmitting(false);
    }, 500);
  };

  const requiredServices = services.filter(s => s.is_required);
  const optionalServices = services.filter(s => !s.is_required);
  const popularServices = services.filter(s => s.is_popular);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-green-400/20 backdrop-blur-sm rounded-full text-blue-300 text-sm mb-6 border border-blue-500/30 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="font-semibold">Step 2 of 6</span>
          <Sparkles className="w-4 h-4 text-blue-400" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent"
        >
          Select Your Services
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          Choose the services you need for your event. Required services are marked and popular services are highlighted.
        </motion.p>

        {/* Service Count Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 backdrop-blur-sm rounded-full text-gray-300 text-sm mt-6 border border-gray-700"
        >
          <Star className="w-4 h-4 text-yellow-400" />
          <span>{services.length} Services Available • {selectedServices.length} Selected</span>
        </motion.div>
      </div>

      {/* Required Services Section */}
      {requiredServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-sm font-bold">!</span>
            Required Services
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requiredServices.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-red-500/20"
                onClick={() => handleServiceToggle(service.service_name)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">{service.service_name}</h4>
                  <CheckCircle className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-gray-300 text-sm mb-3">{service.service_description}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">Required</span>
                  <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">{service.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Popular Services Section */}
      {popularServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 text-sm font-bold">⭐</span>
            Popular Services
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularServices.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={`border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedServices.includes(service.service_name)
                    ? 'bg-yellow-500/20 border-yellow-500/50 shadow-lg shadow-yellow-500/25'
                    : 'bg-gray-900/30 border-gray-700 hover:border-yellow-500/30 hover:bg-gray-800/40'
                }`}
                onClick={() => handleServiceToggle(service.service_name)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">{service.service_name}</h4>
                  {selectedServices.includes(service.service_name) ? (
                    <CheckCircle className="w-6 h-6 text-yellow-400" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-3">{service.service_description}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">Popular</span>
                  <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">{service.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Services Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-12"
      >
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-sm font-bold">🔧</span>
          All Available Services
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedServices.includes(service.service_name)
                  ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/25'
                  : 'bg-gray-900/30 border-gray-700 hover:border-blue-500/30 hover:bg-gray-800/40'
              }`}
              onClick={() => handleServiceToggle(service.service_name)}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-semibold text-white">{service.service_name}</h4>
                {selectedServices.includes(service.service_name) ? (
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-500 rounded-full"></div>
                )}
              </div>
              <p className="text-gray-300 text-sm mb-3">{service.service_description}</p>
              <div className="flex items-center gap-2">
                {service.is_required && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">Required</span>
                )}
                {service.is_popular && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">Popular</span>
                )}
                <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">{service.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-between items-center"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl text-white hover:bg-gray-700/50 transition-all duration-300"
        >
          ← Back
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl font-semibold text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              Continue with {selectedServices.length} Services →
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
