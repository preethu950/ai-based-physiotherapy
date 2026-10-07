export interface Landmark { x: number; y: number; z: number; visibility: number; }
export interface JointAngle { name: string; angle: number; landmarks: [number, number, number]; }
export interface JointDefinition { name: string; landmarks: [number, number, number]; }
export interface PhaseConfig { min: number; max: number; }
export type RepPhase = 'READY' | 'DESCENDING' | 'BOTTOM' | 'ASCENDING';
export interface RepResult { index: number; score: number; durationMs: number; minAngle: number; maxAngle: number; componentScores: ComponentScores; issues: string[]; phase: 'complete' | 'incomplete'; }
export interface ComponentScores { alignment: number; rom: number; stability: number; tempo: number; completion: number; }
export interface FeedbackItem { code: string; severity: 'success' | 'info' | 'warning'; text: string; timestamp: number; }
export interface FormCheck { code: string; name: string; evaluate: (landmarks: Landmark[], angles: Map<string, number>, config: ExerciseConfig) => { score: number; feedback?: FeedbackItem }; }
export interface ExerciseConfig {
    id: string;
    name: string;
    category: string;
    description: string;
    view: 'side' | 'front' | 'either';
    trackedJoints: JointDefinition[];
    primaryAngle: string;
    phases: { start: PhaseConfig; target: PhaseConfig; };
    hysteresisDeg: number;
    minPhaseMs: number;
    minRepMs: number;
    tempo: { downMs: [number, number]; upMs: [number, number]; };
    formChecks: FormCheck[];
    weights: { alignment: number; rom: number; stability: number; tempo: number; completion: number; };
    correctRepMinScore: number;
    requiredLandmarks: number[];
    instructions: string[];
    commonMistakes: string[];
    recommendedReps: number;
}
export type SessionState = 'idle' | 'permission' | 'positioning' | 'active' | 'paused' | 'ended' | 'summary';
