import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M20 80C30 80 40 70 50 50C60 30 70 20 80 20" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="80" r="12" fill="currentColor"/>
      <circle cx="50" cy="50" r="12" fill="currentColor"/>
      <circle cx="80" cy="20" r="12" fill="currentColor"/>
    </svg>
  );
};
