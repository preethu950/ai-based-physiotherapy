import React, { useEffect, useState } from 'react';

interface FormScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const FormScoreRing: React.FC<FormScoreRingProps> = ({ 
  score, 
  size = 120, 
  strokeWidth = 12 
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setAnimatedScore(score);
      return;
    }
    
    let current = 0;
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = score / steps;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s >= 70) return '#10B981'; // success/green
    if (s >= 50) return '#F59E0B'; // warning/amber
    return '#EF4444'; // error/red
  };

  const color = getColor(animatedScore);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-surface"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-navy">
        <span className="text-3xl font-bold" style={{ color }}>{animatedScore}</span>
        <span className="text-xs font-medium text-navy-light uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
};
