import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, AlertCircle, Play, Pause, Square, AlertTriangle, ShieldCheck } from 'lucide-react';
import { usePoseSession } from '../features/pose/hooks/usePoseSession';
import { SkeletonOverlay } from '../components/SkeletonOverlay';
import { getExercise } from '../features/pose/exerciseRegistry';

export const Session: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();

  const id = exerciseId || 'squat';
  const exercise = getExercise(id);

  const {
    state,
    stats,
    currentPhase,
    primaryAngle,
    activeFeedback,
    isDemo,
    landmarks,
    videoRef,
    requestCamera,
    startDemo,
    pauseSession,
    resumeSession,
    endSession,
    cameraError,
  } = usePoseSession(id);

  // Transition to summary when session finishes
  useEffect(() => {
    if (state === 'summary') {
      // Store current session stats in session storage for the summary page
      sessionStorage.setItem('current_session_stats', JSON.stringify({
        exerciseId: id,
        exerciseName: exercise?.name || id,
        startedAt: new Date(Date.now() - stats.duration * 1000).toISOString(),
        durationSeconds: stats.duration,
        totalReps: stats.totalReps,
        correctReps: stats.correctReps,
        incompleteReps: stats.incompleteReps,
        formScore: stats.formScore || 80,
        componentScores: stats.componentScores,
        reps: stats.reps,
        feedbackSummary: Array.from(stats.feedbackSummary.entries()).map(([code, count]) => ({ code, count })),
        rangeOfMotion: { primaryAngleMin: stats.rangeOfMotion.min, primaryAngleMax: stats.rangeOfMotion.max },
        source: isDemo ? 'demo' : 'camera',
        completed: true,
      }));
      navigate(`/session/${id}/summary`);
    }
  }, [state, navigate, id, exercise, stats, isDemo]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (state === 'idle' || state === 'permission') {
    return (
      <div className="min-h-screen bg-navy text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-surface-alt/10 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
          <div className="w-20 h-20 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-6 text-teal">
            <Camera size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-4">{exercise?.name || 'Exercise'} Session</h1>
          <p className="text-gray-300 mb-6 leading-relaxed text-sm">
            PhysioAI provides AI-assisted exercise-form feedback and rehabilitation tracking.
            Your camera stream is used for movement analysis and is processed locally in your browser.
          </p>

          {cameraError && (
            <div className="p-3 mb-6 bg-error/20 border border-error/40 rounded-xl text-sm text-red-200">
              {cameraError}. You can continue seamlessly using Demo Mode.
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={() => requestCamera()}
              className="w-full py-4 bg-teal text-white rounded-xl font-bold text-lg hover:bg-teal-dark transition-colors flex items-center justify-center gap-2"
            >
              <Camera size={20} /> Allow Camera & Start
            </button>
            <button 
              onClick={() => startDemo()}
              className="w-full py-4 bg-transparent border border-white/20 text-white rounded-xl font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <Play size={20} /> Continue in Demo Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-navy text-white flex flex-col overflow-hidden select-none">
      {/* Top HUD */}
      <div className="absolute top-0 inset-x-0 p-4 md:p-6 flex justify-between items-start z-20 bg-gradient-to-b from-navy/90 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <h2 className="text-xl md:text-2xl font-bold drop-shadow-md">{exercise?.name || 'Exercise'}</h2>
          <div className="flex gap-2 mt-2 items-center">
            <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg font-mono text-lg border border-white/10">
              {formatTimer(stats.duration)}
            </span>
            {isDemo && (
              <span className="px-3 py-1 bg-amber-500/90 text-white rounded-lg text-xs font-bold tracking-wider uppercase border border-amber-300">
                Demo Mode — simulated data
              </span>
            )}
            <span className="px-2.5 py-1 bg-teal/20 text-teal-light rounded-lg text-xs font-semibold">
              Phase: {currentPhase}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3 pointer-events-auto">
          <div className="text-center px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 min-w-[70px]">
            <div className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Angle</div>
            <div className="text-2xl font-bold text-teal">{Math.round(primaryAngle)}°</div>
          </div>
          <div className="text-center px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 min-w-[70px]">
            <div className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Form Score</div>
            <div className="text-2xl font-bold text-teal-light">{stats.formScore || 100}</div>
          </div>
          <div className="text-center px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 min-w-[70px]">
            <div className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Reps</div>
            <div className="text-2xl font-bold text-white">{stats.totalReps}</div>
          </div>
        </div>
      </div>

      {/* Main Video & Skeleton Area */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        <video
          ref={videoRef as any}
          playsInline
          muted
          autoPlay
          className={`w-full h-full object-cover transform -scale-x-100 ${isDemo ? 'hidden' : 'block'}`}
        />

        {isDemo && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center">
            <div className="text-navy-light/40 text-sm font-mono mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-teal" /> Synthetic Pose Stream Active
            </div>
          </div>
        )}

        <SkeletonOverlay landmarks={landmarks} />

        {/* Positioning Overlay */}
        {state === 'positioning' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/80 backdrop-blur-sm z-30">
            <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold mb-2">Positioning Check</h2>
            <p className="text-gray-300 max-w-sm text-center">
              Stand so your full body is in frame. Hold still for ~2 seconds to begin.
            </p>
          </div>
        )}

        {/* Paused Overlay */}
        {state === 'paused' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/85 backdrop-blur-md z-30">
            <h2 className="text-3xl font-bold mb-6">Session Paused</h2>
            <div className="flex gap-4">
              <button 
                onClick={resumeSession} 
                className="px-6 py-3 bg-teal rounded-xl font-bold text-lg hover:bg-teal-dark flex items-center gap-2 shadow-lg"
              >
                <Play fill="currentColor" size={20} /> Resume
              </button>
              <button 
                onClick={endSession} 
                className="px-6 py-3 bg-error rounded-xl font-bold text-lg hover:bg-red-600 flex items-center gap-2 shadow-lg"
              >
                <Square fill="currentColor" size={20} /> End Session
              </button>
            </div>
          </div>
        )}

        {/* Live Feedback Toast */}
        {state === 'active' && activeFeedback.length > 0 && (
          <div className="absolute bottom-28 inset-x-0 flex flex-col items-center gap-2 z-20 pointer-events-none" aria-live="polite">
            {activeFeedback.map((fb, idx) => (
              <div 
                key={idx}
                className={`px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2.5 max-w-md text-sm font-bold border backdrop-blur-md ${
                  fb.severity === 'warning' 
                    ? 'bg-amber-500/90 text-navy border-amber-300' 
                    : fb.severity === 'success'
                    ? 'bg-green-600/90 text-white border-green-300'
                    : 'bg-blue/90 text-white border-blue-300'
                }`}
              >
                <AlertTriangle size={18} />
                <span>{fb.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 flex justify-between items-center z-20 bg-gradient-to-t from-navy/95 to-transparent pointer-events-none">
        <div className="w-1/3 pointer-events-auto">
          <div className="flex items-center gap-2 text-warning bg-black/60 backdrop-blur-sm px-3.5 py-1.5 rounded-lg text-xs w-fit border border-white/10">
            <AlertCircle size={14} /> Stop if you feel pain or dizziness
          </div>
        </div>

        <div className="w-1/3 flex justify-center pointer-events-auto">
          {state === 'active' && (
            <button 
              onClick={pauseSession}
              className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/30 shadow-lg"
              aria-label="Pause session"
            >
              <Pause size={24} fill="currentColor" />
            </button>
          )}
        </div>

        <div className="w-1/3 flex justify-end pointer-events-auto">
          {state === 'active' && (
            <button 
              onClick={endSession}
              className="px-5 py-2.5 bg-error/90 hover:bg-error text-white font-bold rounded-xl flex items-center gap-2 transition-colors text-sm shadow-lg"
            >
              <Square fill="currentColor" size={16} /> Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
