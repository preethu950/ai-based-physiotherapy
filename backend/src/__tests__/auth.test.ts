import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import app from '../index';
import { db } from '../config/database';
import fs from 'fs';

describe('Auth Endpoints', () => {
  beforeEach(() => {
    db.exec('DELETE FROM sessions');
    db.exec('DELETE FROM users');
  });

  it('Register with valid data -> 201', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test', email: 'test@example.com', password: 'password123'
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('Register with missing fields -> 400', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test'
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('fieldErrors');
  });

  it('Register duplicate email -> 409', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test', email: 'test2@example.com', password: 'password123'
    });
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test', email: 'test2@example.com', password: 'password123'
    });
    expect(res.status).toBe(409);
  });

  it('Login with correct credentials -> 200 + JWT', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test', email: 'test3@example.com', password: 'password123'
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'test3@example.com', password: 'password123'
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('Login with wrong password -> 401', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test', email: 'test4@example.com', password: 'password123'
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'test4@example.com', password: 'wrong'
    });
    expect(res.status).toBe(401);
  });

  it('Access /users/me without token -> 401', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('Access /users/me with valid token -> 200', async () => {
    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Test', email: 'test5@example.com', password: 'password123'
    });
    const token = regRes.body.token;
    const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
