import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.js';
import { AnnouncementStatus, UserRole } from '@prisma/client';

const router = Router();

const createAnnouncementSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(10),
  status: z.enum(['DRAFT', 'LIVE']).optional(),
  clubId: z.string().optional(),
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { clubId, status } = req.query;

    const where: any = {
      OR: [
        { clubId: null },
        { status: 'LIVE' },
      ],
    };

    if (clubId) where.clubId = String(clubId);
    if (status) {
      delete where.OR;
      where.status = status;
    }

    const announcements = await prisma.announcement.findMany({
      where,
      include: {
        club: {
          select: { id: true, name: true },
        },
        author: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        club: {
          select: { id: true, name: true, logo: true },
        },
        author: {
          select: { id: true, name: true },
        },
      },
    });

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch announcement' });
  }
});

router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.CLUB_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const data = createAnnouncementSchema.parse(req.body);

    const announcement = await prisma.announcement.create({
      data: {
        ...data,
        authorId: req.user!.id,
        clubId: data.clubId || req.user!.clubId || null,
      },
    });

    res.status(201).json(announcement);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

router.patch('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.CLUB_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = createAnnouncementSchema.partial().parse(req.body);

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    if (req.user!.role === UserRole.CLUB_ADMIN && announcement.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.announcement.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.CLUB_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    if (req.user!.role === UserRole.CLUB_ADMIN && announcement.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.announcement.delete({
      where: { id },
    });

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

export default router;
