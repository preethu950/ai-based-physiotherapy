# PhysioAI — AI-Powered Physiotherapy & Rehabilitation Assistant

> **"Move better. Recover smarter."**  
> AI-assisted physiotherapy exercise monitoring and rehabilitation progress tracking.

---

## 1. Overview

PhysioAI is a full-stack web application designed for movement analysis, exercise form evaluation, and rehabilitation tracking. It tracks posture and joint angles live in the browser using MediaPipe Pose Landmarkers, drives a finite state machine for rep counting and form evaluations, gives real-time visual feedback, and stores structured performance statistics over time.

### Core Architecture & Privacy Policy
* **Local In-Browser Processing:** All movement analysis and video processing happens entirely on your local machine in the browser. Raw video is **never** uploaded, streamed, or stored on servers. Only derived numerical performance metrics (angles, rep counts, form scores) are sent to the backend.
* **Zero Medical Diagnosis:** PhysioAI evaluates movement criteria according to heuristic application thresholds. It does not provide diagnoses or treatment prescriptions.

---

## 2. Feature List

- **Live AI Pose Tracking:** Real-time landmark calculation with aspect-ratio correction, exponential moving average (EMA) smoothing, and full-body visibility gating.
- **Rep State Machine:** Debounced phase cycle (`READY` → `DESCENDING` → `BOTTOM` → `ASCENDING` → `READY`) with hysteresis preventing double-counts, rejecting too-fast reps, and flagging incomplete repetitions.
- **Transparent Form Scoring:** Heuristic scores (0–100) aggregating Alignment (30%), Range of Motion (30%), Stability (20%), Tempo (10%), and Completion (10%).
- **Demo Mode:** Built-in synthetic kinematics generator simulating exercise trajectories and form faults so the entire pipeline can be tested without a webcam or camera permissions.
- **Exercise Library:** 6 pre-configured physiotherapy exercises (Squat, Shoulder Raise, Leg Raise, Sit-to-Stand, Heel Raise, Knee Extension) with detailed cues, common mistakes, and camera-view guidance.
- **Session Summary & Analytics:** Real-time HUD, score ring, per-rep breakdown, highlights, areas to improve, and offline queue preservation if backend connectivity drops.
- **Progress Tracking & Dashboard:** Form score over time, reps per session, weekly activity, ROM trends with 7d/30d/90d filters and a toggle for including Demo sessions.
- **Rule-Based Virtual Assistant:** Contextual exercise recommendations and focus guidance while strictly rejecting any medical diagnostic queries.

---

## 3. Technology Stack

- **Frontend:** React 18, TypeScript (strict), Vite 5, Tailwind CSS, React Router, Recharts, Lucide Icons, Vitest, Happy-DOM.
- **Backend:** Node.js, Express, TypeScript, SQLite (`better-sqlite3`), JWT Authentication (`jsonwebtoken`), Password Hashing (`bcryptjs`), Vitest, Supertest.
- **Containerization & Deployment:** Dockerfile (Frontend & Backend), `docker-compose.yml`.

---

## 4. Prerequisites

- **Node.js**: v20+
- **npm**: v10+

---

## 5. Quick Start (Development Mode)

### Step 1: Install Dependencies
```bash
# In the backend directory
cd backend
npm install

# In the frontend directory
cd ../frontend
npm install
```

### Step 2: Start Backend Server
```bash
cd backend
npm run dev
# Starts backend at http://localhost:3001
```

### Step 3: Start Frontend Dev Server
```bash
cd frontend
npm run dev
# Starts frontend at http://localhost:5173
```

Open your browser to `http://localhost:5173`.

---

## 6. Running Tests

### Backend Test Suite
```bash
cd backend
npm test
# Runs 11 integration tests covering Auth, User verification, Sessions, Ownership & Progress
```

### Frontend Test Suite
```bash
cd frontend
npm test
# Runs 18 unit tests covering Angles/Geometry, Smoothing, Visibility Gate, Rep FSM, and Form Scoring
```

### Production Build
```bash
cd frontend && npm run build
cd ../backend && npm run build
```

---

## 7. Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
|---|---|---|
| `PORT` | Server listening port | `3001` |
| `JWT_SECRET` | Secret key for JWT signing | `change-this-to-a-random-secret-in-production` |
| `JWT_EXPIRES_IN`| Token lifespan | `24h` |
| `DB_PATH` | SQLite database file location | `./data/physioai.db` |
| `CORS_ORIGIN` | Allowed client origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend REST API endpoint | `http://localhost:3001/api` |

---

## 8. How Movement Analysis Works

```
Camera Frame / Demo Stream
            ↓
MediaPipe Pose Landmarker (33 Landmarks)
            ↓
Visibility Gate (Check Required Joints & Visibility >= 0.5)
            ↓
Landmark Smoother (EMA α=0.4 Filter)
            ↓
Joint Angle Calculator (Aspect-Ratio Corrected 2D Interior Angles)
            ↓
Exercise Analyzer & Rep State Machine (Hysteresis, Debounce, Phase Transitions)
            ↓
Form Evaluator (ROM, Alignment, Stability, Tempo, Completion)
            ↓
Feedback Engine (Debounced Messages with Severity & Accessibility)
            ↓
Real-Time HUD & Canvas Skeleton Overlay
```

---

## 9. How to Add a New Exercise (Step by Step)

Adding a new exercise requires **no core engine modifications**, only declarative configuration:

1. **Create an Exercise Config File:**
   In `frontend/src/features/pose/exercises/myExercise.ts`:
   ```ts
   import { ExerciseConfig } from '../types';

   export const myExerciseConfig: ExerciseConfig = {
     id: 'my-exercise',
     name: 'My Exercise',
     category: 'Lower Body',
     description: 'Description of movement.',
     view: 'side', // 'side' | 'front' | 'either'
     trackedJoints: [
       { name: 'knee', landmarks: [23, 25, 27] }
     ],
     primaryAngle: 'knee',
     phases: {
       start: { min: 160, max: 180 },
       target: { min: 80, max: 100 }
     },
     hysteresisDeg: 5,
     minPhaseMs: 200,
     minRepMs: 1000,
     tempo: { downMs: [1000, 3000], upMs: [1000, 2000] },
     formChecks: [],
     weights: { alignment: 0.3, rom: 0.3, stability: 0.2, tempo: 0.1, completion: 0.1 },
     correctRepMinScore: 70,
     requiredLandmarks: [23, 25, 27],
     instructions: ['Stand straight', 'Descend with control'],
     commonMistakes: ['Caving knees'],
     recommendedReps: 12
   };
   ```

2. **Register the Exercise:**
   Import and register in `frontend/src/features/pose/index.ts`:
   ```ts
   import { myExerciseConfig } from './exercises/myExercise';
   registerExercise(myExerciseConfig);
   ```

3. **Add Seed Data to Backend:**
   In `backend/src/config/exercises.ts`, add the entry to the `exercises` array matching `id: 'my-exercise'`.

---

## 10. Required Medical Disclaimer

> **PhysioAI provides AI-assisted exercise-form feedback and rehabilitation tracking. It is not a medical diagnosis tool and does not replace assessment, treatment, or supervision from a qualified physiotherapist or other healthcare professional. Stop exercising and seek appropriate professional advice if an exercise causes significant pain, dizziness, or other concerning symptoms.**

---

## 11. Known Limitations

1. **2D Camera Limitations:** 2D joint angle calculations are subject to camera perspective, distance, and tilt. Correct camera placement is essential.
2. **Heuristic Software Thresholds:** Movement target thresholds are heuristic algorithmic criteria, not clinically validated diagnostic bounds.
3. **Lighting & Attire Sensitivity:** Pose detection quality depends on adequate lighting, contrasting clothing, and clear visibility of anatomical joints.
4. **Single-Subject Tracking:** The system monitors one person in frame at a time.
