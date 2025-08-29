'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Check, Star, AlertCircle } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  isRequired: boolean;
  isPopular: boolean;
}

interface ServiceSelectionProps {
  eventId: number;
  onServicesSelected: (selectedServices: Service[]) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function ServiceSelection({ 
  eventId, 
  onServicesSelected, 
  onBack, 
  onContinue 
}: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [groupedServices, setGroupedServices] = useState<Record<string, Service[]>>({});
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, [eventId]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/event-services?event_id=${eventId}`);
      const data = await response.json();

      if (data.success) {
        setServices(data.services);
        setGroupedServices(data.groupedServices);
        
        // Auto-select required services
        const requiredServices = data.services.filter((service: Service) => service.isRequired);
        setSelectedServices(requiredServices);
        onServicesSelected(requiredServices);
      } else {
        setError(data.error || 'Failed to fetch services');
      }
    } catch (err) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (service: Service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    let newSelectedServices: Service[];

    if (isSelected) {
      // Don't allow deselecting required services
      if (service.isRequired) return;
      newSelectedServices = selectedServices.filter(s => s.id !== service.id);
    } else {
      newSelectedServices = [...selectedServices, service];
    }

    setSelectedServices(newSelectedServices);
    onServicesSelected(newSelectedServices);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'photography':
        return '📸';
      case 'catering':
        return '🍽️';
      case 'decoration':
        return '🎨';
      case 'entertainment':
        return '🎵';
      case 'transportation':
        return '🚗';
      case 'venue':
        return '🏢';
      case 'technology':
        return '💻';
      case 'beauty & makeup':
        return '💄';
      case 'stationery':
        return '📝';
      case 'gifts & souvenirs':
        return '🎁';
      case 'food & beverages':
        return '🍰';
      case 'event management':
        return '📋';
      case 'branding':
        return '🏷️';
      default:
        return '✨';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading services...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchServices}
          className="btn-primary"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div className="section-label">Select Services</div>
        <h2 className="text-4xl md:text-6xl font-black leading-none mb-6">
          Choose Your<br />
          <span className="gradient-text">Event Services</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Select the services you need for your event. Required services are pre-selected.
        </p>
      </div>

      {/* Services by Category */}
      <div className="space-y-8">
        {Object.entries(groupedServices).map(([category, categoryServices], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{getCategoryIcon(category)}</span>
              <h3 className="text-2xl font-bold text-white">{category}</h3>
              <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                {categoryServices.length} services
              </span>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {categoryServices.map((service, serviceIndex) => {
                const isSelected = selectedServices.some(s => s.id === service.id);
                const isRequired = service.isRequired;

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: serviceIndex * 0.05 }}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    } ${isRequired ? 'ring-2 ring-orange-500/50' : ''}`}
                    onClick={() => toggleService(service)}
                  >
                    {/* Required Badge */}
                    {isRequired && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Required
                      </div>
                    )}

                    {/* Popular Badge */}
                    {service.isPopular && !isRequired && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Popular
                      </div>
                    )}

                    {/* Service Content */}
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-white/30'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-2">{service.name}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selection Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Selected Services</h3>
          <span className="text-purple-400 font-semibold">
            {selectedServices.length} services selected
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {selectedServices.map((service) => (
            <div key={service.id} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">{service.name}</span>
              {service.isRequired && (
                <span className="text-orange-400 text-xs">(Required)</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex justify-between items-center mt-12"
      >
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          Back
        </button>
        
        <button
          onClick={onContinue}
          disabled={selectedServices.length === 0}
          className={`btn-primary ${
            selectedServices.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Continue with {selectedServices.length} Services
        </button>
      </motion.div>
    </motion.div>
  );
}
