'use client';

import { useState } from 'react';
import { AVAILABILITY_STATUSES } from '@/lib/constants';
import type { AvailabilityStatus, StatusSelectorProps } from '@/lib/types';

export function StatusSelector({ currentStatus, onStatusChange, variant = 'free' }: StatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusSelect = (status: AvailabilityStatus) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`glass-button px-4 py-2 rounded-md flex items-center gap-2 ${AVAILABILITY_STATUSES[currentStatus].color}`}
      >
        <div className="w-2 h-2 rounded-full bg-current"></div>
        <span className="font-medium">{AVAILABILITY_STATUSES[currentStatus].label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full glass-card p-2 z-10 animate-fade-in">
          {Object.entries(AVAILABILITY_STATUSES).map(([status, config]) => (
            <button
              key={status}
              onClick={() => handleStatusSelect(status as AvailabilityStatus)}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-all duration-200 flex items-center gap-2 ${config.color}`}
            >
              <div className="w-2 h-2 rounded-full bg-current"></div>
              <div>
                <div className="font-medium">{config.label}</div>
                <div className="text-sm opacity-70">{config.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
