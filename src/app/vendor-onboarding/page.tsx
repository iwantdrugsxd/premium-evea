'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Plus, 
  X, 
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VendorOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Core Information
    name: '',
    categories: [] as string[],
    description: '',
    location: '',
    
    // Contact Details
    email: '',
    phone: '',
    address: '',
    
    // Services
    services_offered: [''],
    
    // Experience & Credentials
    experience: '',
    events_count: 0,
    
    // Service Areas
    service_areas: [''],
    
    // Media & Portfolio
    cover_image: null as File | null,
    portfolio_images: [] as File[],
    
    // Quality Metrics
    rating: 0,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const newArray = [...formData[field as keyof typeof formData] as string[]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: string) => {
    const newArray = [...formData[field as keyof typeof formData] as string[], ''];
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const removeArrayItem = (field: string, index: number) => {
    const newArray = (formData[field as keyof typeof formData] as string[]).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files) return;
    
    if (field === 'cover_image') {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    } else if (field === 'portfolio_images') {
      const newFiles = Array.from(files);
      setFormData(prev => ({ 
        ...prev, 
        [field]: [...prev.portfolio_images, ...newFiles].slice(0, 10) // Max 10 images
      }));
    }
  };

  const removePortfolioImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolio_images: prev.portfolio_images.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Business name is required';
      if (formData.categories.length === 0) newErrors.categories = 'At least one category is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }

    if (step === 2) {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }

    if (step === 3) {
      if (!formData.services_offered[0]?.trim()) newErrors.services_offered = 'At least one service is required';
      if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
    }

    if (step === 4) {
      if (!formData.service_areas[0]?.trim()) newErrors.service_areas = 'At least one service area is required';
      if (!formData.cover_image) newErrors.cover_image = 'Cover image is required';
      if (formData.portfolio_images.length === 0) newErrors.portfolio_images = 'At least one portfolio image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    // Additional validation before submission
    if (!formData.experience || formData.experience.trim() === '') {
      alert('Experience field is required. Please fill it in step 3.');
      setCurrentStep(3);
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Create FormData for file uploads
      const submitFormData = new FormData();
      
      // Add all form fields
      submitFormData.append('name', formData.name);
      submitFormData.append('categories', JSON.stringify(formData.categories));
      submitFormData.append('description', formData.description);
      submitFormData.append('location', formData.location);
      submitFormData.append('email', formData.email);
      submitFormData.append('phone', formData.phone);
      submitFormData.append('address', formData.address);
      submitFormData.append('services_offered', JSON.stringify(formData.services_offered));
      submitFormData.append('experience', formData.experience);
      submitFormData.append('events_count', formData.events_count.toString());
      submitFormData.append('service_areas', JSON.stringify(formData.service_areas));
      
      // Add files
      if (formData.cover_image) {
        submitFormData.append('cover_image', formData.cover_image);
      }
      
      formData.portfolio_images.forEach((file, index) => {
        submitFormData.append('portfolio_images', file);
      });
      
      // Log form data before submission
      console.log('Submitting form data:', {
        name: formData.name,
        categories: formData.categories,
        description: formData.description,
        location: formData.location,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        services_offered: formData.services_offered,
        experience: formData.experience,
        events_count: formData.events_count,
        service_areas: formData.service_areas
      });

      // Submit to API
      const response = await fetch('/api/vendors', {
        method: 'POST',
        body: submitFormData,
      });
      
      const result = await response.json();
      
      if (!result.success) {
        console.error('API Error:', result);
        throw new Error(result.error || 'Failed to submit vendor application');
      }
      
      // Redirect to success page
      router.push('/vendor-onboarding/success');
    } catch (error) {
      console.error('Error submitting vendor data:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to submit application'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Photography & Videography',
    'Catering & Food Services',
    'Decoration & Florist',
    'Music & Entertainment',
    'Venue & Location',
    'Transportation',
    'Wedding Planning',
    'Corporate Events',
    'Birthday & Celebrations',
    'Other'
  ];



  const steps = [
    { number: 1, title: 'Basic Info', description: 'Business details' },
    { number: 2, title: 'Contact', description: 'Contact information' },
    { number: 3, title: 'Services', description: 'Services & experience' },
    { number: 4, title: 'Portfolio', description: 'Images & areas' }
  ];

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="gradient-bg"></div>
      
      {/* Header */}
      <div className="pt-8 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              Join Our <span className="gradient-text">Vendor Network</span>
            </h1>
            <p className="text-xl text-gray-400">
              Showcase your services to thousands of event planners
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    currentStep >= step.number 
                      ? 'border-purple-500 bg-purple-500 text-white' 
                      : 'border-gray-600 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{step.number}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      currentStep > step.number ? 'bg-purple-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                  <p className="text-gray-400">Tell us about your business</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Business Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all ${
                        errors.name ? 'border-red-500' : 'border-white/10 focus:border-purple-500'
                      }`}
                      placeholder="Enter your business name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Categories *</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {categories.map(category => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange('categories', [...formData.categories, category]);
                              } else {
                                handleInputChange('categories', formData.categories.filter(c => c !== category));
                              }
                            }}
                            className="w-4 h-4 text-purple-500 bg-white/5 border-2 border-white/10 rounded focus:ring-purple-500 focus:ring-2"
                          />
                          <span className="text-white">{category}</span>
                        </label>
                      ))}
                    </div>
                    {errors.categories && <p className="text-red-500 text-sm mt-1">{errors.categories}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all ${
                      errors.location ? 'border-red-500' : 'border-white/10 focus:border-purple-500'
                    }`}
                    placeholder="City, State"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Business Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all resize-none ${
                      errors.description ? 'border-red-500' : 'border-white/10 focus:border-purple-500'
                    }`}
                    placeholder="Describe your business, services, and what makes you unique..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
                  <p className="text-gray-400">How can customers reach you?</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all ${
                        errors.email ? 'border-red-500' : 'border-white/10 focus:border-purple-500'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all ${
                        errors.phone ? 'border-red-500' : 'border-white/10 focus:border-purple-500'
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Business Address *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all resize-none ${
                      errors.address ? 'border-red-500' : 'border-white/10 focus:border-purple-500'
                    }`}
                    placeholder="Complete business address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Services & Pricing */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Services & Experience</h2>
                  <p className="text-gray-400">What services do you offer and what's your experience?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Services Offered *</label>
                  {formData.services_offered.map((service, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={service}
                        onChange={(e) => handleArrayChange('services_offered', index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="e.g., Wedding Photography, Corporate Events"
                      />
                      {formData.services_offered.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('services_offered', index)}
                          className="px-3 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('services_offered')}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add another service
                  </button>
                  {errors.services_offered && <p className="text-red-500 text-sm mt-1">{errors.services_offered}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Years of Experience *</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all ${
                      errors.experience ? 'border-red-500' : 'border-white/10 focus:border-purple-500'
                    }`}
                    placeholder="e.g., 5+ years"
                  />
                  {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Total Events Completed</label>
                  <input
                    type="number"
                    value={formData.events_count}
                    onChange={(e) => handleInputChange('events_count', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="100"
                    min="0"
                  />
                </div>


              </div>
            )}

            {/* Step 4: Portfolio & Service Areas */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Portfolio & Service Areas</h2>
                  <p className="text-gray-400">Showcase your work and service locations</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Service Areas *</label>
                  {formData.service_areas.map((area, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => handleArrayChange('service_areas', index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="e.g., Mumbai, Pune, Goa"
                      />
                      {formData.service_areas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('service_areas', index)}
                          className="px-3 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('service_areas')}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add service area
                  </button>
                  {errors.service_areas && <p className="text-red-500 text-sm mt-1">{errors.service_areas}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cover Image *</label>
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    errors.cover_image ? 'border-red-500 bg-red-500/10' : 'border-white/20 hover:border-purple-500'
                  }`}>
                    {formData.cover_image ? (
                      <div className="space-y-4">
                        <img
                          src={URL.createObjectURL(formData.cover_image)}
                          alt="Cover"
                          className="w-full h-48 object-cover rounded-lg mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, cover_image: null }))}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-400 mb-2">Upload your business cover image</p>
                        <p className="text-sm text-gray-500">Recommended: 1200x600px, JPG or PNG</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('cover_image', e.target.files)}
                          className="hidden"
                          id="cover-image"
                        />
                        <label
                          htmlFor="cover-image"
                          className="inline-block mt-4 px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/30 transition-all cursor-pointer"
                        >
                          Choose Image
                        </label>
                      </div>
                    )}
                  </div>
                  {errors.cover_image && <p className="text-red-500 text-sm mt-1">{errors.cover_image}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Portfolio Images *</label>
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    errors.portfolio_images ? 'border-red-500 bg-red-500/10' : 'border-white/20 hover:border-purple-500'
                  }`}>
                    <div className="space-y-4">
                      {formData.portfolio_images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {formData.portfolio_images.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Portfolio ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removePortfolioImage(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-center">
                        <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-400 mb-2">Upload your best work samples</p>
                        <p className="text-sm text-gray-500 mb-4">Up to 10 images, JPG or PNG</p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileUpload('portfolio_images', e.target.files)}
                          className="hidden"
                          id="portfolio-images"
                        />
                        <label
                          htmlFor="portfolio-images"
                          className="inline-block px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/30 transition-all cursor-pointer"
                        >
                          {formData.portfolio_images.length > 0 ? 'Add More Images' : 'Choose Images'}
                        </label>
                        {formData.portfolio_images.length > 0 && (
                          <p className="text-sm text-gray-400 mt-2">
                            {formData.portfolio_images.length}/10 images uploaded
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {errors.portfolio_images && <p className="text-red-500 text-sm mt-1">{errors.portfolio_images}</p>}
                </div>
              </div>
            )}
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-8 py-3 border-2 border-white/10 rounded-xl text-white hover:border-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
