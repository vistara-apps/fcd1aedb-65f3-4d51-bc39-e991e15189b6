export interface User {
  userId: string;
  farcasterId: string;
  username: string;
  bio: string;
  availabilityStatus: AvailabilityStatus;
  servicesOffered: Service[];
}

export interface Service {
  serviceId: string;
  userId: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price?: number;
}

export interface AvailabilityUpdate {
  updateId: string;
  userId: string;
  statusType: AvailabilityStatus;
  timestamp: Date;
  duration?: number;
}

export type AvailabilityStatus = 'available' | 'busy' | 'free';
export type ServiceCategory = 'scoping' | 'deployment' | 'brainstorming' | 'feature-addition';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ServiceCardProps {
  service: Service;
  variant?: 'compact' | 'detailed';
  onClick?: () => void;
}

export interface StatusSelectorProps {
  currentStatus: AvailabilityStatus;
  onStatusChange: (status: AvailabilityStatus) => void;
  variant?: 'free' | 'paid' | 'busy';
}
