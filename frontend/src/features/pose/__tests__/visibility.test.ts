import { describe, it, expect } from 'vitest';
import { checkVisibility } from '../visibility';

describe('visibility', () => {
    it('returns visible when all required landmarks have high visibility', () => {
        const landmarks = Array(33).fill({ x: 0.5, y: 0.5, z: 0, visibility: 0.9 });
        const result = checkVisibility(landmarks, [0, 1, 2]);
        expect(result.visible).toBe(true);
    });

    it('returns not visible when a required landmark has low visibility', () => {
        const landmarks = Array(33).fill({ x: 0.5, y: 0.5, z: 0, visibility: 0.9 });
        landmarks[1] = { x: 0.5, y: 0.5, z: 0, visibility: 0.1 };
        
        const result = checkVisibility(landmarks, [0, 1, 2]);
        expect(result.visible).toBe(false);
        expect(result.missingLandmarks).toContain(1);
    });

    it('returns not visible when out of bounds', () => {
        const landmarks = Array(33).fill({ x: 0.5, y: 0.5, z: 0, visibility: 0.9 });
        landmarks[1] = { x: 1.5, y: 0.5, z: 0, visibility: 0.9 };
        
        const result = checkVisibility(landmarks, [0, 1, 2]);
        expect(result.visible).toBe(false);
        expect(result.missingLandmarks).toContain(1);
    });
});
