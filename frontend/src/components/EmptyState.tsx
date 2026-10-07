import React from 'react';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl border border-surface-alt">
      <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-6 text-navy-light">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold text-navy mb-2">{title}</h3>
      <p className="text-navy-light mb-8 max-w-md">{message}</p>
      {action && (
        <button 
          onClick={action.onClick}
          className="px-6 py-3 bg-teal text-white rounded-xl font-semibold hover:bg-[#0F998A] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
