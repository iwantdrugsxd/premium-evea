'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight,
  CheckCircle,
  Building2,
  Handshake,
  Users,
  TrendingUp
} from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';

export default function CollaborationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    phone_number: '',
    collaboration_type: '',
    additional_details: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          business_name: '',
          email: '',
          phone_number: '',
          collaboration_type: '',
          additional_details: ''
        });
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        alert(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Access to Premium Market",
      description: "Connect with high-value clients and premium events"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Revenue Sharing",
      description: "Earn competitive commissions on successful partnerships"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Dedicated Support",
      description: "Get personalized support from our partnership team"
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: "Brand Exposure",
      description: "Increase your brand visibility through our platform"
    }
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900/20 to-black px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-8" />
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Thank You!</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your collaboration request has been submitted successfully. We'll review your proposal and get back to you within 2-3 business days.
          </p>
          <p className="text-gray-400">
            Redirecting to home page...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <AuthGuard formName="Collaboration">
      <div className="min-h-screen pt-24">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black"></div>
        
        {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Section - Content */}
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
                Partnership Opportunities
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8"
              >
                Collaboration<br />
                <span className="gradient-text">Partners</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-400 mb-12 leading-relaxed max-w-lg"
              >
                Join our network of premium partners. Event management companies, product vendors, and sponsors - let's create extraordinary events together.
              </motion.p>

              {/* Benefits Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-2 gap-6 mb-12"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                  >
                    <div className="text-purple-400 mb-4">{benefit.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-400">{benefit.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Section - Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                  Partner With Us
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleInputChange}
                        placeholder="Enter your business name"
                        required
                        className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        required
                        className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                      className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Collaboration Type *
                    </label>
                    <select
                      name="collaboration_type"
                      value={formData.collaboration_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white focus:border-purple-500 focus:outline-none transition-all"
                    >
                      <option value="">Select collaboration type</option>
                      <option value="event-management">Event Management Services</option>
                      <option value="product-sales">Product Sales at Events</option>
                      <option value="sponsorship">Sponsorship Opportunities</option>
                      <option value="venue-partnership">Venue Partnership</option>
                      <option value="catering-services">Catering Services</option>
                      <option value="photography-videography">Photography & Videography</option>
                      <option value="entertainment">Entertainment Services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Additional Details
                    </label>
                    <textarea
                      name="additional_details"
                      value={formData.additional_details}
                      onChange={handleInputChange}
                      placeholder="Tell us about your collaboration proposal, experience, and what you can bring to our events..."
                      rows={4}
                      className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Collaboration Request
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              Partnership <span className="gradient-text">Process</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Simple steps to become a valued partner in our event ecosystem.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Submit Request",
                description: "Fill out our collaboration form with your business details and proposal."
              },
              {
                step: "02",
                title: "Review & Call",
                description: "Our team reviews your proposal and schedules a detailed discussion call."
              },
              {
                step: "03",
                title: "Partnership Agreement",
                description: "We present a customized partnership proposal and finalize the agreement."
              },
              {
                step: "04",
                title: "Start Collaborating",
                description: "Begin working together on events and grow your business with us."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </AuthGuard>
  );
}
