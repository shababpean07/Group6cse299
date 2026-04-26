import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Super Admin
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

  // Create Clubs with more details
  const clubs = await Promise.all([
    prisma.club.upsert({
      where: { name: 'ACM' },
      update: {},
      create: {
        name: 'ACM',
        description: 'Association for Computing Machinery - Advancing computing as a science and profession. We organize hackathons, coding competitions, and tech workshops throughout the year.',
        category: 'Tech',
        email: 'acm@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'Earth Club' },
      update: {},
      create: {
        name: 'Earth Club',
        description: 'Promoting environmental awareness and sustainability on campus. We conduct tree plantations, waste management campaigns, and green awareness programs.',
        category: 'Cultural',
        email: 'earth@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'NSU Sports Club' },
      update: {},
      create: {
        name: 'NSU Sports Club',
        description: 'Promoting physical fitness and sportsmanship among students. Join us for football, cricket, badminton tournaments and more!',
        category: 'Sports',
        email: 'sports@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'NSU Debate Club' },
      update: {},
      create: {
        name: 'NSU Debate Club',
        description: 'Fostering critical thinking and public speaking skills. We participate in inter-university debate competitions.',
        category: 'Cultural',
        email: 'debate@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'NSU Moot Club' },
      update: {},
      create: {
        name: 'NSU Moot Club',
        description: 'Legal debate and moot court competitions. We organize national and international moot court events.',
        category: 'Academic',
        email: 'moot@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'NSUSS' },
      update: {},
      create: {
        name: 'NSUSS',
        description: 'North South University Science Society. Exploring science through experiments, quizzes, and Olympiads.',
        category: 'Academic',
        email: 'nsuss@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'NSU Communication Club' },
      update: {},
      create: {
        name: 'NSU Communication Club',
        description: 'Enhancing communication and interpersonal skills. We conduct media workshops and public speaking training.',
        category: 'Cultural',
        email: 'communication@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'NSU Photography Club' },
      update: {},
      create: {
        name: 'NSU Photography Club',
        description: 'Capturing moments and memories. We organize photo walks, exhibitions, and photography competitions.',
        category: 'Arts',
        email: 'photography@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'NSU Drama Club' },
      update: {},
      create: {
        name: 'NSU Drama Club',
        description: 'Expressing emotions through theatre. Annual drama productions and stage performances.',
        category: 'Arts',
        email: 'drama@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'NSU Robotics Club' },
      update: {},
      create: {
        name: 'NSU Robotics Club',
        description: 'Building the future of automation and AI. We participate in national robotics competitions.',
        category: 'Tech',
        email: 'robotics@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'NSU Finance Club' },
      update: {},
      create: {
        name: 'NSU Finance Club',
        description: 'Bridging the gap between theory and finance. Stock market simulations, investment workshops, and finance conclaves.',
        category: 'Academic',
        email: 'finance@nsu.edu',
      },
    }),
    prisma.club.upsert({
      where: { name: 'NSU Cultural Club' },
      update: {},
      create: {
        name: 'NSU Cultural Club',
        description: 'Celebrating diversity through cultural programs. Annual cultural night and international festival.',
        category: 'Cultural',
        email: 'cultural@nsu.edu',
      },
    }),
  ]);
  console.log(`Created ${clubs.length} clubs`);

  // Create Club Admins
  const clubAdminPassword = await bcrypt.hash('clubadmin123', 10);
  const clubAdmins = await Promise.all([
    prisma.user.upsert({
      where: { email: 'arif@northsouth.edu' },
      update: {},
      create: {
        email: 'arif@northsouth.edu',
        password: clubAdminPassword,
        name: 'Arif Rahman',
        role: 'CLUB_ADMIN',
        clubId: clubs[0].id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'sadia@northsouth.edu' },
      update: {},
      create: {
        email: 'sadia@northsouth.edu',
        password: clubAdminPassword,
        name: 'Sadia Islam',
        role: 'CLUB_ADMIN',
        clubId: clubs[1].id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'rahat@northsouth.edu' },
      update: {},
      create: {
        email: 'rahat@northsouth.edu',
        password: clubAdminPassword,
        name: 'Rahat Khan',
        role: 'CLUB_ADMIN',
        clubId: clubs[2].id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'priya@northsouth.edu' },
      update: {},
      create: {
        email: 'priya@northsouth.edu',
        password: clubAdminPassword,
        name: 'Priya Das',
        role: 'CLUB_ADMIN',
        clubId: clubs[3].id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'tanvir@northsouth.edu' },
      update: {},
      create: {
        email: 'tanvir@northsouth.edu',
        password: clubAdminPassword,
        name: 'Tanvir Ahmed',
        role: 'CLUB_ADMIN',
        clubId: clubs[4].id,
      },
    }),
  ]);
  console.log(`Created ${clubAdmins.length} club admins`);

  // Create Students
  const studentPassword = await bcrypt.hash('student123', 10);
  const students = await Promise.all([
    prisma.user.upsert({
      where: { email: 'student@northsouth.edu' },
      update: {},
      create: {
        email: 'student@northsouth.edu',
        password: studentPassword,
        name: 'Test Student',
        role: 'STUDENT',
      },
    }),
    prisma.user.upsert({
      where: { email: 'jahid@northsouth.edu' },
      update: {},
      create: {
        email: 'jahid@northsouth.edu',
        password: studentPassword,
        name: 'Jahid Hasan',
        role: 'STUDENT',
      },
    }),
    prisma.user.upsert({
      where: { email: 'meherin@northsouth.edu' },
      update: {},
      create: {
        email: 'meherin@northsouth.edu',
        password: studentPassword,
        name: 'Meherin Chowdhury',
        role: 'STUDENT',
      },
    }),
    prisma.user.upsert({
      where: { email: 'ashraf@northsouth.edu' },
      update: {},
      create: {
        email: 'ashraf@northsouth.edu',
        password: studentPassword,
        name: 'Ashraf Ullah',
        role: 'STUDENT',
      },
    }),
    prisma.user.upsert({
      where: { email: 'farhana@northsouth.edu' },
      update: {},
      create: {
        email: 'farhana@northsouth.edu',
        password: studentPassword,
        name: 'Farhana Riaz',
        role: 'STUDENT',
      },
    }),
    prisma.user.upsert({
      where: { email: 'mim@northsouth.edu' },
      update: {},
      create: {
        email: 'mim@northsouth.edu',
        password: studentPassword,
        name: 'Mim Akter',
        role: 'STUDENT',
      },
    }),
    prisma.user.upsert({
      where: { email: 'riaz@northsouth.edu' },
      update: {},
      create: {
        email: 'riaz@northsouth.edu',
        password: studentPassword,
        name: 'Riaz Rahman',
        role: 'STUDENT',
      },
    }),
    prisma.user.upsert({
      where: { email: 'sami@northsouth.edu' },
      update: {},
      create: {
        email: 'sami@northsouth.edu',
        password: studentPassword,
        name: 'Sami Islam',
        role: 'STUDENT',
      },
    }),
  ]);
  console.log(`Created ${students.length} students`);

  // Generate random member associations
  for (const student of students) {
    for (let i = 0; i < clubs.length; i++) {
      if (Math.random() > 0.5) { // 50% chance to join each club
        try {
          await prisma.clubMember.create({
            data: {
              userId: student.id,
              clubId: clubs[i].id,
              role: 'MEMBER',
            },
          });
        } catch {
          // ignore duplicates
        }
      }
    }
  }

  // Create Events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Intra-University Hackathon 2026',
        description: 'Annual 24-hour coding competition. Build innovative solutions and win exciting prizes!',
        category: 'Tech',
        startDate: new Date('2026-05-10T09:00:00'),
        endDate: new Date('2026-05-11T09:00:00'),
        venue: 'LIB 602 & 603',
        status: 'APPROVED',
        clubId: clubs[0].id,
        creatorId: clubAdmins[0].id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Tree Plantation Drive',
        description: 'Join us for a tree plantation drive to make NSU greener!',
        category: 'Cultural',
        startDate: new Date('2026-05-15T07:00:00'),
        endDate: new Date('2026-05-15T12:00:00'),
        venue: 'NSU Campus Garden',
        status: 'APPROVED',
        clubId: clubs[1].id,
        creatorId: clubAdmins[1].id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Inter-Department Cricket Tournament',
        description: 'Annual cricket tournament between NSU departments.',
        category: 'Sports',
        startDate: new Date('2026-05-20T08:00:00'),
        endDate: new Date('2026-05-25T18:00:00'),
        venue: 'NSU Sports Ground',
        status: 'APPROVED',
        clubId: clubs[2].id,
        creatorId: clubAdmins[2].id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'National Debate Championship',
        description: 'Inter-university debate competition.',
        category: 'Cultural',
        startDate: new Date('2026-06-01T10:00:00'),
        endDate: new Date('2026-06-03T17:00:00'),
        venue: 'NSU Auditorium',
        status: 'APPROVED',
        clubId: clubs[3].id,
        creatorId: clubAdmins[3].id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'National Moot Court 2026',
        description: 'Annual national moot court competition.',
        category: 'Academic',
        startDate: new Date('2026-06-10T09:00:00'),
        endDate: new Date('2026-06-12T17:00:00'),
        venue: 'Moot Court Hall',
        status: 'APPROVED',
        clubId: clubs[4].id,
        creatorId: clubAdmins[4].id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Tech Talk: AI & Machine Learning',
        description: 'Expert session on AI and ML fundamentals.',
        category: 'Tech',
        startDate: new Date('2026-05-05T14:00:00'),
        endDate: new Date('2026-05-05T16:00:00'),
        venue: 'LAB 305',
        status: 'APPROVED',
        clubId: clubs[0].id,
        creatorId: clubAdmins[0].id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Photography Walk: Old Dhaka',
        description: 'Exploring Old Dhaka through our lenses.',
        category: 'Arts',
        startDate: new Date('2026-05-08T06:00:00'),
        endDate: new Date('2026-05-08T11:00:00'),
        venue: 'Old Dhaka',
        status: 'APPROVED',
        clubId: clubs[7].id,
        creatorId: clubAdmins[0].id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Drama Night 2026',
        description: 'Annual drama production featuring student actors.',
        category: 'Arts',
        startDate: new Date('2026-06-15T18:00:00'),
        endDate: new Date('2026-06-15T21:00:00'),
        venue: 'NSU Auditorium',
        status: 'PENDING_APPROVAL',
        clubId: clubs[8].id,
        creatorId: clubAdmins[0].id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Robotics Workshop',
        description: 'Hands-on robotics workshop for beginners.',
        category: 'Tech',
        startDate: new Date('2026-05-12T10:00:00'),
        endDate: new Date('2026-05-12T14:00:00'),
        venue: 'Robotics Lab',
        status: 'APPROVED',
        clubId: clubs[9].id,
        creatorId: clubAdmins[0].id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Stock Market Simulation',
        description: 'Learn investing through simulation games.',
        category: 'Academic',
        startDate: new Date('2026-05-18T15:00:00'),
        endDate: new Date('2026-05-18T17:00:00'),
        venue: 'Business Lab',
        status: 'APPROVED',
        clubId: clubs[10].id,
        creatorId: clubAdmins[0].id,
      },
    }),
  ]);
  console.log(`Created ${events.length} events`);

  // Create RSVPs
  for (const student of students) {
    for (const event of events) {
      if (Math.random() > 0.7) { // 30% chance to RSVP
        try {
          await prisma.rsvp.create({
            data: {
              userId: student.id,
              eventId: event.id,
            },
          });
        } catch {
          // ignore duplicates
        }
      }
    }
  }
  console.log('Created RSVPs');

  // Create Recruitment Cycles
  const recruitmentCycles = await Promise.all([
    prisma.recruitmentCycle.create({
      data: {
        title: 'Spring 2026 Recruitment',
        description: 'Join the ACM team! We are looking for passionate developers.',
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-03-28'),
        maxSlots: 50,
        status: 'OPEN',
        clubId: clubs[0].id,
      },
    }),
    prisma.recruitmentCycle.create({
      data: {
        title: 'Earth Club Green Team',
        description: 'Be part of our environmental mission.',
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-04-20'),
        maxSlots: 30,
        status: 'OPEN',
        clubId: clubs[1].id,
      },
    }),
    prisma.recruitmentCycle.create({
      data: {
        title: 'Sports Club Athletes',
        description: 'Join our sports teams!',
        startDate: new Date('2026-04-15'),
        endDate: new Date('2026-05-05'),
        maxSlots: 40,
        status: 'OPEN',
        clubId: clubs[2].id,
      },
    }),
    prisma.recruitmentCycle.create({
      data: {
        title: 'Photography Club New Members',
        description: 'Capture moments with us!',
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-05-15'),
        maxSlots: 25,
        status: 'OPEN',
        clubId: clubs[7].id,
      },
    }),
  ]);
  console.log(`Created ${recruitmentCycles.length} recruitment cycles`);

  // Create Applications
  const positions = ['Volunteer', 'Engineer', 'Designer', 'Content Writer', 'Event Manager', 'Researcher'];
  const statuses = ['NEW', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'ACCEPTED'];
  
  for (const student of students) {
    for (const cycle of recruitmentCycles) {
      if (Math.random() > 0.6) { // 40% chance to apply
        try {
          await prisma.application.create({
            data: {
              userId: student.id,
              cycleId: cycle.id,
              position: positions[Math.floor(Math.random() * positions.length)],
              status: statuses[Math.floor(Math.random() * statuses.length)],
            },
          });
        } catch {
          // ignore duplicates
        }
      }
    }
  }
  console.log('Created applications');

  // Create Announcements
  const announcements = await Promise.all([
    prisma.announcement.create({
      data: {
        title: 'Welcome to NSU ClubHub 2026',
        content: 'All clubs are now open for recruitment! Apply now to join your favorite club.',
        clubId: clubs[0].id,
        authorId: clubAdmins[0].id,
      },
    }),
    prisma.announcement.create({
      data: {
        title: 'Hackathon Registration Open',
        content: 'Register now for the Intra-University Hackathon 2026!',
        clubId: clubs[0].id,
        authorId: clubAdmins[0].id,
      },
    }),
    prisma.announcement.create({
      data: {
        title: 'Tree Plantation Event',
        content: 'Join us on May 15th for our tree plantation drive.',
        clubId: clubs[1].id,
        authorId: clubAdmins[1].id,
      },
    }),
  ]);
  console.log(`Created ${announcements.length} announcements`);

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