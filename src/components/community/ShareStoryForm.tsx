'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Monitor image state changes
  useEffect(() => {
    // Image state monitoring removed for production
  }, [formData.images]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      formData.images.forEach(image => {
        if (image instanceof File) {
          const url = URL.createObjectURL(image);
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const eventTypes = [
    'Wedding', 'Birthday Party', 'Corporate Event', 'Anniversary',
    'Cultural Festival', 'Baby Shower', 'Graduation', 'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    files.forEach(file => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" is not a supported image format. Supported formats: JPEG, PNG, GIF, WebP`);
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum size is 10MB.`);
        return;
      }

      validFiles.push(file);
    });

    return validFiles;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) {
      setUploadStatus('idle');
      return;
    }

    // Check total image limit
    if (formData.images.length + files.length > 10) {
      alert(`You can upload a maximum of 10 images. You currently have ${formData.images.length} images selected.`);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 2000);
      return;
    }

    // Validate files
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      setFormData(prev => {
        const newImages = [...prev.images, ...validFiles];
        return { ...prev, images: newImages };
      });
      
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 2000);
    } else {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 2000);
    }
    
    // Reset input value
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setUploadStatus('uploading');
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('No valid image files found in the dropped items.');
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 2000);
      return;
    }

    // Check total image limit
    if (formData.images.length + imageFiles.length > 10) {
      alert(`You can upload a maximum of 10 images. You currently have ${formData.images.length} images selected.`);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 2000);
      return;
    }

    // Validate files
    const validFiles = validateFiles(imageFiles);
    
    if (validFiles.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...validFiles] 
      }));
      
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 2000);
    } else {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 2000);
    }
  };

  const removeImage = (index: number) => {
    // Revoke object URL to prevent memory leak
    const imageToRemove = formData.images[index];
    if (imageToRemove instanceof File) {
      const url = URL.createObjectURL(imageToRemove);
      URL.revokeObjectURL(url);
    }
    
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }));
  };

  const clearAllImages = () => {
    // Revoke all object URLs
    formData.images.forEach(image => {
      if (image instanceof File) {
        const url = URL.createObjectURL(image);
        URL.revokeObjectURL(url);
      }
    });
    
    setFormData(prev => ({ ...prev, images: [] }));
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      if (formData.tags.length >= 10) {
        alert('You can add a maximum of 10 tags.');
        return;
      }
      setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      alert('Please enter a story title');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('Please enter your story content');
      return;
    }
    
    if (!formData.eventType) {
      alert('Please select an event type');
      return;
    }

    // Final image validation
    if (formData.images.length > 0) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const oversizedImages = formData.images.filter(img => img.size > maxSize);
      if (oversizedImages.length > 0) {
        alert(`The following images are too large (max 10MB): ${oversizedImages.map(img => img.name).join(', ')}`);
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      
      await onSubmit(formData);
      
      // Reset form on success
      clearAllImages(); // Properly cleanup images
      setFormData({
        title: '',
        content: '',
        eventType: '',
        location: '',
        date: '',
        tags: [],
        images: []
      });
      setTagInput('');
      setUploadStatus('idle');
      
    } catch (error) {
      alert(`Failed to submit story: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('File input ref is null');
    }
  };

  const getUploadButtonText = () => {
    switch (uploadStatus) {
      case 'uploading': return 'Uploading...';
      case 'success': return 'Added Successfully!';
      case 'error': return 'Upload Failed';
      default: return 'Add Photos';
    }
  };

  const getUploadButtonClass = () => {
    const baseClass = "px-6 py-3 font-semibold rounded-lg transition-all flex items-center gap-2 ";
    switch (uploadStatus) {
      case 'uploading': return baseClass + "bg-yellow-500 text-white";
      case 'success': return baseClass + "bg-green-500 text-white";
      case 'error': return baseClass + "bg-red-500 text-white";
      default: return baseClass + "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600";
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
                <option key={type} value={type} className="bg-[#0a0a0f] text-white">{type}</option>
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
              Upload Images (Optional)
            </label>
            
            <div className="space-y-4">
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Primary Upload Button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={uploadStatus === 'uploading'}
                  className={getUploadButtonClass()}
                >
                  <span>📷</span>
                  <span>{getUploadButtonText()}</span>
                </button>
                
                <span className="text-gray-400 text-sm">
                  {formData.images.length}/10 images
                </span>
              </div>

              {/* Upload Instructions */}
              <div className="text-center text-gray-400 text-sm">
                Click "Add Photos" to select images, or drag & drop files below
                <br />
                Supports JPEG, PNG, GIF, WebP up to 10MB each
              </div>

              {/* Drag & Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                  isDragOver 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-white/20 hover:border-purple-500/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <div className="text-2xl mb-2">📁</div>
                <div className="text-white font-semibold mb-1">
                  {isDragOver 
                    ? 'Drop images here!' 
                    : 'Drag & drop images here or click to browse'
                  }
                </div>
                <div className="text-gray-400 text-sm">
                  Maximum 10 images, 10MB each
                </div>
              </div>

              {/* Image Preview Section */}
              {formData.images.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white">
                      Selected Images ({formData.images.length})
                    </h4>
                    <button
                      type="button"
                      onClick={clearAllImages}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {formData.images.map((image, index) => (
                      <div key={`${image.name}-${index}`} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-white/10"
                          onLoad={(e) => {
                            // Clean up the object URL after the image loads
                            setTimeout(() => {
                              URL.revokeObjectURL((e.target as HTMLImageElement).src);
                            }, 1000);
                          }}
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
                        <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded max-w-full truncate">
                          {image.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="Add tags (press Enter to add)"
                maxLength={30}
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
                    key={`${tag}-${index}`}
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
            <div className="text-xs text-gray-400 mt-1">
              {formData.tags.length}/10 tags
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Publishing Story...</span>
                </>
              ) : (
                <>
                  <span>📖</span>
                  <span>Publish Story</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}