import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.js';
import { ClubCategory, EventStatus, UserRole } from '@prisma/client';

const router = Router();

const createEventSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  category: z.enum(['Academic', 'Cultural', 'Sports', 'Tech', 'Arts']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  venue: z.string().optional(),
  isOnline: z.boolean().optional(),
  meetingLink: z.string().url().optional(),
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { category, month, year } = req.query;

    const where: any = {
      status: 'APPROVED',
    };

    if (category && category !== 'All') {
      where.category = category as ClubCategory;
    }

    if (month && year) {
      const startOfMonth = new Date(Number(year), Number(month) - 1, 1);
      const endOfMonth = new Date(Number(year), Number(month), 0);
      where.startDate = {
        gte: startOfMonth,
        lte: endOfMonth,
      };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        club: {
          select: { id: true, name: true },
        },
        _count: {
          select: { rsvps: true },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        club: {
          select: { id: true, name: true, logo: true },
        },
        creator: {
          select: { id: true, name: true },
        },
        rsvps: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: {
          select: { rsvps: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

router.post('/', authenticate, authorize(UserRole.CLUB_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const data = createEventSchema.parse(req.body);

    const event = await prisma.event.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        clubId: req.user!.clubId!,
        creatorId: req.user!.id,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

router.put('/:id', authenticate, authorize(UserRole.CLUB_ADMIN, UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = createEventSchema.partial().parse(req.body);

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (req.user!.role === UserRole.CLUB_ADMIN && event.clubId !== req.user!.clubId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

router.patch('/:id/status', authenticate, authorize(UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const event = await prisma.event.update({
      where: { id },
      data: { status: status as EventStatus },
    });

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update event status' });
  }
});

router.delete('/:id', authenticate, authorize(UserRole.CLUB_ADMIN, UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (req.user!.role === UserRole.CLUB_ADMIN && event.clubId !== req.user!.clubId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.event.delete({
      where: { id },
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

router.post('/:id/rsvp', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId: req.user!.id,
          eventId: id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Already RSVPed' });
    }

    const rsvp = await prisma.rSVP.create({
      data: {
        userId: req.user!.id,
        eventId: id,
      },
    });

    res.status(201).json(rsvp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to RSVP' });
  }
});

router.delete('/:id/rsvp', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.rSVP.delete({
      where: {
        userId_eventId: {
          userId: req.user!.id,
          eventId: id,
        },
      },
    });

    res.json({ message: 'RSVP cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cancel RSVP' });
  }
});

export default router;
