import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Camera, CheckCircle2, AlertTriangle, Play, ChevronLeft } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const ExerciseDetail: React.FC = () => {
  const { id } = useParams();

  // Mock data
  const exercise = {
    name: 'Bodyweight Squat',
    category: 'Lower Body',
    description: 'A fundamental lower body exercise that strengthens the thighs, hips, and buttocks while improving mobility.',
    hasAnalyzer: true,
    instructions: [
      'Stand with feet shoulder-width apart, toes pointing slightly outward.',
      'Keep your back straight, chest up, and core engaged.',
      'Initiate the movement by pushing your hips back as if sitting in a chair.',
      'Bend your knees, keeping them tracking over your toes.',
      'Lower until your thighs are parallel to the floor (or as low as comfortable).',
      'Push through your heels to return to the starting position.'
    ],
    mistakes: [
      'Knees caving inward (valgus collapse)',
      'Heels lifting off the floor',
      'Rounding the lower back',
      'Not going deep enough'
    ],
    metrics: ['Knee Flexion Angle', 'Hip Hinge Alignment', 'Trunk Angle'],
    recommendedReps: 15
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8">
      <Link to="/exercises" className="inline-flex items-center text-navy-light hover:text-navy font-medium">
        <ChevronLeft size={20} className="mr-1" /> Back to Library
      </Link>

      <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-surface-alt">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <span className="inline-block px-3 py-1 bg-blue/10 text-blue rounded-full text-sm font-semibold mb-4">
              {exercise.category}
            </span>
            <h1 className="text-4xl font-bold text-navy mb-4">{exercise.name}</h1>
            <p className="text-lg text-navy-light max-w-2xl">{exercise.description}</p>
          </div>
          
          <div className="shrink-0 flex flex-col gap-4 w-full md:w-auto">
            {exercise.hasAnalyzer ? (
              <Link 
                to={`/session/${id}`}
                className="flex items-center justify-center gap-2 bg-teal text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-teal-dark transition-colors shadow-lg shadow-teal/20"
              >
                <Play size={24} fill="currentColor" />
                Start AI Session
              </Link>
            ) : (
              <div className="px-6 py-4 bg-surface rounded-xl text-navy-light font-medium text-center border border-surface-alt">
                Analysis coming soon
              </div>
            )}
            {exercise.hasAnalyzer && (
              <div className="flex items-center justify-center gap-2 text-sm text-navy-light bg-surface py-2 px-4 rounded-lg">
                <Camera size={16} /> Requires Camera Access
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-teal" /> Step-by-Step Instructions
            </h3>
            <ol className="space-y-4">
              {exercise.instructions.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-surface text-navy flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <span className="text-navy-light pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                <AlertTriangle className="text-warning" /> Common Mistakes
              </h3>
              <ul className="space-y-3">
                {exercise.mistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-3 text-navy-light">
                    <span className="text-warning mt-1">•</span> {mistake}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-surface p-6 rounded-xl border border-surface-alt">
              <h4 className="font-bold text-navy mb-4">Tracked Metrics</h4>
              <div className="flex flex-wrap gap-2">
                {exercise.metrics.map((m, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white text-navy-light text-sm rounded-lg border border-surface-alt">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
};
