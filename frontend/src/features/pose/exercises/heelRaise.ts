import { ExerciseConfig } from '../types';

export const heelRaiseConfig: ExerciseConfig = {
    id: 'heelRaise',
    name: 'Heel Raise',
    category: 'lower',
    description: 'Calf raises',
    view: 'either',
    trackedJoints: [
        { name: 'ankle', landmarks: [27, 31, 29] } // pseudo angle for ankle delta
    ],
    primaryAngle: 'ankle',
    phases: { start: { min: 80, max: 100 }, target: { min: 130, max: 180 } },
    hysteresisDeg: 5,
    minPhaseMs: 100,
    minRepMs: 500,
    tempo: { downMs: [500, 1500], upMs: [500, 1500] },
    formChecks: [],
    weights: { alignment: 20, rom: 30, stability: 20, tempo: 20, completion: 10 },
    correctRepMinScore: 80,
    requiredLandmarks: [27, 31],
    instructions: [],
    commonMistakes: [],
    recommendedReps: 15
};
