'use client';

import { useState, useEffect, useRef } from 'react';
import { AVAILABILITY_STATUSES } from '@/lib/constants';
import type { AvailabilityStatus, StatusSelectorProps } from '@/lib/types';
import { userAPI, analyticsAPI, farcasterAPI } from '@/lib/api';

export function StatusSelector({ currentStatus, onStatusChange, variant = 'free' }: StatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusSelect = async (status: AvailabilityStatus) => {
    if (status === currentStatus || isUpdating) return;
    
    setIsUpdating(true);
    setIsOpen(false);
    
    try {
      // Track the status change
      await analyticsAPI.trackAvailabilityChange('user1', currentStatus, status);
      
      // Update the status via API
      const success = await userAPI.updateAvailabilityStatus('user1', status);
      
      if (success) {
        onStatusChange(status);
        
        // Optionally publish to Farcaster (in a real app, this would be user-configurable)
        // await farcasterAPI.publishAvailabilityUpdate(status, 'brainstorming', 'Sarah Adams');
      } else {
        console.error('Failed to update availability status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !isUpdating && setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`glass-button px-4 py-2 rounded-md flex items-center gap-2 ${AVAILABILITY_STATUSES[currentStatus].color} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className={`w-2 h-2 rounded-full bg-current ${isUpdating ? 'animate-pulse' : ''}`}></div>
        <span className="font-medium">
          {isUpdating ? 'Updating...' : AVAILABILITY_STATUSES[currentStatus].label}
        </span>
        {!isUpdating && (
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && !isUpdating && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] glass-card p-2 z-10 animate-fade-in">
          {Object.entries(AVAILABILITY_STATUSES).map(([status, config]) => (
            <button
              key={status}
              onClick={() => handleStatusSelect(status as AvailabilityStatus)}
              disabled={status === currentStatus}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-all duration-200 flex items-center gap-2 ${config.color} ${status === currentStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="w-2 h-2 rounded-full bg-current"></div>
              <div>
                <div className="font-medium">{config.label}</div>
                <div className="text-sm opacity-70">{config.description}</div>
              </div>
              {status === currentStatus && (
                <div className="ml-auto">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
