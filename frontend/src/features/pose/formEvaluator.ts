import { ComponentScores, ExerciseConfig } from './types';
import { clamp } from './geometry';

export function evaluateROM(startAngle: number, reachedAngle: number, targetAngle: number, config: ExerciseConfig): number {
    const isDecreasing = config.phases.target.max < config.phases.start.min;
    
    let totalROM = Math.abs(startAngle - targetAngle);
    if (totalROM === 0) totalROM = 1;
    
    let achievedROM = Math.abs(startAngle - reachedAngle);
    
    if (isDecreasing && reachedAngle < targetAngle) achievedROM = totalROM;
    if (!isDecreasing && reachedAngle > targetAngle) achievedROM = totalROM;
    
    const ratio = achievedROM / totalROM;
    return clamp(ratio * 100, 0, 100);
}

export function evaluateTempo(durationMs: number, phaseMs: { down: number; up: number }, _config?: ExerciseConfig): number {
    const targetTotal = phaseMs.down + phaseMs.up;
    if (targetTotal === 0) return 100;
    const diff = Math.abs(durationMs - targetTotal);
    const tolerance = targetTotal * 0.5;
    const penalty = (diff / tolerance) * 50;
    return clamp(100 - penalty, 0, 100);
}

export function evaluateCompletion(reachedTarget: boolean, returnedToStart: boolean): number {
    if (reachedTarget && returnedToStart) return 100;
    if (reachedTarget || returnedToStart) return 50;
    return 0;
}

export function calculateRepScore(componentScores: ComponentScores, weights: ExerciseConfig['weights']): number {
    const score = (
        componentScores.alignment * weights.alignment +
        componentScores.rom * weights.rom +
        componentScores.stability * weights.stability +
        componentScores.tempo * weights.tempo +
        componentScores.completion * weights.completion
    );
    return Math.round(score);
}
