import React from 'react';
import { Activity, Target, Flame, TrendingUp } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const mockData = [
  { day: 'Mon', score: 65, reps: 20 },
  { day: 'Tue', score: 70, reps: 25 },
  { day: 'Wed', score: 68, reps: 15 },
  { day: 'Thu', score: 75, reps: 30 },
  { day: 'Fri', score: 82, reps: 25 },
  { day: 'Sat', score: 85, reps: 35 },
  { day: 'Sun', score: 90, reps: 40 },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold text-navy">{getGreeting()}, {user?.name || 'User'}</h1>
        <p className="text-navy-light mt-1">Here is your recovery progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sessions" value={24} icon={Activity} trend={{ value: 12, label: 'vs last week' }} />
        <StatCard title="Total Reps" value={342} icon={Target} trend={{ value: 5, label: 'vs last week' }} />
        <StatCard title="Avg Form Score" value="78" icon={TrendingUp} trend={{ value: 3, label: 'vs last week' }} />
        <StatCard title="Current Streak" value="5 days" icon={Flame} color="text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-2xl border border-surface-alt">
          <h3 className="font-bold text-navy mb-6">Form Score Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="score" stroke="#14B8A6" strokeWidth={3} dot={{ r: 4, fill: '#14B8A6', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-surface-alt">
          <h3 className="font-bold text-navy mb-6">Weekly Activity (Reps)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#F3F4F6' }}
                />
                <Bar dataKey="reps" fill="#0B1F3A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-navy">Recommended Exercises</h2>
          <Link to="/exercises" className="text-teal font-medium hover:text-teal-dark">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Example static cards for dashboard */}
          <div className="bg-card rounded-xl p-5 border border-surface-alt">
            <h4 className="font-bold text-navy mb-1">Squat</h4>
            <p className="text-sm text-navy-light mb-4">Lower body strength</p>
            <Link to="/exercises/squat" className="text-teal text-sm font-medium">View details &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
