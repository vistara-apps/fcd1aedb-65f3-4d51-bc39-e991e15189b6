import type { User, Service, AvailabilityUpdate, AvailabilityStatus, ServiceCategory } from './types';

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Farcaster/Neynar API configuration
const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';

/**
 * User API functions
 */
export const userAPI = {
  async getUser(userId: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },

  async updateAvailabilityStatus(userId: string, status: AvailabilityStatus): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating availability:', error);
      return false;
    }
  },
};

/**
 * Service API functions
 */
export const serviceAPI = {
  async getServices(userId?: string): Promise<Service[]> {
    try {
      const url = userId ? `${API_BASE_URL}/services?userId=${userId}` : `${API_BASE_URL}/services`;
      const response = await fetch(url);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },

  async createService(service: Omit<Service, 'serviceId'>): Promise<Service | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error creating service:', error);
      return null;
    }
  },

  async updateService(serviceId: string, updates: Partial<Service>): Promise<Service | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error updating service:', error);
      return null;
    }
  },

  async deleteService(serviceId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting service:', error);
      return false;
    }
  },
};

/**
 * Farcaster API functions
 */
export const farcasterAPI = {
  async getUserByFid(fid: string): Promise<any> {
    try {
      const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/user?fid=${fid}`, {
        headers: {
          'api_key': NEYNAR_API_KEY,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching Farcaster user:', error);
      return null;
    }
  },

  async publishCast(text: string, parentUrl?: string): Promise<boolean> {
    try {
      const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/cast`, {
        method: 'POST',
        headers: {
          'api_key': NEYNAR_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          parent_url: parentUrl,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error publishing cast:', error);
      return false;
    }
  },

  async publishAvailabilityUpdate(status: AvailabilityStatus, category: ServiceCategory, username: string): Promise<boolean> {
    const statusEmojis = {
      available: '🟢',
      busy: '🔴',
      free: '🟡',
    };

    const categoryEmojis = {
      scoping: '🎯',
      deployment: '🚀',
      brainstorming: '💡',
      'feature-addition': '⚡',
    };

    const text = `${statusEmojis[status]} ${username} is now ${status} for ${category} ${categoryEmojis[category]} #StatusBoard #${category}`;
    
    return this.publishCast(text);
  },
};

/**
 * Analytics and tracking
 */
export const analyticsAPI = {
  async trackEvent(event: string, properties: Record<string, any> = {}): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, properties, timestamp: new Date().toISOString() }),
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  },

  async trackAvailabilityChange(userId: string, oldStatus: AvailabilityStatus, newStatus: AvailabilityStatus): Promise<void> {
    await this.trackEvent('availability_changed', {
      userId,
      oldStatus,
      newStatus,
    });
  },

  async trackServiceInteraction(serviceId: string, action: 'view' | 'click' | 'engage'): Promise<void> {
    await this.trackEvent('service_interaction', {
      serviceId,
      action,
    });
  },
};

/**
 * Real-time subscriptions
 */
export const realtimeAPI = {
  subscribeToUserUpdates(userId: string, callback: (update: any) => void): () => void {
    // This would typically use WebSocket or Server-Sent Events
    // For now, we'll use polling as a fallback
    const interval = setInterval(async () => {
      const user = await userAPI.getUser(userId);
      if (user) {
        callback(user);
      }
    }, 5000);

    return () => clearInterval(interval);
  },

  subscribeToServiceUpdates(callback: (services: Service[]) => void): () => void {
    const interval = setInterval(async () => {
      const services = await serviceAPI.getServices();
      callback(services);
    }, 10000);

    return () => clearInterval(interval);
  },
};

/**
 * Error handling utilities
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: any): APIError {
  if (error instanceof APIError) {
    return error;
  }
  
  if (error.response) {
    return new APIError(
      error.response.data?.message || 'API request failed',
      error.response.status,
      error.response.data?.code
    );
  }
  
  return new APIError('Network error occurred', 0);
}
