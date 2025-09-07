import { Service } from './types';

export const SERVICE_CATEGORIES = {
  scoping: {
    name: 'Idea Scoping',
    description: 'Help define and scope your startup ideas',
    icon: '🎯',
    color: 'from-blue-500 to-cyan-500'
  },
  deployment: {
    name: 'Deployment',
    description: 'Deploy your applications and services',
    icon: '🚀',
    color: 'from-purple-500 to-pink-500'
  },
  brainstorming: {
    name: 'Brainstorming',
    description: 'Creative ideation and problem solving',
    icon: '💡',
    color: 'from-yellow-500 to-orange-500'
  },
  'feature-addition': {
    name: 'Feature Addition',
    description: 'Add new features to existing products',
    icon: '⚡',
    color: 'from-green-500 to-teal-500'
  }
} as const;

export const AVAILABILITY_STATUSES = {
  available: {
    label: 'Available',
    color: 'status-available',
    description: 'Ready to take on new tasks'
  },
  busy: {
    label: 'Busy',
    color: 'status-busy',
    description: 'Currently working on projects'
  },
  free: {
    label: 'Free',
    color: 'status-free',
    description: 'Open for quick consultations'
  }
} as const;

export const MOCK_SERVICES: Service[] = [
  {
    serviceId: '1',
    userId: 'user1',
    name: 'Fast-track Brainstorming',
    description: 'Rapid ideation sessions to unlock creative solutions and breakthrough ideas for your startup challenges.',
    category: 'brainstorming',
    price: 50
  },
  {
    serviceId: '2',
    userId: 'user1',
    name: 'Deployment',
    description: 'End-to-end deployment solutions from development to production with monitoring and scaling.',
    category: 'deployment',
    price: 200
  },
  {
    serviceId: '3',
    userId: 'user1',
    name: 'Feature Addition',
    description: 'Strategic feature development and integration to enhance your product capabilities.',
    category: 'feature-addition',
    price: 150
  }
];
