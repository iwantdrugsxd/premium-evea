'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function PackagesPage() {
  const packages = [
    {
      label: "Best for starters",
      name: "Basic",
      price: "₹50K",
      features: [
        "Event planning consultation",
        "Vendor coordination",
        "5 EVEA team members",
        "Basic decoration setup",
        "Day-of coordination",
        "Digital invitation design"
      ]
    },
    {
      label: "Most Popular",
      name: "Professional",
      price: "₹2L",
      features: [
        "Everything in Basic",
        "Premium vendor selection",
        "8 EVEA team members",
        "Advanced decoration & lighting",
        "Photography & videography",
        "Guest management system",
        "Post-event cleanup"
      ],
      featured: true
    },
    {
      label: "Ultimate Experience",
      name: "Premium",
      price: "₹5L",
      features: [
        "Everything in Professional",
        "Exclusive vendor access",
        "10 EVEA team members",
        "Custom theme development",
        "Instagram story creation",
        "Live streaming setup",
        "Celebrity appearances coordination",
        "Luxury transportation"
      ]
    }
  ];

  const comparisonData = [
    {
      feature: "EVEA Team Members",
      basic: "5",
      professional: "8",
      premium: "10"
    },
    {
      feature: "Vendor Quality",
      basic: "Standard",
      professional: "Premium",
      premium: "Exclusive"
    },
    {
      feature: "Photography",
      basic: false,
      professional: true,
      premium: true
    },
    {
      feature: "Instagram Stories",
      basic: false,
      professional: false,
      premium: true
    },
    {
      feature: "Live Streaming",
      basic: false,
      professional: false,
      premium: true
    },
    {
      feature: "Payment Terms",
      basic: "50-50",
      professional: "50-50",
      premium: "Flexible"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="aurora-bg">
        <div className="aurora"></div>
      </div>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-badge"
        >
          Transparent Pricing
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
                      className="hero-title"
        >
          Choose Your<br />
          <span className="gradient-text">Perfect Package</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-400 max-w-3xl mx-auto"
        >
          Every package includes our dedicated team, verified vendors, and complete event management.
        </motion.p>
      </section>

      {/* Package Cards */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 relative card-hover ${
                  pkg.featured ? 'scale-105 border-purple-500/30' : ''
                }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="text-purple-500 text-sm font-semibold mb-4">{pkg.label}</div>
                <h3 className="text-3xl font-bold mb-4">{pkg.name}</h3>
                <div className="text-5xl font-black gradient-text mb-2">{pkg.price}</div>
                <div className="text-gray-400 mb-8">Starting from</div>
                
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                  pkg.featured 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25' 
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}>
                  Select {pkg.name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              Compare <span className="gradient-text">Features</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden"
          >
            {/* Table Header */}
            <div className="grid grid-cols-4 bg-purple-500/10 p-6 font-bold text-sm uppercase tracking-wider">
              <div>Features</div>
              <div>Basic</div>
              <div>Professional</div>
              <div>Premium</div>
            </div>

            {/* Table Rows */}
            {comparisonData.map((row, index) => (
              <div 
                key={index}
                className="grid grid-cols-4 p-6 border-b border-white/5 hover:bg-purple-500/5 transition-colors"
              >
                <div className="text-gray-400">{row.feature}</div>
                <div className="text-center">
                  {typeof row.basic === 'boolean' ? (
                    row.basic ? (
                      <Check className="w-5 h-5 text-purple-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    )
                  ) : (
                    <span className="text-white">{row.basic}</span>
                  )}
                </div>
                <div className="text-center">
                  {typeof row.professional === 'boolean' ? (
                    row.professional ? (
                      <Check className="w-5 h-5 text-purple-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    )
                  ) : (
                    <span className="text-white">{row.professional}</span>
                  )}
                </div>
                <div className="text-center">
                  {typeof row.premium === 'boolean' ? (
                    row.premium ? (
                      <Check className="w-5 h-5 text-purple-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    )
                  ) : (
                    <span className="text-white">{row.premium}</span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-8"
          >
            Ready to <span className="gradient-text">Get Started?</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 mb-12"
          >
            Schedule a call with our experts to customize your package.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all">
              Schedule Consultation
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white/20 rounded-2xl font-semibold text-white hover:border-purple-500 transition-all">
              Contact Support
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
