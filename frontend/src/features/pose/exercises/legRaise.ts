import { ExerciseConfig } from '../types';

export const legRaiseConfig: ExerciseConfig = {
    id: 'legRaise',
    name: 'Leg Raise',
    category: 'core',
    description: 'Lying leg raise',
    view: 'side',
    trackedJoints: [
        { name: 'hip', landmarks: [11, 23, 25] } // shoulder-hip-knee
    ],
    primaryAngle: 'hip',
    phases: { start: { min: 170, max: 180 }, target: { min: 0, max: 140 } },
    hysteresisDeg: 5,
    minPhaseMs: 200,
    minRepMs: 1000,
    tempo: { downMs: [1000, 3000], upMs: [1000, 2000] },
    formChecks: [],
    weights: { alignment: 20, rom: 30, stability: 20, tempo: 20, completion: 10 },
    correctRepMinScore: 80,
    requiredLandmarks: [11, 23, 25],
    instructions: [],
    commonMistakes: [],
    recommendedReps: 10
};
