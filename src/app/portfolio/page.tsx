'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Heart, 
  Building, 
  Cake, 
  Gift, 
  Music, 
  Camera,
  Star,
  ArrowRight,
  ArrowLeft,
  Play,
  Users,
  Calendar,
  MapPin,
  Quote,
  Filter,
  Grid,
  List
} from 'lucide-react';

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const filters = [
    { id: 'all', label: 'All Events', icon: <Grid className="w-4 h-4" /> },
    { id: 'wedding', label: 'Weddings', icon: <Heart className="w-4 h-4" /> },
    { id: 'corporate', label: 'Corporate', icon: <Building className="w-4 h-4" /> },
    { id: 'birthday', label: 'Birthdays', icon: <Cake className="w-4 h-4" /> },
    { id: 'anniversary', label: 'Anniversaries', icon: <Gift className="w-4 h-4" /> },
    { id: 'festival', label: 'Festivals', icon: <Music className="w-4 h-4" /> }
  ];

  const portfolioItems = [
    {
      id: 1,
      category: 'wedding',
      title: "Royal Wedding Celebration",
      client: "Priya & Rajesh",
      date: "December 2024",
      location: "Mumbai, Maharashtra",
      description: "A grand traditional wedding with modern touches, featuring 500+ guests and 3-day celebrations.",
      image: "/portfolio/wedding-1.jpg",
      stats: { guests: 500, budget: "₹25L", duration: "3 days" },
      rating: 5,
      testimonial: "EVEA made our dream wedding come true. Every detail was perfect!"
    },
    {
      id: 2,
      category: 'corporate',
      title: "Tech Conference 2024",
      client: "TechCorp India",
      date: "November 2024",
      location: "Bangalore, Karnataka",
      description: "Annual technology conference with 1000+ attendees, featuring keynote speakers and networking sessions.",
      image: "/portfolio/corporate-1.jpg",
      stats: { guests: 1000, budget: "₹15L", duration: "2 days" },
      rating: 5,
      testimonial: "Professional execution and seamless coordination throughout the event."
    },
    {
      id: 3,
      category: 'birthday',
      title: "Sweet 16 Birthday Bash",
      client: "Anjali's Family",
      date: "October 2024",
      location: "Delhi, NCR",
      description: "A magical birthday celebration with themed decorations, live music, and surprise performances.",
      image: "/portfolio/birthday-1.jpg",
      stats: { guests: 150, budget: "₹3L", duration: "1 day" },
      rating: 5,
      testimonial: "Anjali was overjoyed! The party was exactly what she dreamed of."
    },
    {
      id: 4,
      category: 'anniversary',
      title: "Golden Anniversary Gala",
      client: "Mr. & Mrs. Sharma",
      date: "September 2024",
      location: "Pune, Maharashtra",
      description: "50th anniversary celebration with family and close friends in an elegant garden setting.",
      image: "/portfolio/anniversary-1.jpg",
      stats: { guests: 200, budget: "₹8L", duration: "1 day" },
      rating: 5,
      testimonial: "A beautiful celebration of 50 years of love. Thank you EVEA!"
    },
    {
      id: 5,
      category: 'festival',
      title: "Music Festival 2024",
      client: "Entertainment Corp",
      date: "August 2024",
      location: "Goa",
      description: "3-day music festival featuring international artists and local talent with camping facilities.",
      image: "/portfolio/festival-1.jpg",
      stats: { guests: 5000, budget: "₹50L", duration: "3 days" },
      rating: 5,
      testimonial: "Incredible energy and perfect execution. The crowd loved it!"
    },
    {
      id: 6,
      category: 'wedding',
      title: "Destination Wedding",
      client: "Sarah & Michael",
      date: "July 2024",
      location: "Udaipur, Rajasthan",
      description: "International couple's destination wedding in the City of Lakes with traditional Rajasthani elements.",
      image: "/portfolio/wedding-2.jpg",
      stats: { guests: 300, budget: "₹35L", duration: "5 days" },
      rating: 5,
      testimonial: "A magical experience that exceeded all expectations!"
    }
  ];

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  const stats = [
    { number: "500+", label: "Events Completed", icon: <Calendar className="w-8 h-8" /> },
    { number: "50,000+", label: "Happy Guests", icon: <Users className="w-8 h-8" /> },
    { number: "98%", label: "Client Satisfaction", icon: <Star className="w-8 h-8" /> },
    { number: "25+", label: "Cities Served", icon: <MapPin className="w-8 h-8" /> }
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
              Our Portfolio
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8"
            >
              Events That<br />
              <span className="gradient-text">Inspire</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Explore our collection of extraordinary events that showcase our creativity, attention to detail, and commitment to making every celebration unforgettable.
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-purple-400 mb-4 flex justify-center">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-16 px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4"
            >
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all flex items-center gap-2 ${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/5 border-2 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {filter.icon}
                  {filter.label}
                </motion.button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex gap-2"
            >
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-2xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/5 border-2 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-2xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/5 border-2 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-8'}>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all ${
                  viewMode === 'list' ? 'flex md:flex-row flex-col' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative ${viewMode === 'list' ? 'md:w-1/3' : ''}`}>
                  <div className="w-full h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-purple-400" />
                  </div>
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className={`p-6 ${viewMode === 'list' ? 'md:w-2/3' : ''}`}>
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-purple-400 text-sm mb-3">{item.client}</p>
                  <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{item.stats.guests}</div>
                      <div className="text-gray-400 text-xs">Guests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{item.stats.budget}</div>
                      <div className="text-gray-400 text-xs">Budget</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{item.stats.duration}</div>
                      <div className="text-gray-400 text-xs">Duration</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-start gap-3">
                      <Quote className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-300 text-sm italic">"{item.testimonial}"</p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
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
              Featured <span className="gradient-text">Case Studies</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              In-depth look at some of our most challenging and successful events.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {[
              {
                title: "Mega Corporate Conference",
                challenge: "Organizing a 3-day conference for 2000+ attendees across 5 venues",
                solution: "Implemented hybrid event technology with seamless coordination",
                result: "98% attendee satisfaction and 40% cost savings"
              },
              {
                title: "Destination Wedding in Udaipur",
                challenge: "International couple with guests from 15 countries",
                solution: "Multi-cultural coordination with local and international vendors",
                result: "Perfect execution with zero logistical issues"
              }
            ].map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6">{study.title}</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-purple-400 font-semibold mb-2">Challenge</h4>
                    <p className="text-gray-300">{study.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-purple-400 font-semibold mb-2">Solution</h4>
                    <p className="text-gray-300">{study.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-purple-400 font-semibold mb-2">Result</h4>
                    <p className="text-gray-300">{study.result}</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2"
                >
                  Read Full Case Study
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
              Ready to Create Your <span className="gradient-text">Story?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Let's add your event to our portfolio of extraordinary celebrations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                Start Planning
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 border-2 border-white/10 rounded-2xl font-semibold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Schedule Consultation
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
