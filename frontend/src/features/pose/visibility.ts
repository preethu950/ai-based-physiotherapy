import { Landmark } from './types';

export function checkVisibility(landmarks: Landmark[], requiredIndices: number[], minVisibility: number = 0.5): { visible: boolean; missingLandmarks: number[]; message?: string; } {
    if (!landmarks || landmarks.length === 0) {
        return { visible: false, missingLandmarks: requiredIndices, message: 'No landmarks available' };
    }

    const missingLandmarks: number[] = [];
    
    for (const index of requiredIndices) {
        const landmark = landmarks[index];
        if (!landmark || landmark.visibility < minVisibility || landmark.x < 0 || landmark.x > 1 || landmark.y < 0 || landmark.y > 1) {
            missingLandmarks.push(index);
        }
    }

    if (missingLandmarks.length > 0) {
        return { visible: false, missingLandmarks, message: `Body parts missing: ${missingLandmarks.join(', ')}` };
    }

    return { visible: true, missingLandmarks: [] };
}
