import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Simple AI chat endpoint (mock) – returns a basic response based on input.
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message } = req.body as { message?: string };
    const userId = (req as any).user?.id;
    const reply = `You said: ${message ?? ''}`;
    res.json({ reply, userId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'AI chat failed' });
  } finally {
    // cleanup if needed
  }
});

export default router;
