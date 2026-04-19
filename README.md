# NSU ClubHub - Complete Setup Guide

## Prerequisites

- **Node.js**: v18+ (Check with `node -v`)
- **PostgreSQL**: v15+ (Ensure PostgreSQL service is running)
- **npm**: Comes with Node.js

## Project Structure

```
Group6cse299/
├── frontend/          # Next.js frontend (port 3000)
├── backend/          # Express API (port 3001)
│   ├── prisma/      # Database schema
│   └── src/         # API routes
```

## Step-by-Step Setup

### Step 1: Install Frontend Dependencies

```powershell
cd E:\NSUClubHub\Group6cse299
npm install
```

### Step 2: Install Backend Dependencies

```powershell
cd E:\NSUClubHub\Group6cse299\backend
npm install
```

### Step 3: Set Up PostgreSQL

**Option A: Local PostgreSQL**
1. Install PostgreSQL from https://www.postgresql.org/download/
2. During installation, set password for user `postgres`
3. Open pgAdmin or psql and create database:
   ```sql
   CREATE DATABASE nsu_clubhub;
   ```

**Option B: Docker**
```powershell
docker run --name nsu-clubhub-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -e POSTGRES_DB=nsu_clubhub -p 5432:5432 -d postgres:15
```

### Step 4: Configure Environment Variables

The backend already has a `.env` file. If you need to modify it:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/nsu_clubhub"
PORT=3001
JWT_SECRET="your-secret-key"
CORS_WHITELIST="http://localhost:3000"
```

Update `DATABASE_URL` with your actual PostgreSQL password.

### Step 5: Run Database Migrations

```powershell
cd E:\NSUClubHub\Group6cse299\backend
npx prisma migrate dev --name init
```

### Step 6: (Optional) Seed Database

```powershell
cd E:\NSUClubHub\Group6cse299\backend
npm run db:seed
```

### Step 7: Start Backend Server

**Terminal 1:**
```powershell
cd E:\NSUClubHub\Group6cse299\backend
npm run dev
```
Backend runs at http://localhost:3001

### Step 8: Start Frontend Server

**Terminal 2:**
```powershell
cd E:\NSUClubHub\Group6cse299
npm run dev
```
Frontend runs at http://localhost:3000

## Verify Installation

- Frontend: Open http://localhost:3000
- Backend API: http://localhost:3001/api/health (should return `{ status: "ok" }`)

## Available Scripts

### Frontend (Group6cse299 folder)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint code

### Backend (Group6cse299\backend folder)
- `npm run dev` - Start development server
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed database
- `npm run db:push` - Push schema to database

## Troubleshooting

### Port Already in Use
If ports 3000 or 3001 are busy:
```powershell
# Find process using the port
netstat -ano | findstr :3000
# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env` is correct
- Ensure database `nsu_clubhub` exists

### Prisma Errors
```powershell
# Regenerate Prisma client
cd E:\NSUClubHub\Group6cse299\backend
npx prisma generate
```

## Quick Start (Already Configured)

If you have PostgreSQL running with password `password`:

```powershell
# Terminal 1 - Backend
cd E:\NSUClubHub\Group6cse299\backend
npm run dev

# Terminal 2 - Frontend
cd E:\NSUClubHub\Group6cse299
npm run dev
```

Then open http://localhost:3000