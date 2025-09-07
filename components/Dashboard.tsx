'use client';

import { useState, useEffect } from 'react';
import { ActionPromptButton } from './ActionPromptButton';
import { ServiceCard } from './ServiceCard';
import { analyticsAPI, serviceAPI, realtimeAPI } from '@/lib/api';
import type { Service } from '@/lib/types';
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Clock, 
  Star,
  Activity,
  Zap,
  Target
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

interface DashboardStats {
  totalServices: number;
  activeUsers: number;
  recentEngagements: number;
  availabilityUpdates: number;
}

interface RecentActivity {
  id: string;
  type: 'status_update' | 'service_added' | 'engagement' | 'ai_interaction';
  message: string;
  timestamp: Date;
  icon: React.ReactNode;
  color: string;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    activeUsers: 0,
    recentEngagements: 0,
    availabilityUpdates: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time subscriptions
    const unsubscribeServices = realtimeAPI.subscribeToServiceUpdates((services) => {
      setFeaturedServices(services.slice(0, 3)); // Show top 3 services
      setStats(prev => ({ ...prev, totalServices: services.length }));
    });

    return () => {
      unsubscribeServices();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load services
      const services = await serviceAPI.getServices();
      setFeaturedServices(services.slice(0, 3));
      
      // Mock stats - in a real app, these would come from analytics API
      setStats({
        totalServices: services.length,
        activeUsers: 42,
        recentEngagements: 18,
        availabilityUpdates: 7,
      });

      // Mock recent activities
      setRecentActivities([
        {
          id: '1',
          type: 'status_update',
          message: 'Status updated to "Available for Brainstorming"',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          icon: <Activity className="w-4 h-4" />,
          color: 'text-accent',
        },
        {
          id: '2',
          type: 'service_added',
          message: 'New service "Feature Addition" added',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          icon: <Zap className="w-4 h-4" />,
          color: 'text-primary',
        },
        {
          id: '3',
          type: 'engagement',
          message: 'Client engagement: "Ready to start scoping?"',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          icon: <MessageCircle className="w-4 h-4" />,
          color: 'text-green-400',
        },
        {
          id: '4',
          type: 'ai_interaction',
          message: 'AI assistant helped refine service description',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          icon: <Target className="w-4 h-4" />,
          color: 'text-purple-400',
        },
      ]);

      // Track dashboard view
      await analyticsAPI.trackEvent('dashboard_viewed');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    await analyticsAPI.trackEvent('quick_action_clicked', { action });
    onNavigate(action);
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white bg-opacity-10 rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-white bg-opacity-5 rounded w-96 mx-auto"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-4 bg-white bg-opacity-10 rounded w-20 mb-2"></div>
              <div className="h-8 bg-white bg-opacity-10 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-text-emphasized mb-4">
          Signal Your Availability
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto leading-relaxed">
          Instantly broadcast your readiness for startup tasks and showcase your services 
          to potential clients in your social network.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary bg-opacity-20 rounded-lg">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Total Services</p>
              <p className="text-2xl font-bold text-text-emphasized">{stats.totalServices}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent bg-opacity-20 rounded-lg">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Active Users</p>
              <p className="text-2xl font-bold text-text-emphasized">{stats.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
              <MessageCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Engagements</p>
              <p className="text-2xl font-bold text-text-emphasized">{stats.recentEngagements}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 bg-opacity-20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Status Updates</p>
              <p className="text-2xl font-bold text-text-emphasized">{stats.availabilityUpdates}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-text-emphasized mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <ActionPromptButton
              onClick={() => handleQuickAction('profile')}
              variant="primary"
              className="w-full justify-start"
            >
              <Activity className="w-4 h-4 mr-2" />
              Update My Status
            </ActionPromptButton>
            
            <ActionPromptButton
              onClick={() => handleQuickAction('services')}
              variant="secondary"
              className="w-full justify-start"
            >
              <Zap className="w-4 h-4 mr-2" />
              Browse Services
            </ActionPromptButton>
            
            <ActionPromptButton
              onClick={() => handleQuickAction('ai-assistant')}
              variant="secondary"
              className="w-full justify-start"
            >
              <Target className="w-4 h-4 mr-2" />
              Get AI Assistance
            </ActionPromptButton>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-text-emphasized mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-white bg-opacity-5 rounded-lg">
                <div className={`${activity.color} mt-0.5`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-muted">{activity.message}</p>
                  <p className="text-xs text-text-muted opacity-70 mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-emphasized flex items-center gap-2">
              <Star className="w-5 h-5 text-accent" />
              Featured Services
            </h3>
            <ActionPromptButton
              onClick={() => handleQuickAction('services')}
              variant="secondary"
            >
              View All
            </ActionPromptButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.serviceId}
                service={service}
                variant="compact"
                onClick={() => {
                  analyticsAPI.trackServiceInteraction(service.serviceId, 'click');
                  // Handle service click
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
