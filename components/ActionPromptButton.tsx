'use client';

import type { ReactNode } from 'react';

interface ActionPromptButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function ActionPromptButton({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ActionPromptButtonProps) {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:scale-105",
    secondary: "glass-button text-text-emphasized hover:bg-opacity-20"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
