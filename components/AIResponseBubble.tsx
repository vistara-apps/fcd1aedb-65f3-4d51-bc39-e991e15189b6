'use client';

import type { AIMessage } from '@/lib/types';

interface AIResponseBubbleProps {
  message: AIMessage;
  variant?: 'user' | 'assistant';
}

export function AIResponseBubble({ message, variant = 'assistant' }: AIResponseBubbleProps) {
  const isUser = variant === 'user' || message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-slide-up`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isUser 
          ? 'bg-primary text-white ml-4' 
          : 'glass-card text-text-emphasized mr-4'
      }`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center text-xs font-bold">
              AI
            </div>
            <span className="text-xs text-text-muted">Assistant</span>
          </div>
        )}
        
        <p className="text-sm leading-relaxed">{message.content}</p>
        
        <div className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
