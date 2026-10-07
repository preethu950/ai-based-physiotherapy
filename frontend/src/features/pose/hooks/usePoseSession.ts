/**
 * usePoseSession — React hook connecting the pose analysis pipeline to the UI.
 * Manages the session state machine, camera access, and pose detection lifecycle.
 */
import { useState, useRef, useCallback, useEffect } from 'react';

// Import pose engine types - these will be created by the pose engine builder
import type {
  Landmark,
  ExerciseConfig,
  RepResult,
  FeedbackItem,
  ComponentScores,
  SessionState,
} from '../types';
import { RepStateMachine } from '../repStateMachine';
import { FeedbackEngine } from '../feedbackEngine';
import { AngleSmoother } from '../smoothing';
import { checkVisibility } from '../visibility';
import { calculateAngle } from '../geometry';
import { getExercise } from '../exerciseRegistry';
import { DemoLandmarkGenerator } from '../demoMode';

export interface SessionStats {
  totalReps: number;
  correctReps: number;
  needsImprovement: number;
  incompleteReps: number;
  formScore: number;
  componentScores: ComponentScores;
  duration: number;
  reps: RepResult[];
  feedbackSummary: Map<string, number>;
  rangeOfMotion: { min: number; max: number };
}

export interface PoseSessionResult {
  state: SessionState;
  stats: SessionStats;
  currentPhase: string;
  primaryAngle: number;
  activeFeedback: FeedbackItem[];
  isDemo: boolean;
  landmarks: Landmark[] | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;

  // Actions
  requestCamera: () => Promise<void>;
  startDemo: () => void;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  resetSession: () => void;
  cameraError: string | null;
}

export function usePoseSession(exerciseId: string): PoseSessionResult {
  const [state, setState] = useState<SessionState>('idle');
  const [isDemo, setIsDemo] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('READY');
  const [primaryAngle, setPrimaryAngle] = useState(0);
  const [activeFeedback, setActiveFeedback] = useState<FeedbackItem[]>([]);
  const [landmarks, setLandmarks] = useState<Landmark[] | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stats, setStats] = useState<SessionStats>({
    totalReps: 0,
    correctReps: 0,
    needsImprovement: 0,
    incompleteReps: 0,
    formScore: 0,
    componentScores: { alignment: 0, rom: 0, stability: 0, tempo: 0, completion: 0 },
    duration: 0,
    reps: [],
    feedbackSummary: new Map(),
    rangeOfMotion: { min: 180, max: 0 },
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const configRef = useRef<ExerciseConfig | null>(null);
  const repMachineRef = useRef<RepStateMachine | null>(null);
  const feedbackEngineRef = useRef<FeedbackEngine | null>(null);
  const smootherRef = useRef<AngleSmoother | null>(null);
  const demoGenRef = useRef<DemoLandmarkGenerator | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const positioningStartRef = useRef<number>(0);
  const lastUiUpdateRef = useRef<number>(0);
  const processingRef = useRef(false);

  // Initialize exercise config
  useEffect(() => {
    const config = getExercise(exerciseId);
    if (config) {
      configRef.current = config;
      repMachineRef.current = new RepStateMachine(config);
      feedbackEngineRef.current = new FeedbackEngine();
      smootherRef.current = new AngleSmoother();
    }
  }, [exerciseId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      cancelAnimationFrame(animFrameRef.current);
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const requestCamera = useCallback(async () => {
    setState('permission');
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsDemo(false);
      setState('positioning');
      positioningStartRef.current = Date.now();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Camera access denied';
      setCameraError(errMsg);
      setState('idle');
    }
  }, []);

  const startDemo = useCallback(() => {
    setIsDemo(true);
    demoGenRef.current = new DemoLandmarkGenerator();
    setState('positioning');
    positioningStartRef.current = Date.now();
    // Auto-advance from positioning after 2s in demo mode
    setTimeout(() => {
      setState(prev => prev === 'positioning' ? 'active' : prev);
    }, 2000);
  }, []);

  const processFrame = useCallback((timestamp: number) => {
    if (processingRef.current) return;
    const config = configRef.current;
    const repMachine = repMachineRef.current;
    const feedbackEngine = feedbackEngineRef.current;
    const smoother = smootherRef.current;

    if (!config || !repMachine || !feedbackEngine || !smoother) return;

    processingRef.current = true;

    let currentLandmarks: Landmark[] | null = null;

    if (isDemo && demoGenRef.current) {
      currentLandmarks = demoGenRef.current.generateFrame(exerciseId, timestamp);
    }
    // In camera mode, landmarks would come from MediaPipe PoseLandmarker
    // For now, we handle this via the demo generator
    // Real implementation would use PoseLandmarker here

    if (currentLandmarks) {
      // Check visibility
      const visCheck = checkVisibility(currentLandmarks, config.requiredLandmarks);
      if (!visCheck.visible) {
        if (feedbackEngine) {
          feedbackEngine.addFeedback({
            code: 'VISIBILITY',
            severity: 'warning',
            text: visCheck.message || 'Some landmarks not visible',
            timestamp,
          });
        }
        processingRef.current = false;
        return;
      }

      // Calculate angles
      const angles = new Map<string, number>();
      const aspectRatio = videoRef.current 
        ? videoRef.current.videoWidth / videoRef.current.videoHeight 
        : 16 / 9;

      for (const joint of config.trackedJoints) {
        const [a, b, c] = joint.landmarks;
        const rawAngle = calculateAngle(
          currentLandmarks[a],
          currentLandmarks[b],
          currentLandmarks[c],
          aspectRatio
        );
        const smoothed = smoother.smooth(joint.name, rawAngle);
        angles.set(joint.name, smoothed);
      }

      // Update rep state machine
      const pAngle = angles.get(config.primaryAngle) ?? 0;
      const update = repMachine.update(pAngle, angles, currentLandmarks, timestamp);

      // Run form checks for live feedback
      for (const check of config.formChecks) {
        const result = check.evaluate(currentLandmarks, angles, config);
        if (result.feedback) {
          feedbackEngine.addFeedback(result.feedback);
        }
      }

      // Update landmarks for skeleton drawing
      setLandmarks(currentLandmarks);

      // Throttle React state updates to ~10Hz
      const now = Date.now();
      if (now - lastUiUpdateRef.current > 100) {
        lastUiUpdateRef.current = now;
        setPrimaryAngle(pAngle);
        setCurrentPhase(update.currentPhase);
        setActiveFeedback(feedbackEngine.getActiveFeedback());

        const machineStats = repMachine.getStats();
        setStats(prev => {
          const newReps = update.repCompleted && update.repResult
            ? [...prev.reps, update.repResult]
            : prev.reps;

          const feedSummary = new Map(prev.feedbackSummary);
          if (update.repResult?.issues) {
            for (const issue of update.repResult.issues) {
              feedSummary.set(issue, (feedSummary.get(issue) || 0) + 1);
            }
          }

          const avgScore = newReps.length > 0
            ? Math.round(newReps.reduce((a, r) => a + r.score, 0) / newReps.length)
            : 0;

          const avgComponents: ComponentScores = newReps.length > 0
            ? {
                alignment: Math.round(newReps.reduce((a, r) => a + r.componentScores.alignment, 0) / newReps.length),
                rom: Math.round(newReps.reduce((a, r) => a + r.componentScores.rom, 0) / newReps.length),
                stability: Math.round(newReps.reduce((a, r) => a + r.componentScores.stability, 0) / newReps.length),
                tempo: Math.round(newReps.reduce((a, r) => a + r.componentScores.tempo, 0) / newReps.length),
                completion: Math.round(newReps.reduce((a, r) => a + r.componentScores.completion, 0) / newReps.length),
              }
            : prev.componentScores;

          return {
            ...prev,
            totalReps: machineStats.total,
            correctReps: machineStats.correct,
            needsImprovement: machineStats.needsImprovement,
            incompleteReps: machineStats.incomplete,
            formScore: avgScore,
            componentScores: avgComponents,
            reps: newReps,
            feedbackSummary: feedSummary,
            rangeOfMotion: {
              min: Math.min(prev.rangeOfMotion.min, pAngle),
              max: Math.max(prev.rangeOfMotion.max, pAngle),
            },
          };
        });
      }
    }

    processingRef.current = false;
  }, [isDemo, exerciseId]);

  const startSession = useCallback(() => {
    setState('active');
    startTimeRef.current = Date.now();

    // Duration timer
    durationTimerRef.current = setInterval(() => {
      setStats(prev => ({
        ...prev,
        duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
      }));
    }, 1000);

    // Start frame loop
    const loop = (ts: number) => {
      processFrame(ts);
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
  }, [processFrame]);

  const pauseSession = useCallback(() => {
    setState('paused');
    cancelAnimationFrame(animFrameRef.current);
    if (durationTimerRef.current) clearInterval(durationTimerRef.current);
  }, []);

  const resumeSession = useCallback(() => {
    setState('active');
    durationTimerRef.current = setInterval(() => {
      setStats(prev => ({
        ...prev,
        duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
      }));
    }, 1000);

    const loop = (ts: number) => {
      processFrame(ts);
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
  }, [processFrame]);

  const endSession = useCallback(() => {
    setState('ended');
    cancelAnimationFrame(animFrameRef.current);
    if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    stopCamera();
    // Transition to summary
    setState('summary');
  }, [stopCamera]);

  const resetSession = useCallback(() => {
    setState('idle');
    setIsDemo(false);
    setCurrentPhase('READY');
    setPrimaryAngle(0);
    setActiveFeedback([]);
    setLandmarks(null);
    setCameraError(null);
    setStats({
      totalReps: 0,
      correctReps: 0,
      needsImprovement: 0,
      incompleteReps: 0,
      formScore: 0,
      componentScores: { alignment: 0, rom: 0, stability: 0, tempo: 0, completion: 0 },
      duration: 0,
      reps: [],
      feedbackSummary: new Map(),
      rangeOfMotion: { min: 180, max: 0 },
    });
    repMachineRef.current?.reset();
    feedbackEngineRef.current?.clear();
    smootherRef.current?.reset();
    stopCamera();
  }, [stopCamera]);

  return {
    state,
    stats,
    currentPhase,
    primaryAngle,
    activeFeedback,
    isDemo,
    landmarks,
    videoRef,
    canvasRef,
    requestCamera,
    startDemo,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    resetSession,
    cameraError,
  };
}
