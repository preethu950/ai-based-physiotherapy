import React, { useEffect, useRef } from 'react';
import { Landmark } from '../features/pose/types';

interface SkeletonOverlayProps {
  landmarks: Landmark[] | null;
  width?: number;
  height?: number;
}

// MediaPipe Pose connections
const POSE_CONNECTIONS: [number, number][] = [
  // Face
  [0, 1], [1, 2], [2, 3], [3, 7],
  [0, 4], [4, 5], [5, 6], [6, 8],
  [9, 10],
  // Torso
  [11, 12], [11, 23], [12, 24], [23, 24],
  // Arms
  [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
  // Legs
  [23, 25], [25, 27], [27, 29], [27, 31], [29, 31],
  [24, 26], [26, 28], [28, 30], [28, 32], [30, 32],
];

export const SkeletonOverlay: React.FC<SkeletonOverlayProps> = ({
  landmarks,
  width = 640,
  height = 480,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!landmarks || landmarks.length === 0) return;

    // Draw bones / connections
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#14B8A6'; // teal accent

    for (const [i, j] of POSE_CONNECTIONS) {
      const a = landmarks[i];
      const b = landmarks[j];
      if (!a || !b) continue;
      if (a.visibility < 0.4 || b.visibility < 0.4) continue;

      ctx.beginPath();
      ctx.moveTo(a.x * canvas.width, a.y * canvas.height);
      ctx.lineTo(b.x * canvas.width, b.y * canvas.height);
      ctx.stroke();
    }

    // Draw joints
    for (const lm of landmarks) {
      if (!lm || lm.visibility < 0.4) continue;

      ctx.beginPath();
      ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0B1F3A';
      ctx.stroke();
    }
  }, [landmarks, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
    />
  );
};
