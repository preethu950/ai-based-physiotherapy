import { describe, it, expect } from 'vitest';
import { evaluateROM, evaluateTempo, evaluateCompletion } from '../formEvaluator';
import { squatConfig } from '../exercises/squat';

describe('formEvaluator', () => {
    it('evaluates ROM correctly', () => {
        const score = evaluateROM(170, 50, 50, squatConfig);
        expect(score).toBe(100);
        
        const score2 = evaluateROM(170, 110, 50, squatConfig);
        expect(score2).toBe(50);
    });

    it('evaluates tempo correctly', () => {
        const score = evaluateTempo(3000, { down: 2000, up: 1000 }, squatConfig);
        expect(score).toBe(100);
    });

    it('evaluates completion correctly', () => {
        expect(evaluateCompletion(true, true)).toBe(100);
        expect(evaluateCompletion(true, false)).toBe(50);
        expect(evaluateCompletion(false, false)).toBe(0);
    });
});
