'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Building, 
  Phone, 
  Code, 
  Heart, 
  Star,
  ArrowRight,
  MapPin,
  Clock,
  DollarSign,
  Send
} from 'lucide-react';

export default function CareersPage() {
  const positions = [
    {
      title: "Event Partners",
      role: "On-Ground Excellence",
      description: "Join our frontline team managing events with precision and passion.",
      requirements: [
        "3+ years event management experience",
        "Excellent communication skills",
        "Ability to work under pressure",
        "Team leadership experience"
      ],
      benefits: [
        "Competitive salary + performance bonuses",
        "Health insurance coverage",
        "Professional development opportunities",
        "Travel allowances"
      ],
      location: "Mumbai, Bangalore, Delhi",
      type: "Full-time",
      salary: "₹6-12L per annum"
    },
    {
      title: "Vendor Relations",
      role: "Partnership Growth",
      description: "Build and maintain relationships with our network of premium vendors.",
      requirements: [
        "2+ years in sales or partnership roles",
        "Strong negotiation skills",
        "Experience in vendor management",
        "Excellent networking abilities"
      ],
      benefits: [
        "Commission-based incentives",
        "Flexible work arrangements",
        "Networking opportunities",
        "Performance rewards"
      ],
      location: "Mumbai, Remote",
      type: "Full-time",
      salary: "₹5-10L per annum"
    },
    {
      title: "Service Calling",
      role: "Customer Success",
      description: "Ensure exceptional customer experience through proactive support.",
      requirements: [
        "1+ years customer service experience",
        "Excellent problem-solving skills",
        "Patience and empathy",
        "Multilingual preferred"
      ],
      benefits: [
        "Performance-based bonuses",
        "Health and wellness programs",
        "Career growth opportunities",
        "Work-life balance"
      ],
      location: "Mumbai, Remote",
      type: "Full-time",
      salary: "₹4-8L per annum"
    },
    {
      title: "Tech Team",
      role: "Platform Innovation",
      description: "Build the technology that powers the future of event management.",
      requirements: [
        "3+ years software development experience",
        "Proficiency in React/Next.js",
        "Experience with cloud platforms",
        "Strong problem-solving skills"
      ],
      benefits: [
        "Competitive tech salaries",
        "Latest tools and equipment",
        "Conference and training budgets",
        "Stock options"
      ],
      location: "Mumbai, Remote",
      type: "Full-time",
      salary: "₹12-25L per annum"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion",
      description: "We're passionate about creating extraordinary events and experiences."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from planning to execution."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Teamwork",
      description: "We believe in the power of collaboration and diverse perspectives."
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Innovation",
      description: "We constantly innovate to stay ahead in the event management industry."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="gradient-bg"></div>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-badge"
        >
          Join Our Team
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
                      className="hero-title"
        >
          Build The Future<br />
          <span className="gradient-text">Of Events</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-400 max-w-3xl mx-auto"
        >
          We're hiring passionate individuals to revolutionize event management. 
          Join us in creating extraordinary experiences.
        </motion.p>
      </section>

      {/* Values Section */}
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
              Our <span className="gradient-text">Values</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center card-hover"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
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
              Open <span className="gradient-text">Positions</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Find your perfect role in our growing team of event management professionals.
            </p>
          </motion.div>

          <div className="space-y-8">
            {positions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 card-hover"
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Position Info */}
                  <div className="lg:col-span-2">
                    <h3 className="text-3xl font-bold mb-2">{position.title}</h3>
                    <p className="text-purple-500 font-semibold mb-4">{position.role}</p>
                    <p className="text-gray-400 mb-6 leading-relaxed">{position.description}</p>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        {position.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        {position.type}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        {position.salary}
                      </div>
                    </div>
                  </div>

                  {/* Requirements & Benefits */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {position.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="text-sm text-gray-400 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Benefits</h4>
                      <ul className="space-y-2">
                        {position.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="text-sm text-gray-400 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2">
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-8"
          >
            Get In <span className="gradient-text">Touch</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 mb-12"
          >
            Don't see a position that fits? Send us your resume and we'll keep you in mind for future opportunities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
              
              <input
                type="text"
                placeholder="Position of Interest"
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
              />
              
              <textarea
                placeholder="Tell us about yourself and why you'd like to join EVEA..."
                rows={4}
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all resize-none"
              ></textarea>
              
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                Send Application
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
