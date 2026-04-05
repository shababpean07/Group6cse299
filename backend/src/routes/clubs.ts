import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.js';
import { ClubCategory, UserRole } from '@prisma/client';

const router = Router();

const createClubSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  category: z.enum(['Academic', 'Cultural', 'Sports', 'Tech', 'Arts']),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  established: z.string().optional(),
  email: z.string().email().optional(),
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { category, search } = req.query;

    const where: any = {};
    
    if (category && category !== 'All') {
      where.category = category as ClubCategory;
    }

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const clubs = await prisma.club.findMany({
      where,
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json(clubs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch clubs' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const club = await prisma.club.findUnique({
      where: { id },
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, studentId: true },
            },
          },
        },
        events: {
          where: { status: 'APPROVED' },
          orderBy: { startDate: 'desc' },
          take: 10,
        },
        recruitmentCycles: {
          where: { status: 'OPEN' },
          take: 1,
        },
        _count: {
          select: { members: true, events: true },
        },
      },
    });

    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    res.json(club);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch club' });
  }
});

router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const data = createClubSchema.parse(req.body);

    const existingClub = await prisma.club.findUnique({
      where: { name: data.name },
    });

    if (existingClub) {
      return res.status(400).json({ error: 'Club name already exists' });
    }

    const club = await prisma.club.create({
      data: {
        ...data,
        established: data.established ? new Date(data.established) : undefined,
      },
    });

    res.status(201).json(club);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create club' });
  }
});

router.put('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.CLUB_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = createClubSchema.partial().parse(req.body);

    if (req.user!.role === UserRole.CLUB_ADMIN && req.user!.clubId !== id) {
      return res.status(403).json({ error: 'Not authorized to update this club' });
    }

    const club = await prisma.club.update({
      where: { id },
      data: {
        ...data,
        established: data.established ? new Date(data.established) : undefined,
      },
    });

    res.json(club);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to update club' });
  }
});

router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.club.delete({
      where: { id },
    });

    res.json({ message: 'Club deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete club' });
  }
});

router.post('/:id/join', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: req.user!.id,
          clubId: id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Already a member' });
    }

    const membership = await prisma.clubMember.create({
      data: {
        userId: req.user!.id,
        clubId: id,
      },
    });

    res.status(201).json(membership);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to join club' });
  }
});

router.get('/:id/members', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const members = await prisma.clubMember.findMany({
      where: { clubId: id },
      include: {
        user: {
          select: { id: true, name: true, email: true, studentId: true },
        },
      },
    });

    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

export default router;
