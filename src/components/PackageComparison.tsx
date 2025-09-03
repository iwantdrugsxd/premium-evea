'use client';

import { motion } from 'framer-motion';

interface Row {
  feature: string;
  basic: string | boolean;
  professional: string | boolean;
  premium: string | boolean;
}

interface PackageComparisonProps {
  rows: Row[];
}

export default function PackageComparison({ rows }: PackageComparisonProps) {
  return (
    <section className="max-w-6xl mx-auto mt-16">
      <h2 className="text-4xl font-extrabold text-center mb-8">
        Compare <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">Features</span>
      </h2>

      <div className="rounded-3xl overflow-hidden backdrop-blur-sm border border-white/10 bg-white/5">
        <div className="grid grid-cols-4 px-8 py-6 bg-purple-500/10 font-bold uppercase tracking-widest text-xs">
          <div>Features</div>
          <div>Basic</div>
          <div>Professional</div>
          <div>Premium</div>
        </div>

        {rows.map((row, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="grid grid-cols-4 px-8 py-5 border-t border-white/10 hover:bg-purple-500/5 transition"
          >
            <div className="text-gray-300">{row.feature}</div>
            <div>{renderCell(row.basic)}</div>
            <div>{renderCell(row.professional)}</div>
            <div>{renderCell(row.premium)}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function renderCell(value: string | boolean) {
  if (typeof value === 'boolean') {
    return (
      <span className={`text-xl ${value ? 'text-purple-400' : 'text-gray-600'}`}>
        {value ? '✓' : '✗'}
      </span>
    );
  }
  return <span className="text-gray-200">{value}</span>;
}


