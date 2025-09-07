'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name } from '@coinbase/onchainkit/identity';
import { UserProfile } from '@/components/UserProfile';
import { ServiceMenu } from '@/components/ServiceMenu';
import { AIAssistant } from '@/components/AIAssistant';
import { ActionPromptButton } from '@/components/ActionPromptButton';
import { Dashboard } from '@/components/Dashboard';
import { AddServiceModal } from '@/components/AddServiceModal';
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
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [userServices, setUserServices] = useState<Service[]>([]);

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

  const handleAddService = () => {
    setShowAddServiceModal(true);
  };

  const handleServiceAdded = (newService: Service) => {
    setUserServices(prev => [...prev, newService]);
    setShowAddServiceModal(false);
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
    <Dashboard onNavigate={setCurrentView} />
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'profile':
        return (
          <UserProfile
            onServiceClick={handleServiceClick}
            onAddService={handleAddService}
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

        {/* Add Service Modal */}
        <AddServiceModal
          isOpen={showAddServiceModal}
          onClose={() => setShowAddServiceModal(false)}
          onServiceAdded={handleServiceAdded}
          userId="user1"
        />
      </div>
    </div>
  );
}
