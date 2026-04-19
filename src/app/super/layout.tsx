"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Building2,
  Megaphone,
  Users,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationPanel } from "@/components/layout/notification-panel";

/* ── Nav config ────────────────────────────────────────── */
const sidebarNav = [
  { label: "Dashboard",       href: "/super/dashboard",      icon: LayoutDashboard },
  { label: "Event Approvals", href: "/super/approvals",      icon: CheckSquare },
  { label: "Club Management", href: "/super/clubs",          icon: Building2 },
  { label: "Announcements",   href: "/super/announcements",  icon: Megaphone },
  { label: "User Management", href: "/super/users",          icon: Users },
];

const mobileNav = [
  { label: "Home",       href: "/super/dashboard",     icon: LayoutDashboard },
  { label: "Approvals",  href: "/super/approvals",     icon: CheckSquare },
  { label: "Clubs",      href: "/super/clubs",         icon: Building2 },
  { label: "Announce",   href: "/super/announcements", icon: Megaphone },
  { label: "Users",      href: "/super/users",         icon: Users },
];

/* ── Page title map ───────────────────────────────────── */
const pageTitles: Record<string, string> = {
  "/super/dashboard":      "Dashboard",
  "/super/approvals":      "Event Approvals",
  "/super/clubs":          "Club Management",
  "/super/announcements":  "Announcements",
  "/super/users":          "User Management",
};

/* ── Layout ────────────────────────────────────────────── */
export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);

  const pageTitle = pageTitles[pathname] ?? "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6fa] text-[#0f1828]">

      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside className="hidden md:flex w-[228px] flex-col bg-[#0a0f1a] border-r border-[#151e2e] h-full shrink-0 z-20 relative">

        {/* Gold accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D97706] z-10" />

        {/* Logo */}
        <div className="h-[80px] px-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-[#0D7377] flex items-center justify-center">
            <span className="font-syne font-[800] text-white text-lg leading-none">N</span>
          </div>
          <div className="flex flex-col">
            <span className="font-syne font-[700] text-white text-[14px] leading-tight">ClubHub</span>
            <span className="text-[10px] text-[rgba(255,255,255,0.35)] leading-tight">NSU Portal</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/super/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-[600] transition-all duration-200 relative overflow-hidden",
                  isActive
                    ? "bg-[rgba(13,115,119,0.18)] text-[#4ecdc4]"
                    : "text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.65)] hover:bg-[rgba(255,255,255,0.05)]"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0D7377] rounded-r-full" />
                )}
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user pill */}
        <div className="p-4 border-t border-[#151e2e]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-[#D97706] flex items-center justify-center text-white text-[11px] font-syne font-[700]">
              SA
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-syne font-[700] text-white leading-tight">Super Admin</span>
              <span className="text-[10px] font-[700] uppercase tracking-[0.1em] text-[#D97706] bg-[rgba(217,119,6,0.15)] border border-[rgba(217,119,6,0.3)] px-1.5 py-0.5 rounded-full inline-block w-fit mt-0.5">
                SUPER ADMIN
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══════════ MAIN COLUMN ═══════════ */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* TOPBAR */}
        <header className="h-[58px] bg-white border-b-[1.5px] border-[#e8ecf2] flex items-center justify-between px-6 shrink-0 z-10">
          {/* Left: page title */}
          <h1 className="font-syne font-[700] text-[18px] text-[#0f1828]">
            {pageTitle}
          </h1>

          {/* Right: bell + super admin badge + avatar */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-8 h-8 flex items-center justify-center text-[#8896b0] hover:text-[#0D7377] hover:bg-[#e6f4f5] rounded-[8px] transition-colors"
            >
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-[5px] right-[5px] w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
            </button>
            <span className="text-[10px] font-[700] uppercase tracking-[0.1em] text-[#D97706] bg-[rgba(217,119,6,0.15)] border border-[rgba(217,119,6,0.3)] px-2 py-1 rounded-full hidden sm:inline-block">
              Super Admin
            </span>
            <div className="w-8 h-8 rounded-full bg-[#D97706] flex items-center justify-center text-white font-syne font-[700] text-[11px] shadow-sm">
              SA
            </div>
          </div>
        </header>

        {/* CANVAS */}
        <main
          className="flex-1 overflow-auto p-5 md:p-8 pb-24 md:pb-8 relative"
          style={{
            background: "#f5f6fa",
            backgroundImage: "radial-gradient(#d1d9e6 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        >
          <div className="max-w-[1200px] mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>

      {/* ═══════════ MOBILE TAB BAR ═══════════ */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden items-center justify-around border-t border-[#e8ecf2] bg-white h-16 px-2">
        {mobileNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/super/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-[11px] font-[600] transition-colors",
                isActive
                  ? "text-[#0D7377]"
                  : "text-[#8896b0] hover:text-[#0f1828]"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
