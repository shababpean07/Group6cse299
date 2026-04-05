import { Router, Response } from 'express';
import prisma from '../config/database.js';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.get('/super-admin', authenticate, authorize(UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalClubs,
      totalUsers,
      pendingEvents,
      scheduledEvents,
      activeCycles,
    ] = await Promise.all([
      prisma.club.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.event.count({ where: { status: 'PENDING_APPROVAL' } }),
      prisma.event.count({ where: { status: 'APPROVED' } }),
      prisma.recruitmentCycle.count({ where: { status: 'OPEN' } }),
    ]);

    const recentActivities = await prisma.event.findMany({
      where: { status: { in: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED'] } },
      include: {
        club: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const clubs = await prisma.club.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
      take: 10,
    });

    res.json({
      stats: {
        totalClubs,
        totalUsers,
        pendingEvents,
        scheduledEvents,
        activeCycles,
      },
      recentActivities,
      clubs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

router.get('/club-admin', authenticate, authorize(UserRole.CLUB_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const clubId = req.user!.clubId;

    if (!clubId) {
      return res.status(400).json({ error: 'No club assigned' });
    }

    const [
      totalMembers,
      eventsThisMonth,
      pendingApplications,
      recruitmentCycles,
    ] = await Promise.all([
      prisma.clubMember.count({ where: { clubId } }),
      prisma.event.count({
        where: {
          clubId,
          startDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
          },
        },
      }),
      prisma.application.count({
        where: {
          cycle: { clubId },
          status: 'NEW',
        },
      }),
      prisma.recruitmentCycle.findFirst({
        where: { clubId, status: 'OPEN' },
        include: {
          _count: { select: { applications: true } },
        },
      }),
    ]);

    const events = await prisma.event.findMany({
      where: { clubId },
      orderBy: { startDate: 'desc' },
      take: 5,
    });

    const applications = await prisma.application.findMany({
      where: { cycle: { clubId } },
      include: {
        user: { select: { id: true, name: true, studentId: true } },
      },
      orderBy: { appliedAt: 'desc' },
      take: 5,
    });

    res.json({
      stats: {
        totalMembers,
        eventsThisMonth,
        pendingApplications,
        recruitmentCycle: recruitmentCycles,
      },
      events,
      applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
