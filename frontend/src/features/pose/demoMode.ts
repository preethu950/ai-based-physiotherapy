import { Landmark } from './types';

export class DemoLandmarkGenerator {
    generateFrame(exerciseId: string, timeMs: number): Landmark[] {
        // Return 33 dummy landmarks
        const landmarks: Landmark[] = Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, z: 0, visibility: 0.9 }));
        
        // Simple synthetic motion depending on exercise
        const cycle = (timeMs % 4000) / 4000; // 4s per rep
        const sinWave = Math.sin(cycle * Math.PI * 2);
        
        if (exerciseId === 'squat') {
            // knee angle varies from 180 to 90
            const yOffset = 0.2 * (1 - Math.cos(cycle * Math.PI * 2));
            landmarks[11] = { x: 0.5, y: 0.2 + yOffset, z: 0, visibility: 1.0 };
            landmarks[23] = { x: 0.5, y: 0.5 + yOffset, z: 0, visibility: 1.0 };
            landmarks[25] = { x: 0.5 + 0.1 * sinWave, y: 0.7, z: 0, visibility: 1.0 };
            landmarks[27] = { x: 0.5, y: 0.9, z: 0, visibility: 1.0 };
            landmarks[31] = { x: 0.52, y: 0.95, z: 0, visibility: 1.0 };
        } else if (exerciseId === 'shoulderRaise') {
            const angle = 20 + 70 * (1 - Math.cos(cycle * Math.PI * 2)); // 20 to 160 deg
            const rad = angle * Math.PI / 180;
            landmarks[11] = { x: 0.4, y: 0.3, z: 0, visibility: 1.0 }; // left shoulder
            landmarks[23] = { x: 0.4, y: 0.6, z: 0, visibility: 1.0 }; // left hip
            landmarks[13] = { x: 0.4 - 0.2 * Math.sin(rad), y: 0.3 + 0.2 * Math.cos(rad), z: 0, visibility: 1.0 }; // elbow
        } else if (exerciseId === 'legRaise') {
            const angle = 180 - 60 * (1 - Math.cos(cycle * Math.PI * 2));
            landmarks[11] = { x: 0.2, y: 0.8, z: 0, visibility: 1.0 }; // shoulder
            landmarks[23] = { x: 0.5, y: 0.8, z: 0, visibility: 1.0 }; // hip
            const rad = angle * Math.PI / 180;
            landmarks[25] = { x: 0.5 + 0.3 * Math.cos(rad), y: 0.8 - 0.3 * Math.sin(rad), z: 0, visibility: 1.0 }; // knee
        } else if (exerciseId === 'sitToStand') {
            const angle = 90 + 90 * (1 - Math.cos(cycle * Math.PI * 2))/2; 
            const rad = angle * Math.PI / 180;
            landmarks[23] = { x: 0.5, y: 0.6, z: 0, visibility: 1.0 };
            landmarks[25] = { x: 0.5 + 0.1 * Math.cos(rad), y: 0.6 + 0.1 * Math.sin(rad), z: 0, visibility: 1.0 };
            landmarks[27] = { x: 0.6, y: 0.8, z: 0, visibility: 1.0 };
        } else if (exerciseId === 'kneeExtension') {
             landmarks[23] = { x: 0.5, y: 0.5, z: 0, visibility: 1.0 };
             landmarks[25] = { x: 0.7, y: 0.5, z: 0, visibility: 1.0 };
             landmarks[27] = { x: 0.7, y: 0.8, z: 0, visibility: 1.0 };
        } else if (exerciseId === 'heelRaise') {
             landmarks[27] = { x: 0.5, y: 0.8, z: 0, visibility: 1.0 };
             landmarks[31] = { x: 0.5, y: 0.9, z: 0, visibility: 1.0 };
        }

        return landmarks;
    }
}
