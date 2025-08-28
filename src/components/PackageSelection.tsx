'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

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

interface PackageSelectionProps {
  packages: Package[];
  onSelect: (packageId: string) => void;
  onBack: () => void;
  loading: boolean;
  selectedPackage: string | null;
  onPackageSelect: (packageId: string) => void;
}

export default function PackageSelection({ packages, onSelect, onBack, loading, selectedPackage, onPackageSelect }: PackageSelectionProps) {
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
          Step 3 of 4
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          Choose Your Package
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="section-description"
        >
          Select the perfect package for your event
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg, index) => {
          const isSelected = selectedPackage === pkg.id;
          
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`relative group cursor-pointer ${
                isSelected ? 'ring-2 ring-pink-500 ring-offset-2 ring-offset-black' : ''
              }`}
              onClick={() => {
                console.log('🎯 Package card clicked:', pkg.id);
                onPackageSelect(pkg.id);
              }}
            >
              <div className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${pkg.gradient} transition-all duration-500 group-hover:shadow-2xl`}>
                {pkg.popular && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  >
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </motion.div>
                )}
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-black text-white">{pkg.price}</span>
                      <span className="text-white/60 line-through">{pkg.originalPrice}</span>
                    </div>
                    <p className="text-white/80 text-sm">{pkg.description}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: featureIndex * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                        <span className="text-white/90 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.button
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isSelected
                        ? 'bg-white text-purple-600'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSelected ? 'Selected' : 'Select Package'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-8">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-secondary flex-1"
        >
          Back
        </motion.button>
        <motion.button
          onClick={() => {
            console.log('🚀 Continue button clicked with selectedPackage:', selectedPackage);
            if (selectedPackage) {
              onSelect(selectedPackage);
            }
          }}
          disabled={!selectedPackage || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Continue'}
        </motion.button>
      </div>
    </motion.div>
  );
}
