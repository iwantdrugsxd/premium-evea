'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  Star, 
  MapPin, 
  Camera, 
  Music, 
  Heart, 
  MessageCircle, 
  Share2,
  ArrowRight,
  Check,
  Play
} from 'lucide-react';
import Steps3DScene from '@/components/Steps3DScene';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Section - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hero-badge mb-8"
          >
            Launching in Mumbai
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8"
          >
            Events<br />
            <span className="gradient-text">Reimagined</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-400 mb-12 leading-relaxed max-w-lg"
          >
            End-to-end event management with dedicated teams, 
            verified vendors, and transparent pricing.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6"
          >
            <Link href="/plan-event" className="btn-primary">
              Start Planning
            </Link>
            <Link href="/careers" className="btn-secondary">
              Become a Partner
            </Link>
          </motion.div>
            </motion.div>

            {/* Right Section - Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4 h-[600px]">
                {/* Large top left image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="col-span-1 row-span-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl overflow-hidden relative group"
                >
                  <img
                    src="/images/hero page .jpeg"
                    alt="Event Planning"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </motion.div>

                {/* Top right image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="col-span-1 row-span-1 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-3xl overflow-hidden relative group"
                >
                  <img
                    src="/images/image.png"
                    alt="Catering Services"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </motion.div>

                {/* Bottom right image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="col-span-1 row-span-1 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl overflow-hidden relative group"
                >
                  <img
                    src="/images/image copy.png"
                    alt="Event Decoration"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </motion.div>

                {/* Small bottom left image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="col-span-1 row-span-1 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-3xl overflow-hidden relative group"
                >
                  <img
                    src="/images/image copy 2.png"
                    alt="Photography"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </motion.div>
              </div>

              {/* Floating elements for visual interest */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl"
              ></motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full opacity-20 blur-xl"
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section - 3D Scene */}
      <section className="relative">
        <Steps3DScene />
      </section>

          

      {/* Packages Section */}
      <section className="py-32 px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <div className="section-label">Packages</div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8">
              Choose Your<br />
              <span className="gradient-text">Perfect Plan</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Transparent pricing. No hidden costs. Complete event management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                label: "Most Affordable",
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
            ].map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 card-hover relative ${
                  pkg.featured ? 'scale-105 border-pink-500/30' : ''
                }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="text-pink-500 text-sm font-semibold mb-4">{pkg.label}</div>
                <h3 className="text-3xl font-bold mb-4">{pkg.name}</h3>
                <div className="text-5xl font-black gradient-text mb-2">{pkg.price}</div>
                <div className="text-gray-400 mb-8">Starting from</div>
                
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-pink-500 flex-shrink-0" />
                      {feature}
          </li>
                  ))}
                </ul>
                
                <Link 
                  href="/packages"
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-center transition-all duration-300 ${
                    pkg.featured 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:shadow-pink-500/25' 
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  Select {pkg.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <div className="section-label">Marketplace</div>
            <h2 className="section-title">
              Verified<br />
              <span className="gradient-text">Event Partners</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Handpicked vendors. Transparent pricing. Guaranteed quality.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Royal Catering Co.",
                category: "Catering Services",
                rating: 4.9,
                events: 127,
                price: "₹800/plate",
                badge: "Premium"
              },
              {
                name: "Dream Decorators",
                category: "Decoration & Design",
                rating: 4.8,
                events: 89,
                price: "₹50K onwards",
                badge: "Verified"
              },
              {
                name: "Cinematic Moments",
                category: "Photography & Video",
                rating: 5.0,
                events: 203,
                price: "₹1L/day",
                badge: "Featured"
              },
              {
                name: "Beats Entertainment",
                category: "DJ & Music",
                rating: 4.7,
                events: 45,
                price: "₹30K/event",
                badge: "New"
              },
              {
                name: "Grand Ballroom",
                category: "Premium Venues",
                rating: 4.9,
                events: 156,
                price: "₹2L/day",
                badge: "Exclusive"
              },
              {
                name: "Floral Fantasy",
                category: "Floral Design",
                rating: 4.8,
                events: 78,
                price: "₹25K onwards",
                badge: "Trending"
              }
            ].map((vendor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden card-hover"
              >
                <div className="h-48 bg-gradient-to-br from-pink-500/20 to-purple-500/20 relative">
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-pink-400">
                    {vendor.badge}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{vendor.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{vendor.category}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(vendor.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {vendor.rating} ({vendor.events} events)
                    </span>
                  </div>
                  
                  <div className="text-2xl font-bold gradient-text mb-4">{vendor.price}</div>
                  
                  <div className="flex gap-3">
                    <Link 
                      href="/marketplace"
                      className="flex-1 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-center text-sm font-semibold hover:bg-white/10 transition-colors"
                    >
                      View Details
                    </Link>
                    <Link 
                      href="/marketplace"
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-center text-sm font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                    >
                      Add to Package
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-32 px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <div className="section-label">Community</div>
            <h2 className="section-title">
              Real Events.<br />
              <span className="gradient-text">Real Stories.</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join our community. Share your celebrations. Get inspired.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                user: "Priya & Rahul",
                location: "Mumbai",
                time: "2 days ago",
                content: "Our dream wedding came true thanks to EVEA! The team handled everything perfectly. Special thanks to our event manager Anjali! 💕",
                stats: { likes: 234, comments: 45 },
                type: "wedding"
              },
              {
                user: "Tech Innovations Ltd",
                location: "Bangalore",
                time: "1 week ago",
                content: "Annual conference for 500+ attendees executed flawlessly. EVEA's corporate package exceeded our expectations!",
                stats: { likes: 189, comments: 23 },
                type: "corporate"
              },
              {
                user: "Sharma Family",
                location: "Delhi",
                time: "3 weeks ago",
                content: "Aarav's 5th birthday was magical! The superhero theme setup was incredible. Thank you EVEA for making it special! 🎉",
                stats: { likes: 156, comments: 34 },
                type: "birthday"
              }
            ].map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden card-hover"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full"></div>
                    <div>
                      <h4 className="font-semibold">{post.user}</h4>
                      <p className="text-sm text-gray-400">{post.time} • {post.location}</p>
                    </div>
                  </div>
                  
                  <div className="h-48 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl mb-4"></div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>
                  
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>❤️ {post.stats.likes} likes</span>
                    <span>💬 {post.stats.comments} comments</span>
                    <span>📷 View on Instagram</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <div className="section-label">Join Us</div>
            <h2 className="section-title">
              Build The Future<br />
              <span className="gradient-text">Of Events</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're hiring passionate individuals to revolutionize event management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Event Partners", role: "On-Ground Excellence" },
              { name: "Vendor Relations", role: "Partnership Growth" }
            ].map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center card-hover"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full mx-auto mb-6"></div>
                <h3 className="text-2xl font-bold mb-2">{position.name}</h3>
                <p className="text-pink-500 text-sm font-semibold uppercase tracking-wider">{position.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 bg-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Ready to create<br />
            <span className="gradient-text">something extraordinary?</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 mb-12"
          >
            Join thousands who've transformed their events with EVEA.
            Your perfect celebration is just one click away.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link href="/plan-event" className="btn-primary">
              Start Your Journey
            </Link>
            <Link href="/contact" className="btn-secondary">
              Schedule a Call
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
