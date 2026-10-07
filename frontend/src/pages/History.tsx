import React from 'react';
import { SessionCard } from '../components/SessionCard';
import { EmptyState } from '../components/EmptyState';
import { History as HistoryIcon } from 'lucide-react';

const mockHistory = [
  { id: '1', date: '2023-10-25T10:00:00Z', exerciseName: 'Bodyweight Squat', reps: 15, score: 85, duration: 240, isDemo: false },
  { id: '2', date: '2023-10-24T14:30:00Z', exerciseName: 'Push Up', reps: 12, score: 72, duration: 180, isDemo: false },
  { id: '3', date: '2023-10-22T09:15:00Z', exerciseName: 'Forward Lunge', reps: 20, score: 65, duration: 300, isDemo: true },
  { id: '4', date: '2023-10-20T11:00:00Z', exerciseName: 'Bodyweight Squat', reps: 10, score: 45, duration: 150, isDemo: false }
];

export const History: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Session History</h1>
        <p className="text-navy-light">Review your past workouts and detailed feedback.</p>
      </div>

      {mockHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockHistory.map(session => (
            <SessionCard key={session.id} {...session} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={HistoryIcon}
          title="No sessions yet"
          message="You haven't completed any tracked sessions. Start an AI session from the Exercise Library."
          action={{ label: "Go to Exercises", onClick: () => window.location.href = '/exercises' }}
        />
      )}
    </div>
  );
};
