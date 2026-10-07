const API_BASE = '/api';

interface ApiError {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  fieldErrors?: { field: string; message: string }[];
}

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('physioai_token', token);
    } else {
      localStorage.removeItem('physioai_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('physioai_token');
    }
    return this.token;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        timestamp: new Date().toISOString(),
        status: response.status,
        code: 'UNKNOWN_ERROR',
        message: response.statusText,
      }));
      throw error;
    }

    if (response.status === 204) return undefined as T;
    return response.json();
  }

  // Auth
  async register(data: { name: string; email: string; password: string; ageRange?: string; goal?: string }) {
    return this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<User>('/users/me');
  }

  // Exercises
  async getExercises() {
    return this.request<Exercise[]>('/exercises');
  }

  async getExercise(id: string) {
    return this.request<Exercise>(`/exercises/${id}`);
  }

  // Sessions
  async saveSession(data: SessionPayload) {
    return this.request<SavedSession>('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSessions() {
    return this.request<SavedSession[]>('/sessions');
  }

  async getSession(id: string) {
    return this.request<SavedSession>(`/sessions/${id}`);
  }

  // Progress
  async getProgress(range: string = '30d', includeDemos: boolean = false) {
    return this.request<ProgressData>(`/progress?range=${range}&includeDemos=${includeDemos}`);
  }

  // Dashboard
  async getDashboard() {
    return this.request<DashboardData>('/dashboard');
  }

  // Assistant
  async getAssistantSummary() {
    return this.request<AssistantInsight>('/assistant/summary');
  }

  async askAssistant(question: string) {
    return this.request<AssistantAnswer>('/assistant/ask', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  }
}

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  ageRange?: string;
  goal?: string;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  view: 'side' | 'front' | 'either';
  primaryAngle: string;
  instructions: string[];
  commonMistakes: string[];
  recommendedReps: number;
  hasAnalyzer: boolean;
  trackedMetrics?: string[];
}

export interface SessionPayload {
  exerciseId: string;
  startedAt: string;
  durationSeconds: number;
  totalReps: number;
  correctReps: number;
  incompleteReps: number;
  formScore: number;
  componentScores: {
    alignment: number;
    rom: number;
    stability: number;
    tempo: number;
    completion?: number;
  };
  reps: {
    index: number;
    score: number;
    durationMs: number;
    minAngle: number;
    maxAngle?: number;
    issues: string[];
  }[];
  feedbackSummary: { code: string; count: number }[];
  rangeOfMotion: { primaryAngleMin: number; primaryAngleMax: number };
  source: 'camera' | 'demo';
  completed: boolean;
}

export interface SavedSession extends SessionPayload {
  id: string;
  userId: string;
  createdAt: string;
  exerciseName?: string;
}

export interface ProgressData {
  totalSessions: number;
  totalReps: number;
  averageScore: number;
  bestScore: number;
  streak: number;
  formScoreOverTime: { date: string; score: number }[];
  repsPerSession: { date: string; reps: number }[];
  weeklyActivity: { day: string; sessions: number }[];
  romTrend: { date: string; min: number; max: number }[];
}

export interface DashboardData {
  totalSessions: number;
  totalReps: number;
  averageScore: number;
  streak: number;
  recentSessions: SavedSession[];
  recommendedExercises: Exercise[];
  formScoreChart: { date: string; score: number }[];
  weeklyActivity: { day: string; sessions: number }[];
}

export interface AssistantInsight {
  summary: string;
  focusAreas: string[];
  improvements: string[];
  encouragement: string;
}

export interface AssistantAnswer {
  answer: string;
  isRedirected?: boolean;
}

export const api = new ApiService();
export default api;
