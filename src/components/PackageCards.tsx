'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface Package {
  id: number | null;
  name: string; // basic | professional | premium
  description?: string;
  price?: string; // e.g., "₹50K - ₹1L" or "₹2L"
  features: string[];
}

interface PackageCardsProps {
  packages: Package[];
  selectedPackageName: string | null;
  onSelect: (packageName: string) => void;
}

function getBadgeFor(name: string): { label: string; variant: 'starter' | 'popular' | 'ultimate' } {
  switch (name) {
    case 'basic':
      return { label: 'Best for starters', variant: 'starter' };
    case 'professional':
      return { label: 'Most Popular', variant: 'popular' };
    default:
      return { label: 'Ultimate Experience', variant: 'ultimate' };
  }
}

function getPrimaryPrice(price?: string): string {
  if (!price) return '—';
  // Prefer the first token before a space or hyphen, to mimic "Starting from"
  const token = price.split(/[\s-]+/)[0];
  return token || price;
}

export default function PackageCards({ packages, selectedPackageName, onSelect }: PackageCardsProps) {
  const ordered = ['basic', 'professional', 'premium'];
  const sorted = [...packages].sort((a, b) => ordered.indexOf(a.name) - ordered.indexOf(b.name));

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {sorted.map((pkg, index) => {
        const isSelected = selectedPackageName === pkg.name;
        const badge = getBadgeFor(pkg.name);
        const isFeatured = pkg.name === 'professional';

        return (
          <motion.div
            key={pkg.id ?? `pkg-${pkg.name}-${index}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, rotateX: 2 }}
            className={`relative rounded-3xl border overflow-hidden ${
              isFeatured ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30' : 'bg-white/5 border-white/10'
            } ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black' : ''}`}
          >
            {/* Top gradient bar */}
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400" />

            {/* Featured ribbon */}
            {isFeatured && (
              <div className="absolute top-6 -right-10 rotate-45 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[11px] font-bold px-10 py-1 tracking-wider">
                MOST POPULAR
              </div>
            )}

            <div className="p-8 flex flex-col h-full">
              <div className="text-[12px] uppercase tracking-[0.2em] mb-3 font-semibold text-purple-400">
                {badge.label}
              </div>
              <h3 className="text-3xl font-extrabold mb-2 capitalize">{pkg.name}</h3>
              <div className="text-5xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-2">
                {getPrimaryPrice(pkg.price)}
              </div>
              <div className="text-sm text-gray-400 mb-6">Starting from</div>

              <ul className="space-y-4 mb-8">
                {pkg.features?.slice(0, 8).map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400">
                      <Check className="w-4 h-4" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelect(pkg.name)}
                className={`mt-auto w-full relative overflow-hidden font-bold rounded-2xl py-3 transition-all ${
                  isFeatured
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white border-none'
                    : 'bg-white/5 text-white border-2 border-white/10 hover:bg-white/10'
                }`}
              >
                {isSelected ? 'Selected' : `Select ${pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1)}`}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}


