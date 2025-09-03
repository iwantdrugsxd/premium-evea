'use client';

import { motion } from 'framer-motion';
import PackageCards, { Package as CardPackage } from './PackageCards';
import PackageComparison from './PackageComparison';

interface Package {
  id: number;
  name: string;
  description: string;
  price: string;
  features: string[];
  service_ids: number[];
  event_id: number;
  created_at: string;
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
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-label"
        >
          Step 4 of 6
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
          Choose from our Indian event packages: Basic, Standard, and Premium
        </motion.p>
      </div>

      <PackageCards
        packages={packages.map<CardPackage>(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          features: p.features || []
        }))}
        selectedPackageName={selectedPackage}
        onSelect={(name) => onPackageSelect(name)}
      />

      {/* Comparison Table */}
      <PackageComparison
        rows={[
          { feature: 'EVEA Team Members', basic: '5', professional: '8', premium: '10' },
          { feature: 'Vendor Quality', basic: 'Standard', professional: 'Premium', premium: 'Exclusive' },
          { feature: 'Photography', basic: false, professional: true, premium: true },
          { feature: 'Instagram Stories', basic: false, professional: false, premium: true },
          { feature: 'Live Streaming', basic: false, professional: false, premium: true },
          { feature: 'Payment Terms', basic: '50-50', professional: '50-50', premium: 'Flexible' }
        ]}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 pt-8">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-secondary px-8"
        >
          Back
        </motion.button>
        <motion.button
          onClick={() => {
            if (selectedPackage) onSelect(selectedPackage);
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
