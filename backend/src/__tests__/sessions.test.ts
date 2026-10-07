import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import app from '../index';
import { db } from '../config/database';

describe('Sessions Endpoints', () => {
  let token1: string;
  let token2: string;
  let userId1: number;

  beforeEach(async () => {
    db.exec('DELETE FROM sessions');
    db.exec('DELETE FROM users');

    const reg1 = await request(app).post('/api/auth/register').send({
      name: 'User1', email: 'u1@example.com', password: 'password123'
    });
    token1 = reg1.body.token;
    userId1 = reg1.body.user.id;

    const reg2 = await request(app).post('/api/auth/register').send({
      name: 'User2', email: 'u2@example.com', password: 'password123'
    });
    token2 = reg2.body.token;
  });

  it('Save session -> 201', async () => {
    const payload = {
      exerciseId: 'squat',
      startedAt: new Date().toISOString(),
      durationSeconds: 100,
      totalReps: 10,
      correctReps: 8,
      incompleteReps: 2,
      formScore: 85,
      source: 'camera',
      completed: true
    };
    const res = await request(app).post('/api/sessions').set('Authorization', `Bearer ${token1}`).send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('List sessions -> returns saved sessions', async () => {
    await request(app).post('/api/sessions').set('Authorization', `Bearer ${token1}`).send({
      exerciseId: 'squat', startedAt: new Date().toISOString(), durationSeconds: 100,
      totalReps: 10, correctReps: 8, incompleteReps: 2, formScore: 85, source: 'camera', completed: true
    });
    const res = await request(app).get('/api/sessions').set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('User cannot access another users session -> 404', async () => {
    const postRes = await request(app).post('/api/sessions').set('Authorization', `Bearer ${token1}`).send({
      exerciseId: 'squat', startedAt: new Date().toISOString(), durationSeconds: 100,
      totalReps: 10, correctReps: 8, incompleteReps: 2, formScore: 85, source: 'camera', completed: true
    });
    
    const sessionId = postRes.body.id;

    const res = await request(app).get(`/api/sessions/${sessionId}`).set('Authorization', `Bearer ${token2}`);
    expect(res.status).toBe(404);
  });

  it('Progress endpoint returns correct aggregation', async () => {
    await request(app).post('/api/sessions').set('Authorization', `Bearer ${token1}`).send({
      exerciseId: 'squat', startedAt: new Date().toISOString(), durationSeconds: 100,
      totalReps: 10, correctReps: 8, incompleteReps: 2, formScore: 85, source: 'camera', completed: true
    });
    
    const res = await request(app).get('/api/progress').set('Authorization', `Bearer ${token1}`);
    expect(res.status).toBe(200);
    expect(res.body.totalSessions).toBe(1);
    expect(res.body.totalReps).toBe(10);
  });
});
