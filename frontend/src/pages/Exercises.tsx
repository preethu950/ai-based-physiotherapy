import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ExerciseCard } from '../components/ExerciseCard';

const mockExercises = [
  { id: 'squat', name: 'Bodyweight Squat', category: 'Lower Body', description: 'Improves leg strength and mobility.', hasAnalyzer: true },
  { id: 'lunge', name: 'Forward Lunge', category: 'Lower Body', description: 'Builds single-leg stability.', hasAnalyzer: false },
  { id: 'pushup', name: 'Push Up', category: 'Upper Body', description: 'Core and upper body strength.', hasAnalyzer: true }
];

const categories = ['All', 'Lower Body', 'Upper Body', 'Full Body'];

export const Exercises: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = mockExercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || ex.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Exercise Library</h1>
        <p className="text-navy-light">Browse AI-supported exercises and start your session.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-surface-alt shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-light" size={20} />
          <input 
            type="text" 
            placeholder="Search exercises..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface rounded-xl border-none focus:ring-2 focus:ring-teal outline-none transition-shadow"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-colors ${
                activeCategory === c 
                ? 'bg-navy text-white' 
                : 'bg-surface text-navy-light hover:bg-surface-alt'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(ex => (
          <ExerciseCard key={ex.id} {...ex} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-navy-light">
          No exercises found matching your criteria.
        </div>
      )}
    </div>
  );
};
