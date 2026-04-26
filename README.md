# NSU ClubHub - Complete Setup Guide

A comprehensive university club management portal for North South University (NSU). NSU ClubHub bridges the gap between students and clubs, helping students discover extracurricular activities, track recruitment applications, and stay informed about campus events while providing clubs with powerful management tools.

---

## 🌟 Key Features

### For Students
- 🎓 **Discover Clubs** — Browse a centralized directory of all active NSU clubs.
- 📅 **Event Management** — View upcoming campus events and RSVP instantly.
- 📝 **Recruitment Tracking** — Apply during club recruitment cycles and track application status.
- 🔔 **Notifications** — Stay updated on club activities and announcements.

### For Club Admins & Executive Bodies
- 🏛️ **Club Admin Panel** — Streamline daily club operations and manage members efficiently.
- 📢 **Event Publishing** — Create, post, and manage club events.
- 🔄 **Recruitment Cycles** — Set up recruitment phases, review applications, and onboard new members.

### System Architecture
- 🔐 **Role-Based Authentication** — Secure login with automatic redirects based on user roles (Student, Club Admin, Super Admin).

---

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



## 👥 Acknowledgements

Developed as a group project for **CSE299** at **North South University (NSU)**.

**Team:** Group 6
