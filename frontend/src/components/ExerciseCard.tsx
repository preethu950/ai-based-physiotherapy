import React from 'react';
import { Play, Info, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExerciseCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  hasAnalyzer: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  id,
  name,
  category,
  description,
  hasAnalyzer
}) => {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-surface-alt flex flex-col group hover:shadow-md transition-shadow">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue/10 text-blue">
            {category}
          </span>
          <div className="flex items-center text-navy-light text-xs gap-1 bg-surface px-2 py-1 rounded">
            <Video size={14} /> View
          </div>
        </div>
        <h3 className="text-xl font-bold text-navy mb-2">{name}</h3>
        <p className="text-sm text-navy-light line-clamp-2 mb-4">{description}</p>
        
        {!hasAnalyzer && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface text-navy-light text-xs font-medium mt-auto">
            <Info size={14} /> Analysis coming soon
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-surface-alt bg-surface/50">
        <div className="flex gap-3">
          {hasAnalyzer ? (
            <Link 
              to={`/session/${id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-teal text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-[#0F998A] transition-colors"
            >
              <Play size={18} fill="currentColor" />
              Start AI Session
            </Link>
          ) : (
            <Link 
              to={`/exercises/${id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-navy border border-surface-alt py-2.5 px-4 rounded-xl font-semibold hover:bg-surface transition-colors"
            >
              View Details
            </Link>
          )}
          {hasAnalyzer && (
            <Link 
              to={`/exercises/${id}`}
              className="flex items-center justify-center bg-white text-navy border border-surface-alt p-2.5 rounded-xl hover:bg-surface transition-colors"
              aria-label="View Details"
            >
              <Info size={20} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
