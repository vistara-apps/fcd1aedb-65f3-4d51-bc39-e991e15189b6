'use client';

import { SERVICE_CATEGORIES } from '@/lib/constants';
import type { ServiceCardProps } from '@/lib/types';

export function ServiceCard({ service, variant = 'compact', onClick }: ServiceCardProps) {
  const categoryConfig = SERVICE_CATEGORIES[service.category];

  return (
    <div
      onClick={onClick}
      className={`service-card ${variant === 'detailed' ? 'p-6' : 'p-4'} animate-slide-up`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${categoryConfig.color} flex items-center justify-center text-2xl`}>
          {categoryConfig.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-emphasized mb-1">{service.name}</h3>
          
          {variant === 'detailed' && (
            <p className="text-text-muted text-sm mb-3 leading-relaxed">
              {service.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted bg-white bg-opacity-10 px-2 py-1 rounded-full">
              {categoryConfig.name}
            </span>
            
            {service.price && (
              <span className="text-accent font-medium">
                ${service.price}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {variant === 'compact' && (
        <div className="mt-3 text-sm text-text-muted line-clamp-2">
          {service.description}
        </div>
      )}
    </div>
  );
}
