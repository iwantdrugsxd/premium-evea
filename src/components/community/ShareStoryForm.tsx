'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ShareStoryFormProps {
  onClose: () => void;
  onSubmit: (storyData: any) => void;
}

export default function ShareStoryForm({ onClose, onSubmit }: ShareStoryFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    eventType: '',
    location: '',
    date: '',
    images: [] as File[],
    tags: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const eventTypes = [
    'Wedding', 'Birthday Party', 'Corporate Event', 'Anniversary',
    'Cultural Festival', 'Baby Shower', 'Graduation', 'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('=== IMAGE UPLOAD HANDLER TRIGGERED ===');
    console.log('Event:', e);
    console.log('Target:', e.target);
    console.log('Files:', e.target.files);
    
    const files = Array.from(e.target.files || []);
    console.log('Files selected:', files);
    console.log('Files length:', files.length);
    
    if (files.length > 0) {
      // Check if adding these files would exceed the limit
      if (formData.images.length + files.length > 10) {
        alert(`You can only upload a maximum of 10 images. You currently have ${formData.images.length} images.`);
        return;
      }
      
      // Validate file sizes (10MB limit)
      const validFiles = files.filter(file => {
        console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);
        
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          return false;
        }
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not an image.`);
          return false;
        }
        return true;
      });
      
      console.log('Valid files:', validFiles);
      
      if (validFiles.length > 0) {
        setFormData(prev => {
          const newImages = [...prev.images, ...validFiles];
          console.log('Setting new images:', newImages);
          return { 
            ...prev, 
            images: newImages
          };
        });
        console.log('Updated formData images:', [...formData.images, ...validFiles]);
      }
    } else {
      console.log('No files selected');
    }
    
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      // Check if adding these files would exceed the limit
      if (formData.images.length + imageFiles.length > 10) {
        alert(`You can only upload a maximum of 10 images. You currently have ${formData.images.length} images.`);
        return;
      }

      // Validate file sizes (10MB limit)
      const validFiles = imageFiles.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          return false;
        }
        return true;
      });
      
      if (validFiles.length > 0) {
        console.log('Dropped image files:', validFiles);
        setFormData(prev => ({ 
          ...prev, 
          images: [...prev.images, ...validFiles] 
        }));
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Submitting form with data:', formData);
    console.log('Images to upload:', formData.images);
    console.log('Images count:', formData.images.length);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting story:', error);
      alert('Failed to submit your story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Share Your Story
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Story Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="Give your story a compelling title..."
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Event Type *
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="">Select event type</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Location and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="Where was your event?"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Event Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Your Story *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
              placeholder="Share the details of your amazing event experience..."
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Upload Images
            </label>
            
            {/* Drag & Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                isDragOver 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-white/20 hover:border-purple-500/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Hidden file input */}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                key="image-upload-input"
                ref={(input) => {
                  if (input) {
                    // Store reference to the input element
                    (window as any).imageUploadInput = input;
                  }
                }}
              />
              
              {/* Clickable upload area */}
              <div 
                className="cursor-pointer"
                onClick={() => {
                  console.log('Upload area clicked');
                  const input = document.getElementById('image-upload') as HTMLInputElement;
                  if (input) {
                    console.log('File input found, clicking it...');
                    input.click();
                  } else {
                    console.log('File input not found');
                  }
                }}
              >
                <div className="text-4xl mb-2">📷</div>
                <div className="text-white font-semibold mb-1">
                  {isDragOver 
                    ? 'Drop images here!' 
                    : formData.images.length > 0 
                      ? `${formData.images.length} image(s) selected` 
                      : 'Click to select images or drag & drop'
                  }
                </div>
                <div className="text-gray-400 text-sm">
                  Supports JPG, PNG, GIF up to 10MB each
                  <br />
                  <span className="text-purple-400">
                    {formData.images.length}/10 images selected
                  </span>
                </div>
              </div>
              
              {/* Alternative buttons */}
              <div className="mt-3 space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    console.log('Browse Files button clicked');
                    const input = document.getElementById('image-upload') as HTMLInputElement;
                    if (input) {
                      console.log('File input found, clicking it...');
                      input.click();
                    } else {
                      console.log('File input not found');
                    }
                  }}
                  className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-colors text-sm"
                >
                  Browse Files
                </button>
                
                {/* Test button to verify functionality */}
                <button
                  type="button"
                  onClick={() => {
                    console.log('Test button clicked');
                    console.log('Current formData.images:', formData.images);
                    const input = document.getElementById('image-upload') as HTMLInputElement;
                    console.log('File input element:', input);
                    console.log('File input type:', input?.type);
                    console.log('File input id:', input?.id);
                    console.log('File input className:', input?.className);
                  }}
                  className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors text-sm"
                >
                  Test
                </button>
              </div>
              
              {/* Visible file input as fallback */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-white mb-2">
                  Or use this direct file input:
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                />
              </div>
            </div>
            
            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-white">
                    Selected Images ({formData.images.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, images: [] }))}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-white/10"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {image.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="Add tags (press Enter to add)"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Add
              </button>
            </div>
            
            {/* Tags Display */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-purple-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.content || !formData.eventType}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-none rounded-xl text-white font-semibold hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Sharing...' : 'Share Story'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
