import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 bg-surface flex flex-col items-center justify-center z-50" 
    : "w-full h-full min-h-[300px] flex flex-col items-center justify-center";

  return (
    <div className={containerClass}>
      <Loader2 className="w-10 h-10 text-teal animate-spin mb-4" />
      {message && <p className="text-navy-light font-medium">{message}</p>}
    </div>
  );
};
