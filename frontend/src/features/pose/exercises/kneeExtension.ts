import { ExerciseConfig } from '../types';

export const kneeExtensionConfig: ExerciseConfig = {
    id: 'kneeExtension',
    name: 'Knee Extension',
    category: 'lower',
    description: 'Seated knee extension',
    view: 'side',
    trackedJoints: [
        { name: 'knee', landmarks: [23, 25, 27] }
    ],
    primaryAngle: 'knee',
    phases: { start: { min: 0, max: 100 }, target: { min: 160, max: 180 } },
    hysteresisDeg: 5,
    minPhaseMs: 200,
    minRepMs: 1000,
    tempo: { downMs: [1000, 2000], upMs: [1000, 2000] },
    formChecks: [],
    weights: { alignment: 20, rom: 30, stability: 20, tempo: 20, completion: 10 },
    correctRepMinScore: 80,
    requiredLandmarks: [23, 25, 27],
    instructions: [],
    commonMistakes: [],
    recommendedReps: 12
};
