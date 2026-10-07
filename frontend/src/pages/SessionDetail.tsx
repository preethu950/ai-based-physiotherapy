import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
// Reusing SessionSummary layout for SessionDetail as they display identical info but in a read-only context.
import { SessionSummary } from './SessionSummary'; 

export const SessionDetail: React.FC = () => {
  const { id: _id } = useParams();
  
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-6">
        <Link to="/history" className="inline-flex items-center text-navy-light hover:text-navy font-medium">
          <ChevronLeft size={20} className="mr-1" /> Back to History
        </Link>
      </div>
      {/* For simplicity in this demo, render SessionSummary which acts as the detail view */}
      <SessionSummary />
    </div>
  );
};
