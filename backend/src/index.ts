import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './config/database';
import { handleErrors } from './config/errorHandler';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import exerciseRoutes from './routes/exercises';
import sessionRoutes from './routes/sessions';
import progressRoutes from './routes/progress';
import dashboardRoutes from './routes/dashboard';
import assistantRoutes from './routes/assistant';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

initDb();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assistant', assistantRoutes);

app.use(handleErrors);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
