# NSU ClubHub - Project Report

## 1. Project Overview

**Project Name:** NSU ClubHub
**Description:** A comprehensive club management platform for North South University, designed to replace scattered WhatsApp groups and missed deadlines with a centralized portal.
**Technology Stack:** Next.js 15, TypeScript, Tailwind CSS, PostgreSQL, Prisma

---

## 2. Features

### 2.1 User Roles
- **Students** - Browse clubs, events, apply for recruitments
- **Club Administrators** - Manage club members, events, recruitments
- **Super Administrators** - Platform-wide management, approvals, announcements

### 2.2 Core Modules

| Module | Description |
|--------|-------------|
| **Club Directory** | Browse all NSU clubs, view mandates and exec boards |
| **Event Calendar** | Master calendar for seminars, shows, workshops |
| **Recruitment Portal** | Apply to clubs, track application status |
| **QR Event RSVP** | QR code-based event check-in system |
| **Announcements** | Club and platform-wide announcements |

### 2.3 Key Features
- Email/password authentication
- Guest access mode
- Quick login demo for different roles
- Real-time notifications
- AI Chat assistant
- Dashboard with stats and upcoming events

---

## 3. Project Structure

```
Group6cse299/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/             # Student-facing routes
│   │   │   ├── clubs/         # Club directory & details
│   │   │   ├── dashboard/     # User dashboard
│   │   │   ├── events/       # Event calendar
│   │   │   ├── recruitment/   # Recruitment listings
│   │   │   └── settings/      # User settings
│   │   ├── admin/             # Club admin routes
│   │   │   ├── dashboard/     # Admin dashboard
│   │   │   ├── events/        # Event management
│   │   │   ├── members/       # Member management
│   │   │   └── recruitment/  # Recruitment management
│   │   ├── super/             # Super admin routes
│   │   │   ├── dashboard/    # Super admin dashboard
│   │   │   ├── clubs/        # Club approvals
│   │   │   ├── users/        # User management
│   │   │   └── announcements/# Announcement management
│   │   ├── auth/             # Authentication
│   │   │   ├── login/        # Login page
│   │   │   └── register/      # Registration page
│   │   └── (demo)/           # Demo routes
│   ├── components/           # Reusable UI components
│   │   ├── clubs/           # Club-related components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Base UI components
│   └── context/              # React contexts
├── backend/                 # Express API (port 3001)
│   ├── prisma/             # Database schema
│   └── src/                # API routes
└── package.json            # Frontend dependencies
```

---

## 4. Pages

### 4.1 Public Routes
| Route | Description |
|-------|-------------|
| `/` | Landing page with login |
| `/login` | User login |
| `/register` | User registration |
| `/unauthorized` | Unauthorized access page |
| `/not-found` | 404 page |

### 4.2 Student Routes
| Route | Description |
|-------|-------------|
| `/(app)/dashboard` | User dashboard |
| `/(app)/clubs` | Club directory |
| `/(app)/clubs/[id]` | Club details |
| `/(app)/events` | Event calendar |
| `/(app)/recruitment` | Open recruitments |
| `/(app)/settings` | User settings |

### 4.3 Club Admin Routes
| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Admin dashboard |
| `/admin/events` | Event management |
| `/admin/events/create` | Create event |
| `/admin/members` | Member management |
| `/admin/recruitment` | Recruitment management |
| `/admin/profile` | Admin profile |

### 4.4 Super Admin Routes
| Route | Description |
|-------|-------------|
| `/super/dashboard` | Platform dashboard |
| `/super/clubs` | Club approvals |
| `/super/users` | User management |
| `/super/announcements` | Announcements |
| `/super/approvals` | Pending approvals |

---

## 5. Design System

### 5.1 Color Palette
| Color | Hex Code | Usage |
|-------|---------|-------|
| Primary | `#0D7377` | Main brand color |
| Secondary | `#14FFEC` | Accent/hover |
| Dark | `#0f1828` | Background |
| Light | `#ffffff` | Text on dark |
| Muted | `#8896b0` | Secondary text |

### 5.2 Typography
- **Primary Font:** Syne (headings)
- **Secondary Font:** Sans (body)

### 5.3 UI Components
- Custom buttons, inputs, cards
- Avatar components
- Badge/Status components
- Sheet/Dropdown menus
- Toast notifications
- Skeleton loaders

---

## 6. API Endpoints (Backend)

### 6.1 Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### 6.2 Clubs
- `GET /api/clubs` - List all clubs
- `GET /api/clubs/:id` - Get club details
- `POST /api/clubs` - Create club
- `PUT /api/clubs/:id` - Update club
- `DELETE /api/clubs/:id` - Delete club

### 6.3 Events
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### 6.4 Recruitment
- `GET /api/recruitment` - List openings
- `POST /api/recruitment` - Create opening
- `POST /api/recruitment/apply` - Apply to club

---

## 7. Setup Requirements

### 7.1 Prerequisites
- Node.js v18+
- PostgreSQL v15+

### 7.2 Environment Variables
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/nsu_clubhub"
PORT=3001
JWT_SECRET="your-secret-key"
CORS_WHITELIST="http://localhost:3000"
```

### 7.3 Running the Project
```powershell
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
npm run dev
```

---

## 8. Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@northsouth.edu | admin123 |
| Club Admin | Arif@northsouth.edu | clubadmin123 |
| Student | student@northsouth.edu | student123 |

---

## 9. Project Statistics

- **Total Pages:** 30+
- **Components:** 40+
- **User Roles:** 3
- **Tech Stack:** 5+ technologies

---

## 10. Future Enhancements

- Forgot password functionality
- Email notifications
- Event reminder system
- Club achievement badges
- Analytics dashboard
- Mobile app integration