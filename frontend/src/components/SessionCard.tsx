import React from 'react';
import { Calendar, Clock, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SessionCardProps {
  id: string;
  date: string;
  exerciseName: string;
  reps: number;
  score: number;
  duration: number; // in seconds
  isDemo?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  id,
  date,
  exerciseName,
  reps,
  score,
  duration,
  isDemo
}) => {
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (s: number) => {
    if (s >= 70) return 'text-success bg-success/10';
    if (s >= 50) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  return (
    <Link 
      to={`/history/${id}`}
      className="block bg-card rounded-2xl p-5 shadow-sm border border-surface-alt hover:shadow-md transition-shadow group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-navy group-hover:text-teal transition-colors">{exerciseName}</h4>
            {isDemo && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface text-navy-light">
                Demo
              </span>
            )}
          </div>
          <div className="flex items-center text-xs text-navy-light gap-1">
            <Calendar size={12} />
            {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-lg font-bold text-lg ${getScoreColor(score)}`}>
          {score}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface text-sm">
        <div className="flex items-center gap-2 text-navy">
          <Activity size={16} className="text-teal" />
          <span className="font-medium">{reps} <span className="text-navy-light font-normal">reps</span></span>
        </div>
        <div className="flex items-center gap-2 text-navy">
          <Clock size={16} className="text-teal" />
          <span className="font-medium">{formatDuration(duration)}</span>
        </div>
      </div>
    </Link>
  );
};
