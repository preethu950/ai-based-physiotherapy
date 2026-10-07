import { ExerciseConfig } from '../types';

export const shoulderRaiseConfig: ExerciseConfig = {
    id: 'shoulderRaise',
    name: 'Shoulder Raise',
    category: 'upper',
    description: 'Lateral shoulder raise',
    view: 'front',
    trackedJoints: [
        { name: 'shoulder', landmarks: [23, 11, 13] } // hip-shoulder-elbow
    ],
    primaryAngle: 'shoulder',
    phases: { start: { min: 0, max: 30 }, target: { min: 80, max: 100 } },
    hysteresisDeg: 5,
    minPhaseMs: 200,
    minRepMs: 1000,
    tempo: { downMs: [1000, 2000], upMs: [1000, 2000] },
    formChecks: [],
    weights: { alignment: 20, rom: 30, stability: 20, tempo: 20, completion: 10 },
    correctRepMinScore: 80,
    requiredLandmarks: [11, 13, 23],
    instructions: [],
    commonMistakes: [],
    recommendedReps: 10
};
