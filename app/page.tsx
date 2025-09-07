'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name } from '@coinbase/onchainkit/identity';
import { UserProfile } from '@/components/UserProfile';
import { ServiceMenu } from '@/components/ServiceMenu';
import { AIAssistant } from '@/components/AIAssistant';
import { ActionPromptButton } from '@/components/ActionPromptButton';
import { generateTaskPrompt } from '@/lib/ai';
import type { Service, ServiceCategory } from '@/lib/types';
import { MessageCircle, Menu, X, Home, User, Briefcase } from 'lucide-react';

type ViewMode = 'dashboard' | 'profile' | 'services' | 'ai-assistant';

export default function StatusBoard() {
  const { setFrameReady } = useMiniKit();
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showTaskPrompt, setShowTaskPrompt] = useState(false);
  const [taskPromptMessage, setTaskPromptMessage] = useState('');

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    const prompt = generateTaskPrompt(service.category, 'Sarah Adams');
    setTaskPromptMessage(prompt);
    setShowTaskPrompt(true);
  };

  const handleServiceSelect = (category: ServiceCategory) => {
    const prompt = generateTaskPrompt(category, 'Available Expert');
    setTaskPromptMessage(prompt);
    setShowTaskPrompt(true);
  };

  const handleTaskPromptResponse = (accepted: boolean) => {
    setShowTaskPrompt(false);
    if (accepted) {
      setCurrentView('ai-assistant');
    }
    setSelectedService(null);
  };

  const renderNavigation = () => (
    <div className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <h1 className="text-xl font-bold text-text-emphasized">StatusBoard</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`glass-button p-2 rounded-lg ${currentView === 'dashboard' ? 'bg-opacity-20' : ''}`}
          >
            <Home className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentView('profile')}
            className={`glass-button p-2 rounded-lg ${currentView === 'profile' ? 'bg-opacity-20' : ''}`}
          >
            <User className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentView('services')}
            className={`glass-button p-2 rounded-lg ${currentView === 'services' ? 'bg-opacity-20' : ''}`}
          >
            <Briefcase className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentView('ai-assistant')}
            className={`glass-button p-2 rounded-lg ${currentView === 'ai-assistant' ? 'bg-opacity-20' : ''}`}
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          <Wallet>
            <ConnectWallet>
              <Name />
            </ConnectWallet>
          </Wallet>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-text-emphasized mb-4">
          Signal Your Availability
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto leading-relaxed">
          Instantly broadcast your readiness for startup tasks and showcase your services 
          to potential clients in your social network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-text-emphasized mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <ActionPromptButton
              onClick={() => setCurrentView('profile')}
              variant="primary"
            >
              Update My Status
            </ActionPromptButton>
            
            <ActionPromptButton
              onClick={() => setCurrentView('services')}
              variant="secondary"
            >
              Browse Services
            </ActionPromptButton>
            
            <ActionPromptButton
              onClick={() => setCurrentView('ai-assistant')}
              variant="secondary"
            >
              Get AI Assistance
            </ActionPromptButton>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-text-emphasized mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white bg-opacity-5 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span className="text-sm text-text-muted">Status updated to "Available for Brainstorming"</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white bg-opacity-5 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-sm text-text-muted">New service "Feature Addition" added</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white bg-opacity-5 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-text-muted">Client engagement: "Ready to start scoping?"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'profile':
        return (
          <UserProfile
            onServiceClick={handleServiceClick}
            onAddService={() => console.log('Add service clicked')}
          />
        );
      
      case 'services':
        return <ServiceMenu onServiceSelect={handleServiceSelect} />;
      
      case 'ai-assistant':
        return (
          <AIAssistant
            context={selectedService ? `Service: ${selectedService.name} - ${selectedService.description}` : ''}
            onClose={() => setCurrentView('dashboard')}
          />
        );
      
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {renderNavigation()}
        {renderCurrentView()}

        {/* Task Prompt Modal */}
        {showTaskPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="glass-card p-6 max-w-md w-full animate-slide-up">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-text-emphasized mb-2">
                  Ready to Get Started?
                </h3>
                
                <p className="text-text-muted">
                  {taskPromptMessage}
                </p>
              </div>

              <div className="flex gap-3">
                <ActionPromptButton
                  onClick={() => handleTaskPromptResponse(false)}
                  variant="secondary"
                >
                  Not Now
                </ActionPromptButton>
                
                <ActionPromptButton
                  onClick={() => handleTaskPromptResponse(true)}
                  variant="primary"
                >
                  Let's Do It!
                </ActionPromptButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
