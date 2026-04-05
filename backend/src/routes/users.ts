import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.js';
import { UserRole } from '@prisma/client';

const router = Router();

const updateUserSchema = z.object({
  role: z.enum(['STUDENT', 'CLUB_ADMIN', 'SUPER_ADMIN']).optional(),
  clubId: z.string().nullable().optional(),
  name: z.string().min(2).optional(),
});

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const { role, search } = req.query;

    const where: any = {};
    if (role) where.role = role as UserRole;
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
        { studentId: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        studentId: true,
        role: true,
        clubId: true,
        club: {
          select: { id: true, name: true },
        },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user!.id !== id && req.user!.role !== UserRole.SUPER_ADMIN) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        studentId: true,
        role: true,
        clubId: true,
        club: {
          select: { id: true, name: true },
        },
        createdAt: true,
        _count: {
          select: { clubMemberships: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateUserSchema.parse(req.body);

    if (req.user!.id !== id && req.user!.role !== UserRole.SUPER_ADMIN) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (data.role && req.user!.role !== UserRole.SUPER_ADMIN) {
      return res.status(403).json({ error: 'Only super admins can change roles' });
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        studentId: true,
        role: true,
        clubId: true,
      },
    });

    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user!.id === id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.get('/me/clubs', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const memberships = await prisma.clubMember.findMany({
      where: { userId: req.user!.id },
      include: {
        club: true,
      },
    });

    res.json(memberships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch clubs' });
  }
});

export default router;
