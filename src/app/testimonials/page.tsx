'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Star, 
  Quote, 
  Heart, 
  Users, 
  Calendar, 
  MapPin,
  ArrowRight,
  ArrowLeft,
  Play,
  CheckCircle,
  Award,
  ThumbsUp,
  MessageCircle,
  Camera,
  Music,
  Gift
} from 'lucide-react';

export default function TestimonialsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const filters = [
    { id: 'all', label: 'All Events', icon: <Users className="w-4 h-4" /> },
    { id: 'wedding', label: 'Weddings', icon: <Heart className="w-4 h-4" /> },
    { id: 'corporate', label: 'Corporate', icon: <Calendar className="w-4 h-4" /> },
    { id: 'birthday', label: 'Birthdays', icon: <Gift className="w-4 h-4" /> },
    { id: 'anniversary', label: 'Anniversaries', icon: <Heart className="w-4 h-4" /> }
  ];

  const testimonials = [
    {
      id: 1,
      category: 'wedding',
      clientName: "Priya & Rajesh",
      event: "Royal Wedding Celebration",
      date: "December 2024",
      location: "Mumbai, Maharashtra",
      rating: 5,
      review: "EVEA transformed our wedding dreams into reality! From the initial planning to the final execution, every detail was perfect. The team's attention to detail and creativity exceeded our expectations. Our guests are still talking about how magical the evening was. Thank you EVEA for making our special day unforgettable!",
      highlights: ["500+ guests", "3-day celebration", "Traditional + Modern fusion"],
      image: "/testimonials/wedding-1.jpg",
      video: "/testimonials/wedding-1.mp4",
      services: ["Venue", "Catering", "Decoration", "Photography", "Entertainment"]
    },
    {
      id: 2,
      category: 'corporate',
      clientName: "TechCorp India",
      event: "Annual Tech Conference",
      date: "November 2024",
      location: "Bangalore, Karnataka",
      rating: 5,
      review: "EVEA delivered an exceptional corporate event that exceeded all our expectations. The seamless coordination, professional execution, and innovative use of technology made our conference a huge success. Our attendees were impressed with the smooth experience and high-quality arrangements.",
      highlights: ["1000+ attendees", "Hybrid event", "5 venues coordinated"],
      image: "/testimonials/corporate-1.jpg",
      video: "/testimonials/corporate-1.mp4",
      services: ["Venue Management", "AV Setup", "Catering", "Networking Sessions"]
    },
    {
      id: 3,
      category: 'birthday',
      clientName: "Anjali's Family",
      event: "Sweet 16 Birthday Bash",
      date: "October 2024",
      location: "Delhi, NCR",
      rating: 5,
      review: "Anjali's 16th birthday was absolutely magical! EVEA created a perfect blend of fun and elegance. The themed decorations, live music, and surprise performances made it a night to remember. The team understood exactly what we wanted and delivered beyond our imagination.",
      highlights: ["150 guests", "Themed decoration", "Live entertainment"],
      image: "/testimonials/birthday-1.jpg",
      video: "/testimonials/birthday-1.mp4",
      services: ["Theme Design", "Decoration", "Catering", "Entertainment", "Photography"]
    },
    {
      id: 4,
      category: 'anniversary',
      clientName: "Mr. & Mrs. Sharma",
      event: "Golden Anniversary Gala",
      date: "September 2024",
      location: "Pune, Maharashtra",
      rating: 5,
      review: "Celebrating 50 years of love with EVEA was the perfect choice. The romantic garden setting, elegant decorations, and intimate atmosphere created the most beautiful celebration. Every detail reflected our journey together. Thank you for making our golden anniversary truly special.",
      highlights: ["200 guests", "Garden venue", "Romantic theme"],
      image: "/testimonials/anniversary-1.jpg",
      video: "/testimonials/anniversary-1.mp4",
      services: ["Venue Selection", "Decoration", "Catering", "Photography", "Music"]
    },
    {
      id: 5,
      category: 'wedding',
      clientName: "Sarah & Michael",
      event: "Destination Wedding",
      date: "July 2024",
      location: "Udaipur, Rajasthan",
      rating: 5,
      review: "Our destination wedding in Udaipur was a fairy tale come true! EVEA handled everything from international guest coordination to local vendor management with perfection. The blend of traditional Rajasthani elements with modern luxury was exactly what we dreamed of.",
      highlights: ["300 guests", "5-day celebration", "International couple"],
      image: "/testimonials/wedding-2.jpg",
      video: "/testimonials/wedding-2.mp4",
      services: ["Destination Planning", "Vendor Management", "Guest Coordination", "Cultural Integration"]
    },
    {
      id: 6,
      category: 'corporate',
      clientName: "StartupXYZ",
      event: "Product Launch Event",
      date: "June 2024",
      location: "Mumbai, Maharashtra",
      rating: 5,
      review: "EVEA helped us launch our product with style and impact! The innovative event design, seamless technology integration, and professional execution made our launch a huge success. The media coverage and investor interest exceeded our expectations.",
      highlights: ["200+ attendees", "Media coverage", "Investor networking"],
      image: "/testimonials/corporate-2.jpg",
      video: "/testimonials/corporate-2.mp4",
      services: ["Event Design", "AV Setup", "Media Management", "Networking"]
    }
  ];

  const filteredTestimonials = activeFilter === 'all' 
    ? testimonials 
    : testimonials.filter(item => item.category === activeFilter);

  const stats = [
    { number: "500+", label: "Happy Clients", icon: <Users className="w-8 h-8" /> },
    { number: "98%", label: "Satisfaction Rate", icon: <Star className="w-8 h-8" /> },
    { number: "4.9/5", label: "Average Rating", icon: <ThumbsUp className="w-8 h-8" /> },
    { number: "1000+", label: "Events Completed", icon: <Calendar className="w-8 h-8" /> }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === filteredTestimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? filteredTestimonials.length - 1 : prev - 1
    );
  };

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
              Client Testimonials
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8"
            >
              What Our<br />
              <span className="gradient-text">Clients Say</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Real stories from real clients who experienced the EVEA magic. Discover why we're India's most trusted event planning platform.
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
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
        </div>
      </section>

      {/* Featured Testimonial */}
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
              Featured <span className="gradient-text">Testimonials</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Handpicked stories that showcase the extraordinary experiences we create.
            </p>
          </motion.div>

          {filteredTestimonials.length > 0 && (
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 relative"
            >
              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ArrowRight className="w-6 h-6 text-white" />
              </button>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Content */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(filteredTestimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <div className="mb-6">
                    <Quote className="w-12 h-12 text-purple-400 mb-4" />
                    <p className="text-xl text-gray-300 leading-relaxed italic">
                      "{filteredTestimonials[currentTestimonial].review}"
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {filteredTestimonials[currentTestimonial].clientName}
                    </h3>
                    <p className="text-purple-400 text-lg mb-2">
                      {filteredTestimonials[currentTestimonial].event}
                    </p>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {filteredTestimonials[currentTestimonial].date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {filteredTestimonials[currentTestimonial].location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Event Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {filteredTestimonials[currentTestimonial].highlights.map((highlight, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-3">Services Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {filteredTestimonials[currentTestimonial].services.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side - Media */}
                <div className="relative">
                  <div className="w-full h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                    <Camera className="w-24 h-24 text-purple-400" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* All Testimonials Grid */}
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
              All <span className="gradient-text">Reviews</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Browse through all our client testimonials and success stories.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all"
              >
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                {/* Review */}
                <div className="mb-6">
                  <Quote className="w-8 h-8 text-purple-400 mb-3" />
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                    "{testimonial.review}"
                  </p>
                </div>
                
                {/* Client Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {testimonial.clientName}
                  </h3>
                  <p className="text-purple-400 text-sm mb-2">
                    {testimonial.event}
                  </p>
                  <div className="flex items-center gap-4 text-gray-400 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {testimonial.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                
                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="text-white font-semibold text-sm mb-2">Highlights</h4>
                  <div className="flex flex-wrap gap-1">
                    {testimonial.highlights.slice(0, 2).map((highlight, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Services */}
                <div>
                  <h4 className="text-white font-semibold text-sm mb-2">Services</h4>
                  <div className="flex flex-wrap gap-1">
                    {testimonial.services.slice(0, 3).map((service, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/10 text-gray-300 rounded-full text-xs"
                      >
                        {service}
                      </span>
                    ))}
                    {testimonial.services.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 text-gray-300 rounded-full text-xs">
                        +{testimonial.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
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
              Ready to Join Our <span className="gradient-text">Success Stories?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Let's create your own extraordinary event story that others will be inspired by.
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
