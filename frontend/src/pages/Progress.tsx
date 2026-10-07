import React, { useState } from 'react';
import { StatCard } from '../components/StatCard';
import { Activity, Target, Flame, Trophy } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockTrendData = [
  { date: 'Oct 1', score: 60, rom: 50 },
  { date: 'Oct 5', score: 65, rom: 55 },
  { date: 'Oct 10', score: 72, rom: 60 },
  { date: 'Oct 15', score: 70, rom: 65 },
  { date: 'Oct 20', score: 78, rom: 75 },
  { date: 'Oct 25', score: 85, rom: 80 }
];

export const Progress: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [includeDemo, setIncludeDemo] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">My Progress</h1>
          <p className="text-navy-light">Track your improvement over time.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-surface-alt">
          <div className="flex bg-surface rounded-lg p-1">
            {['7d', '30d', '3m'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range ? 'bg-white shadow-sm text-navy' : 'text-navy-light hover:text-navy'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="h-6 w-px bg-surface-alt"></div>
          <label className="flex items-center gap-2 text-sm text-navy cursor-pointer pr-2">
            <input 
              type="checkbox" 
              checked={includeDemo} 
              onChange={(e) => setIncludeDemo(e.target.checked)}
              className="rounded text-teal focus:ring-teal"
            />
            Include Demo
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sessions" value={42} icon={Activity} />
        <StatCard title="Total Reps" value={650} icon={Target} />
        <StatCard title="Avg Score" value="76" icon={Trophy} color="text-teal" />
        <StatCard title="Best Score" value="92" icon={Flame} color="text-warning" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-2xl border border-surface-alt shadow-sm">
          <h3 className="font-bold text-navy mb-6">Form Score Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="score" stroke="#14B8A6" strokeWidth={3} dot={{ r: 4, fill: '#14B8A6', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-surface-alt shadow-sm">
          <h3 className="font-bold text-navy mb-6">Range of Motion (ROM) Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="rom" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
