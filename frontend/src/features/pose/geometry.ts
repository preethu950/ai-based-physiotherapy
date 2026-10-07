import { Landmark } from './types';

export function calculateAngle(a: Landmark, b: Landmark, c: Landmark, aspectRatio: number = 1): number {
    const ax = a.x * aspectRatio;
    const ay = a.y;
    const bx = b.x * aspectRatio;
    const by = b.y;
    const cx = c.x * aspectRatio;
    const cy = c.y;

    const dx1 = ax - bx;
    const dy1 = ay - by;
    const dx2 = cx - bx;
    const dy2 = cy - by;

    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    if (len1 === 0 || len2 === 0) return 0;

    const dot = dx1 * dx2 + dy1 * dy2;
    const cosTheta = clamp(dot / (len1 * len2), -1, 1);
    return Math.acos(cosTheta) * (180 / Math.PI);
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export function distance2D(a: Landmark, b: Landmark): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}
