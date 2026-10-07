import { describe, it, expect, beforeEach } from 'vitest';
import { AngleSmoother } from '../smoothing';

describe('AngleSmoother', () => {
    let smoother: AngleSmoother;

    beforeEach(() => {
        smoother = new AngleSmoother();
    });

    it('initializes with first value', () => {
        expect(smoother.smooth('test', 100)).toBe(100);
    });

    it('smooths subsequent values', () => {
        smoother.smooth('test', 100, 0.5);
        expect(smoother.smooth('test', 200, 0.5)).toBe(150);
    });
});
