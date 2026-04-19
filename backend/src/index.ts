import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import clubRoutes from './routes/clubs.js';
import eventRoutes from './routes/events.js';
import recruitmentRoutes from './routes/recruitment.js';
import announcementRoutes from './routes/announcements.js';
import userRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';
import aiRoutes from './routes/ai.js';
import telemetryRoutes from './routes/telemetry.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: allow only whitelisted origins; fallback to reject others
const ALLOWED_ORIGINS = (process.env.CORS_WHITELIST || 'http://localhost:3000').split(',').map((o) => o.trim());
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
} as const;

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Basic rate limiting to mitigate abuse
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/ai', aiRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
