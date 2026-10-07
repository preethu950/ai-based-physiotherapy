import { describe, it, expect } from 'vitest';
import { calculateAngle, clamp } from '../geometry';

describe('geometry', () => {
    it('calculates 90 degree angle correctly', () => {
        const a = { x: 0, y: 1, z: 0, visibility: 1 };
        const b = { x: 0, y: 0, z: 0, visibility: 1 };
        const c = { x: 1, y: 0, z: 0, visibility: 1 };
        const angle = calculateAngle(a, b, c);
        expect(angle).toBeCloseTo(90, 1);
    });

    it('calculates 180 degree angle correctly', () => {
        const a = { x: -1, y: 0, z: 0, visibility: 1 };
        const b = { x: 0, y: 0, z: 0, visibility: 1 };
        const c = { x: 1, y: 0, z: 0, visibility: 1 };
        const angle = calculateAngle(a, b, c);
        expect(angle).toBeCloseTo(180, 1);
    });

    it('handles zero-length vectors by returning 0', () => {
        const a = { x: 0, y: 0, z: 0, visibility: 1 };
        const b = { x: 0, y: 0, z: 0, visibility: 1 };
        const c = { x: 1, y: 0, z: 0, visibility: 1 };
        const angle = calculateAngle(a, b, c);
        expect(angle).toBe(0);
    });

    it('clamps values correctly', () => {
        expect(clamp(5, 0, 10)).toBe(5);
        expect(clamp(-5, 0, 10)).toBe(0);
        expect(clamp(15, 0, 10)).toBe(10);
    });
});
