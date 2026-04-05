import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const superAdminPassword = await bcrypt.hash('admin123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@nsu.edu' },
    update: {},
    create: {
      email: 'admin@nsu.edu',
      password: superAdminPassword,
      name: 'System Admin',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('Created super admin:', superAdmin.email);

  const clubs = await Promise.all([
    prisma.club.upsert({
      where: { name: 'NSU ACM SC' },
      update: {},
      create: {
        name: 'NSU ACM SC',
        description: 'Advancing computing as a science & profession.',
        category: 'Tech',
        email: 'acm@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'NSU Robotics Club' },
      update: {},
      create: {
        name: 'NSU Robotics Club',
        description: 'Building the future of automation and AI.',
        category: 'Tech',
        email: 'robotics@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'NSU Drama Club' },
      update: {},
      create: {
        name: 'NSU Drama Club',
        description: 'Expressing emotions through the power of theatre.',
        category: 'Arts',
        email: 'drama@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'NSU Finance Club' },
      update: {},
      create: {
        name: 'NSU Finance Club',
        description: 'Bridging the gap between theory and finance.',
        category: 'Academic',
        email: 'finance@nsu.edu',
      },
    }),
  ]);
  console.log(`Created ${clubs.length} clubs`);

  const clubAdminPassword = await bcrypt.hash('clubadmin123', 10);
  const clubAdmin = await prisma.user.upsert({
    where: { email: 'arif@nsu.edu' },
    update: {},
    create: {
      email: 'arif@nsu.edu',
      password: clubAdminPassword,
      name: 'Arif Rahman',
      role: 'CLUB_ADMIN',
      clubId: clubs[0].id,
    },
  });
  console.log('Created club admin:', clubAdmin.email);

  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@nsu.edu' },
    update: {},
    create: {
      email: 'student@nsu.edu',
      password: studentPassword,
      name: 'Test Student',
      role: 'STUDENT',
    },
  });
  console.log('Created student:', student.email);

  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Intra-University Hackathon',
        description: 'Annual coding competition for NSU students',
        category: 'Tech',
        startDate: new Date('2026-03-10T09:00:00'),
        endDate: new Date('2026-03-10T17:00:00'),
        venue: 'LIB 602',
        status: 'PENDING_APPROVAL',
        clubId: clubs[0].id,
        creatorId: clubAdmin.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Robot Showcase 2026',
        description: 'Annual robotics exhibition',
        category: 'Tech',
        startDate: new Date('2026-03-14T11:00:00'),
        endDate: new Date('2026-03-14T16:00:00'),
        venue: 'Plaza Area',
        status: 'PENDING_APPROVAL',
        clubId: clubs[1].id,
        creatorId: clubAdmin.id,
      },
    }),
  ]);
  console.log(`Created ${events.length} events`);

  const recruitmentCycle = await prisma.recruitmentCycle.create({
    data: {
      title: 'Spring 2026 Recruitment',
      description: 'Join the NSU ACM SC team!',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-28'),
      maxSlots: 50,
      status: 'OPEN',
      clubId: clubs[0].id,
    },
  });
  console.log('Created recruitment cycle:', recruitmentCycle.title);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
