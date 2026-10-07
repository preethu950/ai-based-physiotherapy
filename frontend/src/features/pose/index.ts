export * from './types';
export * from './geometry';
export * from './smoothing';
export * from './visibility';
export * from './repStateMachine';
export * from './formEvaluator';
export * from './feedbackEngine';
export * from './exerciseRegistry';
export * from './demoMode';

import { registerExercise } from './exerciseRegistry';
import { squatConfig } from './exercises/squat';
import { shoulderRaiseConfig } from './exercises/shoulderRaise';
import { legRaiseConfig } from './exercises/legRaise';
import { sitToStandConfig } from './exercises/sitToStand';
import { heelRaiseConfig } from './exercises/heelRaise';
import { kneeExtensionConfig } from './exercises/kneeExtension';

registerExercise(squatConfig);
registerExercise(shoulderRaiseConfig);
registerExercise(legRaiseConfig);
registerExercise(sitToStandConfig);
registerExercise(heelRaiseConfig);
registerExercise(kneeExtensionConfig);
