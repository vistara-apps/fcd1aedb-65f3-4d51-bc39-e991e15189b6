'use client';

import { ServiceCard } from './ServiceCard';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import type { Service, ServiceCategory } from '@/lib/types';
import { BarChart3, Zap, Lightbulb, Rocket } from 'lucide-react';

interface ServiceMenuProps {
  onServiceSelect?: (category: ServiceCategory) => void;
}

const FEATURED_SERVICES: Service[] = [
  {
    serviceId: 'featured-1',
    userId: 'system',
    name: 'Idea Scoping',
    description: 'Our expert team helps you define and scope your startup ideas with precision.',
    category: 'scoping'
  },
  {
    serviceId: 'featured-2',
    userId: 'system',
    name: 'Deployment',
    description: 'End-to-end deployment solutions from development to production.',
    category: 'deployment'
  },
  {
    serviceId: 'featured-3',
    userId: 'system',
    name: 'Feature Addition',
    description: 'Strategic feature development to enhance your product capabilities.',
    category: 'feature-addition'
  }
];

const CATEGORY_ICONS = {
  scoping: BarChart3,
  deployment: Rocket,
  brainstorming: Lightbulb,
  'feature-addition': Zap
};

export function ServiceMenu({ onServiceSelect }: ServiceMenuProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-emphasized mb-2">Service Menu</h2>
        <p className="text-text-muted">Choose from our range of startup assistance services</p>
      </div>

      {/* Featured Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FEATURED_SERVICES.map((service) => (
          <ServiceCard
            key={service.serviceId}
            service={service}
            variant="compact"
            onClick={() => onServiceSelect?.(service.category)}
          />
        ))}
      </div>

      {/* Service Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-emphasized">All Categories</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => {
            const IconComponent = CATEGORY_ICONS[key as ServiceCategory];
            
            return (
              <button
                key={key}
                onClick={() => onServiceSelect?.(key as ServiceCategory)}
                className="glass-card p-4 text-left hover:bg-opacity-10 transition-all duration-200 group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                
                <h4 className="font-semibold text-text-emphasized mb-1">{category.name}</h4>
                <p className="text-sm text-text-muted">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
