'use client';

import { motion } from 'framer-motion';
import { 
  Heart, 
  Building, 
  Cake, 
  Gift, 
  Music, 
  Camera,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Zap,
  Award,
  Shield,
  Sparkles
} from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Wedding Planning",
      category: "wedding",
      description: "Complete wedding planning and coordination with premium services",
      features: [
        "Venue selection and booking",
        "Vendor coordination",
        "Timeline management",
        "Budget tracking",
        "Day-of coordination",
        "Guest management"
      ],
      startingPrice: "₹50,000",
      duration: "3-12 months",
      popular: true
    },
    {
      icon: <Building className="w-12 h-12" />,
      title: "Corporate Events",
      category: "corporate",
      description: "Professional corporate event management for businesses",
      features: [
        "Conference planning",
        "Team building events",
        "Product launches",
        "Annual meetings",
        "Brand activations",
        "Networking events"
      ],
      startingPrice: "₹25,000",
      duration: "1-6 months",
      popular: false
    },
    {
      icon: <Cake className="w-12 h-12" />,
      title: "Birthday Celebrations",
      category: "birthday",
      description: "Memorable birthday parties for all ages",
      features: [
        "Theme decoration",
        "Catering services",
        "Entertainment booking",
        "Photography & videography",
        "Cake and desserts",
        "Party favors"
      ],
      startingPrice: "₹15,000",
      duration: "2-4 weeks",
      popular: false
    },
    {
      icon: <Gift className="w-12 h-12" />,
      title: "Anniversary Events",
      category: "anniversary",
      description: "Romantic anniversary celebrations with intimate settings",
      features: [
        "Romantic venue selection",
        "Candlelight dinners",
        "Photography sessions",
        "Flower arrangements",
        "Music and entertainment",
        "Surprise elements"
      ],
      startingPrice: "₹20,000",
      duration: "2-6 weeks",
      popular: false
    },
    {
      icon: <Music className="w-12 h-12" />,
      title: "Festival & Concerts",
      category: "festival",
      description: "Large-scale festival and concert management",
      features: [
        "Venue logistics",
        "Artist management",
        "Sound and lighting",
        "Security coordination",
        "Food and beverage",
        "Crowd management"
      ],
      startingPrice: "₹1,00,000",
      duration: "3-12 months",
      popular: false
    },
    {
      icon: <Camera className="w-12 h-12" />,
      title: "Custom Events",
      category: "custom",
      description: "Bespoke event planning for unique celebrations",
      features: [
        "Custom theme design",
        "Unique venue sourcing",
        "Specialty catering",
        "Custom entertainment",
        "Personalized decor",
        "Exclusive experiences"
      ],
      startingPrice: "₹35,000",
      duration: "1-8 months",
      popular: false
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Discovery & Consultation",
      description: "We understand your vision, requirements, and budget to create a personalized plan.",
      icon: <Users className="w-8 h-8" />
    },
    {
      step: "02",
      title: "Planning & Design",
      description: "Our experts create detailed timelines, budgets, and creative concepts for your event.",
      icon: <Calendar className="w-8 h-8" />
    },
    {
      step: "03",
      title: "Vendor Coordination",
      description: "We connect you with our vetted network of premium vendors and manage all bookings.",
      icon: <Star className="w-8 h-8" />
    },
    {
      step: "04",
      title: "Execution & Management",
      description: "On the day, our team ensures everything runs smoothly while you enjoy your celebration.",
      icon: <CheckCircle className="w-8 h-8" />
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Vetted Vendors",
      description: "All our vendors are carefully selected and quality-assured"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Planning",
      description: "Smart recommendations and automated coordination"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Quality",
      description: "High-end services at competitive prices"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Unique Experiences",
      description: "Customized events that reflect your personality"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-badge mb-8"
            >
              Our Services
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8"
            >
              Complete<br />
              <span className="gradient-text">Event</span><br />
              Solutions
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              From intimate gatherings to grand celebrations, we offer comprehensive event planning services tailored to your unique vision and budget. Our AI-powered platform ensures perfection in every detail.
            </motion.p>

            {/* Benefits Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-purple-400 mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-400">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive event planning solutions for every occasion and budget.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all relative"
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-purple-400 mb-6 flex justify-center">{service.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">{service.title}</h3>
                <p className="text-gray-400 mb-6 text-center leading-relaxed">{service.description}</p>
                
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-white/10 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{service.startingPrice}</div>
                      <div className="text-gray-400 text-sm">Starting Price</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{service.duration}</div>
                      <div className="text-gray-400 text-sm">Duration</div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              Our <span className="gradient-text">Process</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A streamlined approach to creating your perfect event, from concept to execution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                  {step.step}
                </div>
                <div className="text-purple-400 mb-4 flex justify-center">{step.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
                
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform translate-x-4"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-32 px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              Service <span className="gradient-text">Tiers</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose the perfect level of service for your event and budget.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Essential",
                price: "₹15,000",
                description: "Perfect for intimate gatherings and simple celebrations",
                features: [
                  "Basic event coordination",
                  "Vendor recommendations",
                  "Timeline creation",
                  "Day-of support",
                  "Email support"
                ]
              },
              {
                name: "Professional",
                price: "₹35,000",
                description: "Comprehensive planning for medium to large events",
                features: [
                  "Full event planning",
                  "Vendor management",
                  "Budget tracking",
                  "Design consultation",
                  "On-site coordination",
                  "Phone & email support"
                ],
                popular: true
              },
              {
                name: "Premium",
                price: "₹75,000",
                description: "Luxury service for high-end events and celebrations",
                features: [
                  "Concierge-level service",
                  "Custom design & themes",
                  "Premium vendor access",
                  "Full-time coordinator",
                  "VIP guest services",
                  "24/7 support"
                ]
              }
            ].map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 relative"
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2 text-center">{tier.name}</h3>
                <div className="text-4xl font-bold text-white mb-2 text-center">{tier.price}</div>
                <p className="text-gray-400 mb-6 text-center">{tier.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-white/5 border-2 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  Choose {tier.name}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8">
              Ready to Start <span className="gradient-text">Planning?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Let's discuss your event requirements and create something extraordinary together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                Get Free Consultation
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 border-2 border-white/10 rounded-2xl font-semibold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                View Portfolio
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
