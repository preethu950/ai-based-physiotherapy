import { ExerciseConfig } from './types';

const exerciseRegistry = new Map<string, ExerciseConfig>();

export function registerExercise(config: ExerciseConfig): void {
    exerciseRegistry.set(config.id, config);
}

export function getExercise(id: string): ExerciseConfig | undefined {
    return exerciseRegistry.get(id);
}

export function getAllExercises(): ExerciseConfig[] {
    return Array.from(exerciseRegistry.values());
}

export function hasAnalyzer(id: string): boolean {
    return exerciseRegistry.has(id);
}

export { exerciseRegistry };
