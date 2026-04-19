import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const superAdminPassword = await bcrypt.hash('admin123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@northsouth.edu' },
    update: {},
    create: {
      email: 'admin@northsouth.edu',
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
    prisma.club.upsert({ where: { name: 'NSU Photography Club' }, update: {}, create: { name: 'NSU Photography Club', description: 'Capturing moments on campus', category: 'Arts', email: 'photo@nsu.edu' } }),
    prisma.club.upsert({ where: { name: 'NSU Debate Club' }, update: {}, create: { name: 'NSU Debate Club', description: 'Fostering critical thinking and public speaking', category: 'Cultural', email: 'debate@nsu.edu' } }),
    prisma.club.upsert({ where: { name: 'NSU Athletics Club' }, update: {}, create: { name: 'NSU Athletics Club', description: 'Promoting physical fitness and sportsmanship', category: 'Sports', email: 'athletics@nsu.edu' } }),
  ]);
  console.log(`Created ${clubs.length} clubs`);

  const clubAdminPassword = await bcrypt.hash('clubadmin123', 10);
  const clubAdmin = await prisma.user.upsert({
    where: { email: 'arif@northsouth.edu' },
    update: {},
    create: {
      email: 'arif@northsouth.edu',
      password: clubAdminPassword,
      name: 'Arif Rahman',
      role: 'CLUB_ADMIN',
      clubId: clubs[0].id,
    },
  });
  console.log('Created club admin:', clubAdmin.email);

  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@northsouth.edu' },
    update: {},
    create: {
      email: 'student@northsouth.edu',
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
        status: 'APPROVED',
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
        status: 'APPROVED',
        clubId: clubs[1].id,
        creatorId: clubAdmin.id,
      },
    }),
  ]);
  // Create recruitment cycle first to be used by applications
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

  // RSVP examples (now that recruitmentCycle exists)
  try {
    if (student?.id && events[0]?.id) {
      await prisma.rsvp.create({ data: { userId: student.id, eventId: events[0].id } });
    }
    if (student?.id && events[1]?.id) {
      await prisma.rsvp.create({ data: { userId: student.id, eventId: events[1].id } });
    }
  } catch {
    // ignore if duplicates
  }

  // Applications to recruitment cycle
  try {
    if (student?.id && recruitmentCycle?.id) {
      await prisma.application.create({
        data: {
          userId: student.id,
          cycleId: recruitmentCycle.id,
          position: 'Volunteer',
          status: 'NEW',
        },
      });
      await prisma.application.create({
        data: {
          userId: student.id,
          cycleId: recruitmentCycle.id,
          position: 'Engineer',
          status: 'NEW',
        },
      });
    }
  } catch {
    // ignore
  }

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
