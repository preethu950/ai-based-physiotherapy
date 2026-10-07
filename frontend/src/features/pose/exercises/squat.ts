import { ExerciseConfig } from '../types';

export const squatConfig: ExerciseConfig = {
    id: 'squat',
    name: 'Squat',
    category: 'lower',
    description: 'Bodyweight squat',
    view: 'side',
    trackedJoints: [
        { name: 'knee', landmarks: [23, 25, 27] }
    ],
    primaryAngle: 'knee',
    phases: { start: { min: 160, max: 180 }, target: { min: 0, max: 100 } },
    hysteresisDeg: 5,
    minPhaseMs: 200,
    minRepMs: 1000,
    tempo: { downMs: [1000, 3000], upMs: [1000, 2000] },
    formChecks: [],
    weights: { alignment: 20, rom: 30, stability: 20, tempo: 20, completion: 10 },
    correctRepMinScore: 80,
    requiredLandmarks: [11, 23, 25, 27, 31],
    instructions: [],
    commonMistakes: [],
    recommendedReps: 10
};
