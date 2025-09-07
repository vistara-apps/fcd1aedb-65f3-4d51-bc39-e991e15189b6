'use client';

import { useState } from 'react';
import { AIResponseBubble } from './AIResponseBubble';
import { ActionPromptButton } from './ActionPromptButton';
import { generateAIResponse } from '@/lib/ai';
import type { AIMessage } from '@/lib/types';
import { Send, Bot } from 'lucide-react';

interface AIAssistantProps {
  context?: string;
  onClose?: () => void;
}

export function AIAssistant({ context = '', onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m here to help you refine your service offerings and scope client requests. What would you like to work on?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputValue, context);
      
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-text-emphasized">AI Scoping Assistant</h3>
            <p className="text-sm text-text-muted">Here to help refine your services</p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="glass-button p-2 rounded-lg hover:bg-opacity-20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {messages.map((message) => (
          <AIResponseBubble key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-card px-4 py-2 rounded-lg mr-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about your services..."
          className="flex-1 glass-button px-4 py-2 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 text-text-emphasized placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          disabled={isLoading}
        />
        
        <ActionPromptButton
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          variant="primary"
        >
          <Send className="w-4 h-4" />
        </ActionPromptButton>
      </div>
    </div>
  );
}
