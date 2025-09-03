'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight,
  MapPin,
  Clock,
  DollarSign,
  Send
} from 'lucide-react';

export default function CareersPage() {
  const router = useRouter();
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

  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 3 }}
          />
        </svg>
      ),
      title: "Passion",
      description: "We're passionate about creating extraordinary events and experiences."
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 3 }}
          />
        </svg>
      ),
      title: "Excellence",
      description: "We strive for excellence in everything we do, from planning to execution."
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.circle
            cx="9"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.path
            d="M23 21v-2a4 4 0 0 0-3-3.87"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.path
            d="M16 3.13a4 4 0 0 1 0 7.75"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.2, repeat: Infinity, repeatDelay: 3 }}
          />
        </svg>
      ),
      title: "Teamwork",
      description: "We believe in the power of collaboration and diverse perspectives."
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.polyline
            points="9,22 9,12 15,12 15,22"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.8, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.circle
            cx="12"
            cy="6"
            r="2"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatDelay: 3 }}
          />
        </svg>
      ),
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
          We&apos;re hiring passionate individuals to revolutionize event management. 
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

                    <button 
                      onClick={() => router.push(position.title === "Event Partners" ? '/event-partner' : '/vendor-onboarding')}
                      className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Collaboration Partners Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 card-hover"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Position Info */}
                <div className="lg:col-span-2">
                  <h3 className="text-3xl font-bold mb-2">Collaboration Partners</h3>
                  <p className="text-purple-500 font-semibold mb-4">Strategic Partnerships</p>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Partner with EVEA to expand your business reach and create mutually beneficial opportunities in the event management industry.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      Pan India
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      Flexible
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      Revenue Share
                    </div>
                  </div>
                </div>

                {/* Requirements & Benefits */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Partnership Types</h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        Event Management Services
                      </li>
                      <li className="text-sm text-gray-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        Product Sales at Events
                      </li>
                      <li className="text-sm text-gray-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        Sponsorship Opportunities
                      </li>
                      <li className="text-sm text-gray-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        Vendor Network Expansion
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                        Access to Premium Event Market
                      </li>
                      <li className="text-sm text-gray-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                        Revenue Sharing Model
                      </li>
                      <li className="text-sm text-gray-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                        Brand Exposure & Marketing
                      </li>
                      <li className="text-sm text-gray-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                        Dedicated Partnership Support
                      </li>
                    </ul>
                  </div>

                  <Link 
                    href="/collaboration"
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    Partner With Us
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
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
            Don&apos;t see a position that fits? Send us your resume and we&apos;ll keep you in mind for future opportunities.
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
                placeholder="Tell us about yourself and why you&apos;d like to join EVEA..."
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
