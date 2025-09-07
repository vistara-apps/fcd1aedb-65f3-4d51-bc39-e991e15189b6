'use client';

import { useState } from 'react';
import { ActionPromptButton } from './ActionPromptButton';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import type { ServiceCategory, Service } from '@/lib/types';
import { serviceAPI, analyticsAPI } from '@/lib/api';
import { X, DollarSign } from 'lucide-react';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceAdded: (service: Service) => void;
  userId: string;
}

export function AddServiceModal({ isOpen, onClose, onServiceAdded, userId }: AddServiceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'brainstorming' as ServiceCategory,
    price: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Service description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.price && (isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
      newErrors.price = 'Price must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const serviceData = {
        userId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: formData.price ? Number(formData.price) : undefined,
      };

      const newService = await serviceAPI.createService(serviceData);

      if (newService) {
        // Track service creation
        await analyticsAPI.trackEvent('service_created', {
          serviceId: newService.serviceId,
          category: newService.category,
          hasPrice: !!newService.price,
        });

        onServiceAdded(newService);
        handleClose();
      } else {
        setErrors({ submit: 'Failed to create service. Please try again.' });
      }
    } catch (error) {
      console.error('Error creating service:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      category: 'brainstorming',
      price: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="glass-card p-6 max-w-md w-full animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-text-emphasized">Add New Service</h3>
          <button
            onClick={handleClose}
            className="glass-button p-2 rounded-lg hover:bg-opacity-20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-text-emphasized mb-2">
              Service Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 glass-card border border-white border-opacity-20 rounded-md text-text-emphasized placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Fast-track Brainstorming"
              maxLength={100}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Service Category */}
          <div>
            <label className="block text-sm font-medium text-text-emphasized mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
              className="w-full px-3 py-2 glass-card border border-white border-opacity-20 rounded-md text-text-emphasized focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key} className="bg-surface text-text-emphasized">
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service Description */}
          <div>
            <label className="block text-sm font-medium text-text-emphasized mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 glass-card border border-white border-opacity-20 rounded-md text-text-emphasized placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Describe what you offer and how it helps clients..."
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
              <p className="text-text-muted text-sm ml-auto">
                {formData.description.length}/500
              </p>
            </div>
          </div>

          {/* Price (Optional) */}
          <div>
            <label className="block text-sm font-medium text-text-emphasized mb-2">
              Price (Optional)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full pl-10 pr-3 py-2 glass-card border border-white border-opacity-20 rounded-md text-text-emphasized placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <ActionPromptButton
              type="button"
              onClick={handleClose}
              variant="secondary"
              disabled={isSubmitting}
            >
              Cancel
            </ActionPromptButton>
            
            <ActionPromptButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Service'}
            </ActionPromptButton>
          </div>
        </form>
      </div>
    </div>
  );
}
