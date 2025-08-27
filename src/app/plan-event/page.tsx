'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Heart, 
  Building, 
  Cake, 
  Gift, 
  Music, 
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Star,
  Phone,
  MessageCircle,
  Shield,
  Award,
  Zap,
  Crown,
  Sparkles as SparklesIcon,
  ArrowLeft,
  Play,
  Video,
  Camera,
  Instagram
} from 'lucide-react';

export default function PlanEventPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState({
    location: '',
    date: '',
    time: '',
    guests: '',
    budget: 500000,
    description: ''
  });
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showPackages, setShowPackages] = useState(false);
  const [showCallScheduler, setShowCallScheduler] = useState(false);

  const eventTypes = [
    {
      id: 'wedding',
      icon: <Heart className="w-10 h-10" />,
      name: 'Wedding',
      description: 'Create your dream wedding with our comprehensive planning and execution.',
      features: ['Full Planning', '500+ Vendors', 'Premium'],
      avgBudget: '₹15L - ₹50L',
      duration: '6-12 months',
      teamSize: '10-15 people'
    },
    {
      id: 'corporate',
      icon: <Building className="w-10 h-10" />,
      name: 'Corporate Event',
      description: 'Professional events that leave lasting impressions on clients and employees.',
      features: ['Tech Setup', 'Streaming', 'Catering'],
      avgBudget: '₹5L - ₹25L',
      duration: '2-6 months',
      teamSize: '8-12 people'
    },
    {
      id: 'birthday',
      icon: <Cake className="w-10 h-10" />,
      name: 'Birthday Party',
      description: 'Celebrate milestones with unforgettable parties tailored to any age.',
      features: ['Themes', 'Entertainment', 'Decor'],
      avgBudget: '₹50K - ₹5L',
      duration: '1-3 months',
      teamSize: '5-8 people'
    },
    {
      id: 'anniversary',
      icon: <Gift className="w-10 h-10" />,
      name: 'Anniversary',
      description: 'Mark special milestones with elegant celebrations and romantic settings.',
      features: ['Intimate', 'Romantic', 'Memorable'],
      avgBudget: '₹2L - ₹10L',
      duration: '2-4 months',
      teamSize: '6-10 people'
    },
    {
      id: 'festival',
      icon: <Music className="w-10 h-10" />,
      name: 'Festival/Concert',
      description: 'Large-scale events with professional production and crowd management.',
      features: ['Stage Setup', 'Sound', 'Security'],
      avgBudget: '₹10L - ₹1Cr',
      duration: '3-8 months',
      teamSize: '15-25 people'
    },
    {
      id: 'custom',
      icon: <Sparkles className="w-10 h-10" />,
      name: 'Custom Event',
      description: 'Unique celebrations designed specifically for your vision and requirements.',
      features: ['Flexible', 'Creative', 'Unique'],
      avgBudget: '₹1L - ₹50L',
      duration: '1-6 months',
      teamSize: '5-20 people'
    }
  ];

  const packages = [
    {
      id: 'basic',
      name: 'Basic',
      price: '₹50K',
      originalPrice: '₹75K',
      description: 'Perfect for intimate gatherings and simple celebrations',
      features: [
        'Event Planning Consultation',
        'Vendor Coordination',
        'Basic Decoration Setup',
        'Event Day Management',
        '10-Person EVEA Team',
        'Basic Photography',
        'Standard Catering Options'
      ],
      icon: <Zap className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '₹1.5L',
      originalPrice: '₹2L',
      description: 'Comprehensive planning for memorable events',
      features: [
        'Everything in Basic',
        'Premium Vendor Selection',
        'Custom Theme Design',
        'Advanced Decoration',
        'Professional Photography & Video',
        'Entertainment Coordination',
        'Guest Management System',
        'Post-Event Support'
      ],
      icon: <Award className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₹3L',
      originalPrice: '₹4L',
      description: 'Luxury experience with exclusive features',
      features: [
        'Everything in Professional',
        'Luxury Venue Selection',
        'Celebrity Chef Catering',
        'Live Entertainment',
        'Instagram Story Creation',
        'Social Media Management',
        'VIP Guest Services',
        'Luxury Transportation',
        'Premium Photography Package',
        'Event Video Documentary'
      ],
      icon: <Crown className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      popular: false
    }
  ];

  const formatBudget = (value: number) => {
    if (value < 100000) {
      return `₹${(value / 1000).toFixed(0)}K`;
    } else if (value < 10000000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    }
  };

  const handleEventSelect = (eventId: string) => {
    setSelectedEvent(eventId);
    setCurrentStep(2);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPackages(true);
    setCurrentStep(3);
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowCallScheduler(true);
    setCurrentStep(4);
  };

  const handleScheduleCall = () => {
    // This would integrate with a calendar booking system
    alert('Call scheduling feature will be integrated with calendar system');
  };

  return (
    <div className="min-h-screen">


      {/* Step 1: Event Type Selection */}
      {currentStep === 1 && (
        <section className="min-h-screen flex items-center justify-center relative px-6 lg:px-8 pt-32">
          <div className="max-w-6xl mx-auto text-center">

            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-title"
            >
              What Type of<br />
              <span className="gradient-text">Event</span> Are You Planning?
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-16"
            >
              Choose your event type and we'll customize the perfect experience for you.
            </motion.p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventTypes.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => handleEventSelect(event.id)}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 cursor-pointer card-hover group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {event.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{event.name}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{event.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Avg. Budget:</span>
                      <span className="text-pink-400 font-semibold">{event.avgBudget}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-purple-400 font-semibold">{event.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Team Size:</span>
                      <span className="text-cyan-400 font-semibold">{event.teamSize}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {event.features.map((feature, featureIndex) => (
                      <span key={featureIndex} className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-xs text-pink-400">
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Step 2: Event Details Form */}
      {currentStep === 2 && (
        <section className="min-h-screen flex items-center justify-center relative px-6 lg:px-8 pt-32">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-6xl font-black mb-4">
                    Event <span className="gradient-text">Details</span>
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Tell us about your {eventTypes.find(e => e.id === selectedEvent)?.name.toLowerCase()} and we'll create the perfect package
                  </p>
                </div>
                
                <form onSubmit={handleDetailsSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Event Location
                      </label>
                      <input
                        type="text"
                        placeholder="Enter city or venue"
                        value={eventDetails.location}
                        onChange={(e) => setEventDetails({...eventDetails, location: e.target.value})}
                        className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                        <Users className="w-4 h-4 inline mr-2" />
                        Guest Count
                      </label>
                      <input
                        type="number"
                        placeholder="Expected number of guests"
                        value={eventDetails.guests}
                        onChange={(e) => setEventDetails({...eventDetails, guests: e.target.value})}
                        className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={eventDetails.date}
                        onChange={(e) => setEventDetails({...eventDetails, date: e.target.value})}
                        className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white focus:border-pink-500 focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Event Time
                      </label>
                      <input
                        type="time"
                        value={eventDetails.time}
                        onChange={(e) => setEventDetails({...eventDetails, time: e.target.value})}
                        className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white focus:border-pink-500 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Budget Range
                    </label>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="50000"
                        max="5000000"
                        value={eventDetails.budget}
                        onChange={(e) => setEventDetails({...eventDetails, budget: parseInt(e.target.value)})}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Your Budget:</span>
                        <span className="text-4xl font-black gradient-text">{formatBudget(eventDetails.budget)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                      <MessageCircle className="w-4 h-4 inline mr-2" />
                      Additional Details
                    </label>
                    <textarea
                      placeholder="Tell us about your vision, theme, or any special requirements..."
                      value={eventDetails.description}
                      onChange={(e) => setEventDetails({...eventDetails, description: e.target.value})}
                      rows={4}
                      className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-8">
                    <motion.button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-6 bg-white/5 border-2 border-white/10 rounded-2xl text-white font-bold text-lg hover:border-pink-500 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl text-white font-bold text-lg hover:shadow-lg hover:shadow-pink-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      View Packages
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Step 3: Package Selection */}
      {showPackages && (
        <section className="min-h-screen py-32 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-24"
            >
              <h2 className="section-title">
                Choose Your <span className="gradient-text">Perfect Package</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Based on your {eventTypes.find(e => e.id === selectedEvent)?.name.toLowerCase()} details, 
                we've curated these packages just for you
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative bg-white/5 backdrop-blur-sm border rounded-3xl p-8 ${
                    pkg.popular 
                      ? 'border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-purple-500/10' 
                      : 'border-white/10'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${pkg.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      {pkg.icon}
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{pkg.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-4xl font-black gradient-text">{pkg.price}</span>
                      <span className="text-gray-400 line-through">{pkg.originalPrice}</span>
                    </div>
                    <p className="text-gray-400">{pkg.description}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => handlePackageSelect(pkg.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:shadow-pink-500/25'
                        : 'bg-white/5 border border-white/10 text-white hover:border-pink-500'
                    }`}
                  >
                    Select {pkg.name}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center mt-16"
            >
              <button
                onClick={() => setCurrentStep(2)}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Details
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Step 4: Call Scheduling */}
      {showCallScheduler && (
        <section className="min-h-screen flex items-center justify-center relative px-6 lg:px-8 pt-32">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 relative overflow-hidden text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5"></div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black mb-6">
                  Perfect! <span className="gradient-text">Package Selected</span>
                </h2>
                
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                  You've selected the <span className="text-pink-400 font-semibold">
                    {packages.find(p => p.id === selectedPackage)?.name}
                  </span> package. 
                  Now let's schedule a call with our EVEA team to fine-tune every detail.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white/5 rounded-2xl p-6">
                    <Phone className="w-8 h-8 text-pink-500 mx-auto mb-4" />
                    <h3 className="font-bold mb-2">30-Minute Call</h3>
                    <p className="text-gray-400 text-sm">Deep dive into your vision and requirements</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6">
                    <Shield className="w-8 h-8 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Expert Team</h3>
                    <p className="text-gray-400 text-sm">10-person dedicated team for your event</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6">
                    <Instagram className="w-8 h-8 text-cyan-500 mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Premium Features</h3>
                    <p className="text-gray-400 text-sm">Instagram stories included in premium package</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <motion.button
                    onClick={handleScheduleCall}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-12 py-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl text-white font-bold text-lg hover:shadow-lg hover:shadow-pink-500/25 transition-all flex items-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Schedule Call Now
                  </motion.button>
                  <motion.button
                    onClick={() => setCurrentStep(3)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-12 py-6 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-lg hover:border-pink-500 transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Packages
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
