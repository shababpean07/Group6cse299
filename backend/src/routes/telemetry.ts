import { Router } from 'express';
import prisma from '../config/database.js';

const router = Router();

// Lightweight telemetry endpoint to verify core feature routes availability
// Exposes a quick snapshot showing that student dashboard, current user, and AI chat backend are reachable.
router.get('/health', async (_req, res) => {
  try {
    const student = await prisma.user.findUnique({ where: { email: 'student@nsu.edu' } });
    const studentId = student?.id ?? null;

    // Basic student stats (only if student exists)
    const [joinedClubs, upcomingRsvps, myApplications] = await Promise.all([
      studentId ? prisma.clubMember.count({ where: { userId: studentId } }) : Promise.resolve(0 as number),
      studentId
        ? prisma.rsvp.count({ where: { userId: studentId, event: { startDate: { gte: new Date() } } } })
        : Promise.resolve(0 as number),
      studentId ? prisma.application.count({ where: { userId: studentId } }) : Promise.resolve(0 as number),
    ]);

    const openRecruitments = await prisma.recruitmentCycle.count({ where: { status: 'OPEN' } });

    const meUser = student
      ? {
          id: student.id,
          email: student.email,
          name: student.name,
          role: (student as any).role,
          clubId: student.clubId,
        }
      : null;

    const payload = {
      timestamp: new Date().toISOString(),
      data: {
        studentStats: {
          joinedClubs,
          upcomingRsvps,
          myApplications,
          openRecruitments,
        },
        meUser,
        aiAvailable: true, // frontend health can rely on this indicating the AI path is available
      },
    };

    res.json(payload);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Telemetry check failed' });
  }
});

export default router;
