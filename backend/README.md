# NSU ClubHub Backend

Backend API for the NSU ClubHub application built with Node.js, Express, PostgreSQL, and Prisma.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Validation**: Zod

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)
- npm or yarn

## Quick Start

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Setup PostgreSQL (Docker recommended)**
   ```bash
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=nsu_clubhub postgres
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```
   DATABASE_URL="postgresql://postgres:secret@localhost:5432/nsu_clubhub?schema=public"
   JWT_SECRET="your-super-secret-key-change-in-production"
   PORT=3001
   ```

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed  # Optional: creates sample data
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Update frontend environment**
   In your frontend `.env` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

## Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@nsu.edu | admin123 |
| Club Admin | arif@nsu.edu | clubadmin123 |
| Student | student@nsu.edu | student123 |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Clubs
- `GET /api/clubs` - List all clubs (query: category, search)
- `GET /api/clubs/:id` - Get club details
- `POST /api/clubs` - Create club (Super Admin)
- `PUT /api/clubs/:id` - Update club
- `DELETE /api/clubs/:id` - Delete club (Super Admin)
- `POST /api/clubs/:id/join` - Join club
- `GET /api/clubs/:id/members` - Get club members

### Events
- `GET /api/events` - List events (query: category, month, year)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (Club Admin)
- `PUT /api/events/:id` - Update event
- `PATCH /api/events/:id/status` - Update event status (Super Admin)
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/rsvp` - RSVP to event
- `DELETE /api/events/:id/rsvp` - Cancel RSVP

### Recruitment
- `GET /api/recruitment/cycles` - List recruitment cycles
- `GET /api/recruitment/cycles/:id` - Get cycle with applications
- `POST /api/recruitment/cycles` - Create cycle (Club Admin)
- `PATCH /api/recruitment/cycles/:id/status` - Open/close cycle
- `POST /api/recruitment/apply/:cycleId` - Apply to recruitment
- `PATCH /api/recruitment/applications/:id/status` - Update application
- `GET /api/recruitment/my-applications` - Get my applications

### Announcements
- `GET /api/announcements` - List announcements
- `POST /api/announcements` - Create announcement
- `PATCH /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

### Users
- `GET /api/users` - List users (Super Admin)
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Super Admin)
- `GET /api/users/me/clubs` - Get my clubs

### Dashboard
- `GET /api/dashboard/super-admin` - Super admin dashboard stats
- `GET /api/dashboard/club-admin` - Club admin dashboard stats

## User Roles

- **STUDENT**: Browse clubs, events, join clubs, RSVP
- **CLUB_ADMIN**: Manage club events, recruitment, members
- **SUPER_ADMIN**: Full platform access, approve events, manage users/clubs
