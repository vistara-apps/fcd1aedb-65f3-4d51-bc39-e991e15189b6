'use client';

import { useState } from 'react';
import { StatusSelector } from './StatusSelector';
import { ServiceCard } from './ServiceCard';
import { ActionPromptButton } from './ActionPromptButton';
import { MOCK_SERVICES } from '@/lib/constants';
import type { AvailabilityStatus, Service } from '@/lib/types';
import { User, Settings2, Plus } from 'lucide-react';

interface UserProfileProps {
  onServiceClick?: (service: Service) => void;
  onAddService?: () => void;
}

export function UserProfile({ onServiceClick, onAddService }: UserProfileProps) {
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('available');
  const [services] = useState(MOCK_SERVICES);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-bold text-text-emphasized">Sarah Adams</h2>
            <p className="text-text-muted">Full-stack developer & startup advisor</p>
          </div>
          
          <button className="glass-button p-2 rounded-lg">
            <Settings2 className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <StatusSelector
            currentStatus={availabilityStatus}
            onStatusChange={setAvailabilityStatus}
          />
        </div>

        <p className="text-text-muted text-sm leading-relaxed">
          Helping startups build and scale their products. Available for brainstorming sessions, 
          technical scoping, and deployment guidance.
        </p>
      </div>

      {/* Services Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-emphasized">My Services</h3>
          <ActionPromptButton
            variant="secondary"
            onClick={onAddService}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </ActionPromptButton>
        </div>

        <div className="grid gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.serviceId}
              service={service}
              variant="detailed"
              onClick={() => onServiceClick?.(service)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
