"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  UserPlus,
  Users,
  Building2,
  Settings,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Nav config ────────────────────────────────────────── */
const sidebarNav = [
  { label: "Dashboard",    href: "/admin/dashboard",   icon: LayoutDashboard },
  { label: "My Events",    href: "/admin/events",      icon: Calendar },
  { label: "Recruitment",  href: "/admin/recruitment",  icon: UserPlus },
  { label: "Members",      href: "/admin/members",     icon: Users },
  { label: "Club Profile", href: "/admin/profile",     icon: Building2 },
  { label: "Settings",     href: "/settings",          icon: Settings },
];

const mobileNav = [
  { label: "Home",    href: "/admin/dashboard",   icon: LayoutDashboard },
  { label: "Events",  href: "/admin/events",      icon: Calendar },
  { label: "Recruit", href: "/admin/recruitment",  icon: UserPlus },
  { label: "Members", href: "/admin/members",     icon: Users },
  { label: "Profile", href: "/admin/profile",     icon: Building2 },
];

/* ── Page title map ───────────────────────────────────── */
const pageTitles: Record<string, string> = {
  "/admin/dashboard":      "Dashboard",
  "/admin/events":         "My Events",
  "/admin/events/create":  "Create Event",
  "/admin/recruitment":    "Recruitment",
  "/admin/members":        "Members",
  "/admin/profile":        "Club Profile",
};

/* ── Layout ────────────────────────────────────────────── */
export default function AdminLayout({
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
      <aside className="hidden md:flex w-[228px] flex-col bg-[#101828] border-r border-[#1d2b3a] h-full shrink-0 z-20">

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
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-[600] transition-all duration-200 relative overflow-hidden",
                  isActive
                    ? "bg-[rgba(13,115,119,0.18)] text-[#4ecdc4]"
                    : "text-[rgba(255,255,255,0.45)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]"
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
        <div className="p-4 border-t border-[#1d2b3a]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-[#0D7377] flex items-center justify-center text-white text-[11px] font-syne font-[700]">
              AR
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-syne font-[700] text-white leading-tight">Arif Rahman</span>
              <span className="text-[11px] text-[rgba(255,255,255,0.4)]">Club Admin</span>
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

          {/* Right: bell + avatar */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-8 h-8 flex items-center justify-center text-[#8896b0] hover:text-[#0D7377] hover:bg-[#e6f4f5] rounded-[8px] transition-colors"
            >
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-[5px] right-[5px] w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
            </button>
            <Link
              href="/admin/profile"
              className="w-8 h-8 rounded-full bg-[#0D7377] flex items-center justify-center text-white font-syne font-[700] text-[11px] shadow-sm"
            >
              AR
            </Link>
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
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
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
    </div>
  );
}
