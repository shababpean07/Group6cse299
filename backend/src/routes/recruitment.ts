import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.js';
import { ApplicationStatus, RecruitmentStatus, UserRole } from '@prisma/client';

const router = Router();

const createCycleSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  maxSlots: z.number().int().positive().optional(),
});

const createApplicationSchema = z.object({
  position: z.string().min(2),
  resumeUrl: z.string().url().optional(),
  coverLetter: z.string().optional(),
});

router.get('/cycles', async (req: AuthRequest, res: Response) => {
  try {
    const { clubId, status } = req.query;

    const where: any = {};
    if (clubId) where.clubId = String(clubId);
    if (status) where.status = status as RecruitmentStatus;

    const cycles = await prisma.recruitmentCycle.findMany({
      where,
      include: {
        club: {
          select: { id: true, name: true },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(cycles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recruitment cycles' });
  }
});

router.get('/cycles/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const cycle = await prisma.recruitmentCycle.findUnique({
      where: { id },
      include: {
        club: {
          select: { id: true, name: true, logo: true },
        },
        applications: {
          include: {
            user: {
              select: { id: true, name: true, email: true, studentId: true },
            },
          },
          orderBy: { appliedAt: 'desc' },
        },
      },
    });

    if (!cycle) {
      return res.status(404).json({ error: 'Recruitment cycle not found' });
    }

    res.json(cycle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recruitment cycle' });
  }
});

router.post('/cycles', authenticate, authorize(UserRole.CLUB_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const data = createCycleSchema.parse(req.body);

    const cycle = await prisma.recruitmentCycle.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        clubId: req.user!.clubId!,
      },
    });

    res.status(201).json(cycle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create recruitment cycle' });
  }
});

router.patch('/cycles/:id/status', authenticate, authorize(UserRole.CLUB_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['OPEN', 'CLOSED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const cycle = await prisma.recruitmentCycle.findUnique({
      where: { id },
    });

    if (!cycle) {
      return res.status(404).json({ error: 'Recruitment cycle not found' });
    }

    if (cycle.clubId !== req.user!.clubId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.recruitmentCycle.update({
      where: { id },
      data: { status: status as RecruitmentStatus },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update recruitment cycle status' });
  }
});

router.post('/apply/:cycleId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { cycleId } = req.params;
    const data = createApplicationSchema.parse(req.body);

    const cycle = await prisma.recruitmentCycle.findUnique({
      where: { id: cycleId },
    });

    if (!cycle || cycle.status !== 'OPEN') {
      return res.status(400).json({ error: 'Recruitment is not open' });
    }

    const existing = await prisma.application.findUnique({
      where: {
        userId_cycleId_position: {
          userId: req.user!.id,
          cycleId,
          position: data.position,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Already applied for this position' });
    }

    const application = await prisma.application.create({
      data: {
        ...data,
        userId: req.user!.id,
        cycleId,
      },
    });

    res.status(201).json(application);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

router.patch('/applications/:id/status', authenticate, authorize(UserRole.CLUB_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['NEW', 'INTERVIEW', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: { cycle: true },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.cycle.clubId !== req.user!.clubId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status: status as ApplicationStatus },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

router.get('/my-applications', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user!.id },
      include: {
        cycle: {
          include: {
            club: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

export default router;
