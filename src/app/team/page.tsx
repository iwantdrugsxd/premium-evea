'use client';

import { motion } from 'framer-motion';
import { 
  Star, 
  Award, 
  Users, 
  Heart, 
  Target, 
  Zap,
  CheckCircle,
  ArrowRight,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trophy,
  Lightbulb,
  Shield,
  Sparkles
} from 'lucide-react';

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      image: "/team/priya.jpg",
      bio: "Visionary leader with 15+ years in event management, transforming dreams into reality. Former VP at EventCorp India.",
      expertise: ["Strategic Planning", "Business Development", "Team Leadership"],
      achievements: ["Top 40 Under 40 Entrepreneurs", "Event Management Excellence Award 2023"],
      experience: "15+ years",
      education: "MBA from IIM Ahmedabad",
      linkedin: "https://linkedin.com/in/priyasharma",
      email: "priya@evea.com"
    },
    {
      name: "Rajesh Kumar",
      role: "Creative Director",
      image: "/team/rajesh.jpg",
      bio: "Award-winning designer who brings artistic vision and innovation to every project. Expert in creating immersive experiences.",
      expertise: ["Creative Direction", "Event Design", "Brand Strategy"],
      achievements: ["Best Creative Director 2024", "Design Excellence Award"],
      experience: "12+ years",
      education: "BFA from NID Ahmedabad",
      linkedin: "https://linkedin.com/in/rajeshkumar",
      email: "rajesh@evea.com"
    },
    {
      name: "Anjali Patel",
      role: "Operations Head",
      image: "/team/anjali.jpg",
      bio: "Master of logistics and coordination, ensuring seamless execution of every event. Former Operations Manager at Marriott.",
      expertise: ["Event Operations", "Vendor Management", "Quality Control"],
      achievements: ["Operations Excellence Award", "Customer Satisfaction Leader"],
      experience: "10+ years",
      education: "MBA from SPJIMR Mumbai",
      linkedin: "https://linkedin.com/in/anjalipatel",
      email: "anjali@evea.com"
    },
    {
      name: "Vikram Singh",
      role: "Technology Lead",
      image: "/team/vikram.jpg",
      bio: "Tech enthusiast driving digital transformation and AI-powered event solutions. Former Senior Developer at Google.",
      expertise: ["AI/ML", "Full-Stack Development", "System Architecture"],
      achievements: ["Innovation Award 2024", "Tech Leadership Excellence"],
      experience: "8+ years",
      education: "B.Tech from IIT Bombay",
      linkedin: "https://linkedin.com/in/vikramsingh",
      email: "vikram@evea.com"
    },
    {
      name: "Meera Reddy",
      role: "Marketing Director",
      image: "/team/meera.jpg",
      bio: "Strategic marketer with expertise in digital campaigns and brand building. Former Marketing Manager at Amazon.",
      expertise: ["Digital Marketing", "Brand Strategy", "Growth Hacking"],
      achievements: ["Marketing Excellence Award", "Top 100 Marketers"],
      experience: "9+ years",
      education: "MBA from XLRI Jamshedpur",
      linkedin: "https://linkedin.com/in/meerareddy",
      email: "meera@evea.com"
    },
    {
      name: "Arjun Malhotra",
      role: "Finance Director",
      image: "/team/arjun.jpg",
      bio: "Financial expert ensuring sustainable growth and operational efficiency. Former Finance Manager at Deloitte.",
      expertise: ["Financial Planning", "Risk Management", "Investment Strategy"],
      achievements: ["Finance Excellence Award", "CFO of the Year Nominee"],
      experience: "11+ years",
      education: "CA, MBA from IIM Calcutta",
      linkedin: "https://linkedin.com/in/arjunmalhotra",
      email: "arjun@evea.com"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Passion",
      description: "We pour our hearts into every event, treating each celebration as if it were our own."
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "Excellence",
      description: "We strive for perfection in every detail, never settling for anything less than extraordinary."
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Collaboration",
      description: "We believe in the power of teamwork and diverse perspectives to create magic."
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Innovation",
      description: "We constantly push boundaries and embrace new technologies to deliver cutting-edge experiences."
    }
  ];

  const achievements = [
    {
      year: "2024",
      title: "Best Event Management Company",
      organization: "Event Management Association of India",
      description: "Recognized for outstanding service quality and innovation"
    },
    {
      year: "2024",
      title: "Top 10 Startups to Watch",
      organization: "Economic Times",
      description: "Featured in prestigious startup rankings"
    },
    {
      year: "2023",
      title: "Customer Choice Award",
      organization: "Wedding Wire",
      description: "Highest rated event planning company"
    },
    {
      year: "2023",
      title: "Innovation in Technology",
      organization: "Tech Startup Awards",
      description: "AI-powered event planning platform recognition"
    }
  ];

  const culture = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation First",
      description: "We encourage creative thinking and experimentation"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Transparency",
      description: "Open communication and honest relationships"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Celebrate Success",
      description: "We recognize and reward achievements"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Work-Life Balance",
      description: "Flexible schedules and wellness programs"
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
              Our Team
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8"
            >
              Meet the<br />
              <span className="gradient-text">Dream Team</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              The passionate individuals behind EVEA's success, each bringing unique expertise and unwavering dedication to making your dreams come true.
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            >
              {[
                { number: "50+", label: "Team Members", icon: <Users className="w-8 h-8" /> },
                { number: "100+", label: "Years Combined Experience", icon: <Calendar className="w-8 h-8" /> },
                { number: "25+", label: "Industry Awards", icon: <Trophy className="w-8 h-8" /> },
                { number: "98%", label: "Client Satisfaction", icon: <Star className="w-8 h-8" /> }
              ].map((stat, index) => (
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

      {/* Team Members Grid */}
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
              Leadership <span className="gradient-text">Team</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Meet the visionaries and experts who drive EVEA's mission forward.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all"
              >
                {/* Profile Image */}
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{member.name.charAt(0)}</span>
                </div>
                
                {/* Member Info */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-purple-400 text-lg mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                </div>
                
                {/* Expertise */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Achievements</h4>
                  <div className="space-y-2">
                    {member.achievements.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300 text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Contact & Social */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-center gap-4 mb-4">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-white" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-white" />
                    </a>
                  </div>
                  
                  <div className="text-center text-sm text-gray-400">
                    <p>{member.experience} • {member.education}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
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
              The principles that guide our team and shape our company culture.
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

      {/* Company Culture */}
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
              Company <span className="gradient-text">Culture</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We foster an environment where creativity thrives and innovation is celebrated.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {culture.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-all"
              >
                <div className="text-purple-400 mb-6 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
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
              Awards & <span className="gradient-text">Recognition</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Celebrating our achievements and industry recognition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400 mb-2">{achievement.year}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                    <p className="text-purple-400 mb-2">{achievement.organization}</p>
                    <p className="text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-32 px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8">
              Join Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Ready to be part of something extraordinary? We're always looking for passionate individuals who share our vision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                View Open Positions
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 border-2 border-white/10 rounded-2xl font-semibold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Contact HR
                <Mail className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
