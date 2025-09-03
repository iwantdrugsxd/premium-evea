'use client';

import { motion } from 'framer-motion';
import { 
  Star, 
  Users, 
  Award, 
  Heart, 
  Target, 
  Zap,
  CheckCircle,
  ArrowRight,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: "500+", label: "Events Planned", icon: <Calendar className="w-8 h-8" /> },
    { number: "50+", label: "Expert Vendors", icon: <Users className="w-8 h-8" /> },
    { number: "98%", label: "Client Satisfaction", icon: <Star className="w-8 h-8" /> },
    { number: "5+", label: "Years Experience", icon: <Award className="w-8 h-8" /> }
  ];

  const values = [
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Passion for Excellence",
      description: "We pour our heart into every event, ensuring each moment is crafted with love and attention to detail."
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "Innovation First",
      description: "Constantly pushing boundaries with cutting-edge technology and creative solutions for unforgettable experiences."
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Lightning Fast",
      description: "Quick turnaround times without compromising quality. We value your time as much as you do."
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: "Quality Assured",
      description: "Every vendor is vetted, every service is tested, and every detail is perfected before delivery."
    }
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      image: "/team/priya.jpg",
      bio: "Visionary leader with 10+ years in event management, transforming dreams into reality."
    },
    {
      name: "Rajesh Kumar",
      role: "Creative Director",
      image: "/team/rajesh.jpg",
      bio: "Award-winning designer who brings artistic vision and innovation to every project."
    },
    {
      name: "Anjali Patel",
      role: "Operations Head",
      image: "/team/anjali.jpg",
      bio: "Master of logistics and coordination, ensuring seamless execution of every event."
    },
    {
      name: "Vikram Singh",
      role: "Technology Lead",
      image: "/team/vikram.jpg",
      bio: "Tech enthusiast driving digital transformation and AI-powered event solutions."
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "EVEA Founded",
      description: "Started with a vision to revolutionize event planning in India"
    },
    {
      year: "2021",
      title: "First 100 Events",
      description: "Successfully planned and executed 100+ events across Mumbai"
    },
    {
      year: "2022",
      title: "AI Integration",
      description: "Launched AI-powered event planning platform"
    },
    {
      year: "2023",
      title: "Pan India Expansion",
      description: "Expanded services to 10+ cities across India"
    },
    {
      year: "2024",
      title: "500+ Events Milestone",
      description: "Achieved 500+ successful events with 98% client satisfaction"
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
              About EVEA
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8"
            >
              Crafting<br />
              <span className="gradient-text">Dreams</span><br />
              Into Reality
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              EVEA is India's premier AI-powered event planning platform, transforming the way people celebrate life's most precious moments. We combine cutting-edge technology with human creativity to deliver extraordinary experiences.
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

      {/* Mission & Vision */}
      <section className="py-32 px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-8">
                Our <span className="gradient-text">Mission</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                To democratize exceptional event planning by making professional services accessible to everyone. We believe every celebration deserves to be extraordinary, regardless of budget or scale.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-gray-300">AI-powered personalized recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-gray-300">Vetted network of premium vendors</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-gray-300">End-to-end event management</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-8">
                Our <span className="gradient-text">Vision</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                To become the world's most trusted platform for event planning, where technology meets human creativity to create magical moments that last a lifetime.
              </p>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">By 2030, we aim to:</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• Serve 1 million+ events annually</li>
                  <li>• Expand to 50+ countries</li>
                  <li>• Achieve 99.9% client satisfaction</li>
                  <li>• Pioneer AI-driven event innovation</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
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
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The principles that guide every decision we make and every event we create.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-all"
              >
                <div className="text-purple-400 mb-6 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The passionate individuals behind EVEA's success, dedicated to making your dreams come true.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-all"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-purple-400 mb-4">{member.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
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
              Our <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From humble beginnings to becoming India's leading event planning platform.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
            
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                      <div className="text-3xl font-bold text-purple-400 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{milestone.title}</h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-black relative z-10"></div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-32 px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8">
              Ready to Create <span className="gradient-text">Magic?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Let's turn your vision into an unforgettable reality. Our team is ready to bring your dreams to life.
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
                Contact Us
                <Phone className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
