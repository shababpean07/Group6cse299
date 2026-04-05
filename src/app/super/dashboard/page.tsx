"use client";

import Link from "next/link";
import {
  Building2,
  Users,
  Clock,
  Calendar,
  UserPlus,
  MapPin,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const kpiCards = [
  {
    icon: Building2,
    value: "40",
    label: "Registered Clubs",
    iconColor: "#0D7377",
    iconBg: "#e6f4f5",
  },
  {
    icon: Users,
    value: "1,240",
    label: "Student Accounts",
    iconColor: "#0D7377",
    iconBg: "#e6f4f5",
  },
  {
    icon: Clock,
    value: "5",
    label: "Events Awaiting Review",
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
  },
  {
    icon: Calendar,
    value: "18",
    label: "Scheduled Events",
    iconColor: "#0D7377",
    iconBg: "#e6f4f5",
  },
  {
    icon: UserPlus,
    value: "7",
    label: "Active Cycles",
    iconColor: "#22c55e",
    iconBg: "#dcfce7",
  },
];

const pendingEvents = [
  {
    name: "Intra-University Hackathon",
    club: "NSU ACM SC",
    day: "10",
    month: "Mar",
    venue: "LIB 602",
    conflict: false,
  },
  {
    name: "Spring Fest Stage Show",
    club: "NSU Drama Club",
    day: "10",
    month: "Mar",
    venue: "Open Air Theatre",
    conflict: true,
  },
  {
    name: "Robot Showcase 2026",
    club: "NSU Robotics Club",
    day: "14",
    month: "Mar",
    venue: "Plaza Area",
    conflict: false,
  },
];

const activities = [
  { color: "#22c55e", text: 'NSU ACM SC submitted "Hackathon" for approval', time: "2h ago" },
  { color: "#0D7377", text: "New student registered: alif.shahriar@northsouth.edu", time: "3h ago" },
  { color: "#F59E0B", text: "NSU Finance Club opened recruitment cycle", time: "5h ago" },
  { color: "#EF4444", text: '"Spring Gala" rejected by Super Admin', time: "1d ago" },
  { color: "#22c55e", text: '"Brandverse 2026" approved and published', time: "1d ago" },
];

const clubHealth = [
  { name: "NSU ACM SC", members: "1,250", fill: 72, healthy: true },
  { name: "NSU Drama Club", members: "420", fill: 55, healthy: true },
  { name: "NSU Finance Club", members: "680", fill: 38, healthy: false },
  { name: "NSU Robotics", members: "850", fill: 20, healthy: false },
  { name: "NSU Photography", members: "630", fill: 80, healthy: true },
];

const announcements = [
  { title: "Spring Fest 2026 registrations are now open", status: "Live" as const, date: "Mar 1" },
  { title: "Updated Code of Conduct for all clubs", status: "Live" as const, date: "Feb 20" },
  { title: "Mid-semester break event guidelines", status: "Draft" as const, date: "—" },
];

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function SuperDashboardPage() {
  return (
    <div className="flex flex-col gap-8 pb-10">

      {/* ── PAGE HEADER ───────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up opacity-0"
        style={{ animationDelay: "0s", animationFillMode: "both" }}
      >
        <div>
          <h1 className="font-syne font-[800] text-[22px] text-[#0f1828] mb-1">
            Platform Overview
          </h1>
          <p className="text-[14px] text-[#8896b0]">
            NSU ClubHub · Spring 2026 · All clubs and events
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/super/announcements"
            className="flex items-center gap-2 h-10 px-5 bg-[#0D7377] text-white rounded-[8px] font-syne font-[700] text-[13px] hover:bg-[#0a5c60] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
          >
            ＋ Post Announcement
          </Link>
          <Link
            href="/super/approvals"
            className="flex items-center gap-2 h-10 px-5 bg-white border-[1.5px] border-[#0D7377] text-[#0D7377] rounded-[8px] font-syne font-[700] text-[13px] hover:bg-[#e6f4f5] transition-all relative"
          >
            Review Events
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#EF4444] text-white text-[10px] font-[700] rounded-full flex items-center justify-center">
              5
            </span>
          </Link>
        </div>
      </div>

      {/* ── KPI STAT ROW ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((card, i) => (
          <div
            key={card.label}
            className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-5 flex flex-col gap-3 hover:border-[#0D7377] hover:shadow-[0_8px_24px_rgba(13,115,119,0.12)] hover:-translate-y-[2px] transition-all duration-200 animate-fade-up opacity-0"
            style={{ animationDelay: `${0.07 * (i + 1)}s`, animationFillMode: "both" }}
          >
            <div
              className="w-9 h-9 rounded-[9px] flex items-center justify-center"
              style={{ backgroundColor: card.iconBg }}
            >
              <card.icon className="w-[18px] h-[18px]" style={{ color: card.iconColor }} />
            </div>
            <div>
              <p className="font-syne font-[700] text-[28px] text-[#0f1828] leading-none">
                {card.value}
              </p>
              <p className="text-[12px] text-[#8896b0] mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── TWO-COLUMN LAYOUT ─────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT COL (60%) */}
        <div className="flex flex-col gap-6 lg:w-[60%]">

          {/* Pending Event Approvals */}
          <section
            className="animate-fade-up opacity-0"
            style={{ animationDelay: "0.21s", animationFillMode: "both" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-[700] text-[16px] text-[#0f1828]">
                Pending Event Approvals
              </h2>
              <Link
                href="/super/approvals"
                className="text-[13px] font-[600] text-[#0D7377] hover:underline flex items-center gap-1"
              >
                View All <span aria-hidden>&rarr;</span>
              </Link>
            </div>

            {/* Amber urgency banner */}
            <div
              className="bg-[#FEF3C7] border-l-[4px] border-[#F59E0B] rounded-[8px] p-3 mb-4 animate-fade-up opacity-0"
              style={{ animationDelay: "0.14s", animationFillMode: "both" }}
            >
              <p className="text-[13px] font-[600] text-[#92400e]">
                5 events are awaiting your approval. Clubs cannot publish until approved.
              </p>
            </div>

            {/* Event rows */}
            <div className="flex flex-col gap-3">
              {pendingEvents.map((evt) => (
                <div
                  key={evt.name}
                  className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[10px] p-4 flex items-center gap-4 hover:border-[#0D7377] hover:shadow-[0_8px_24px_rgba(13,115,119,0.12)] hover:-translate-y-[2px] transition-all duration-200"
                >
                  {/* Date block */}
                  <div className="w-12 h-12 rounded-[8px] bg-[#e6f4f5] flex flex-col items-center justify-center shrink-0">
                    <span className="font-syne font-[700] text-[18px] text-[#0D7377] leading-none">
                      {evt.day}
                    </span>
                    <span className="text-[9px] font-[700] uppercase text-[#8896b0] tracking-wider">
                      {evt.month}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-syne font-[700] text-[13px] text-[#0f1828] truncate">
                      {evt.name}
                    </p>
                    <p className="text-[12px] text-[#8896b0] mt-0.5">{evt.club}</p>
                    <p className="text-[11px] text-[#aab4c8] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {evt.venue}
                    </p>
                  </div>

                  {/* Right: conflict chip + review link */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {evt.conflict && (
                      <span className="text-[10px] font-[700] px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center gap-1">
                        ⚠ CONFLICT
                      </span>
                    )}
                    <Link
                      href="/super/approvals"
                      className="text-[12px] font-[600] text-[#0D7377] hover:underline"
                    >
                      Review &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Platform Activity */}
          <section
            className="animate-fade-up opacity-0"
            style={{ animationDelay: "0.28s", animationFillMode: "both" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-[700] text-[16px] text-[#0f1828]">Platform Activity</h2>
              <Link
                href="/super/audit"
                className="text-[13px] font-[600] text-[#0D7377] hover:underline flex items-center gap-1"
              >
                View Audit <span aria-hidden>&rarr;</span>
              </Link>
            </div>

            <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-5 flex flex-col gap-4">
              {activities.map((act, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-3",
                    i !== activities.length - 1 && "border-b border-[#e8ecf2] pb-4"
                  )}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: act.color }}
                  />
                  <p className="flex-1 text-[13px] text-[#0f1828] leading-snug">{act.text}</p>
                  <span className="text-[11px] text-[#aab4c8] whitespace-nowrap shrink-0 ml-3">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COL (40%) */}
        <div
          className="flex flex-col gap-6 lg:w-[40%] animate-fade-up opacity-0"
          style={{ animationDelay: "0.28s", animationFillMode: "both" }}
        >

          {/* Club Health */}
          <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-5 flex flex-col gap-5">
            <h2 className="font-syne font-[700] text-[15px] text-[#0f1828]">Club Health</h2>

            <div className="flex flex-col gap-4">
              {clubHealth.map((club) => (
                <div key={club.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-[600] text-[#0f1828]">{club.name}</p>
                      <p className="text-[11px] text-[#8896b0]">{club.members} members</p>
                    </div>
                    <span
                      className={cn(
                        "text-[12px] font-[700]",
                        club.healthy ? "text-[#0D7377]" : "text-[#F59E0B]"
                      )}
                    >
                      {club.fill}% full
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#e8ecf2] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${club.fill}%`,
                        backgroundColor: club.healthy ? "#0D7377" : "#F59E0B",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/super/clubs"
              className="text-[13px] font-[600] text-[#0D7377] hover:underline mt-1"
            >
              View All 40 Clubs &rarr;
            </Link>
          </div>

          {/* Announcements */}
          <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-syne font-[700] text-[15px] text-[#0f1828]">Announcements</h2>
              <Link
                href="/super/announcements"
                className="text-[13px] font-[600] text-[#0D7377] hover:underline"
              >
                ＋ New
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {announcements.map((ann, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 py-2",
                    i !== announcements.length - 1 && "border-b border-[#e8ecf2]"
                  )}
                >
                  <Megaphone className="w-4 h-4 text-[#8896b0] shrink-0" />
                  <p className="flex-1 text-[13px] text-[#0f1828] truncate">{ann.title}</p>
                  <span
                    className={cn(
                      "text-[10px] font-[700] px-2 py-0.5 rounded-full shrink-0",
                      ann.status === "Live"
                        ? "bg-[#dcfce7] text-[#22c55e]"
                        : "bg-[#f5f6fa] text-[#8896b0]"
                    )}
                  >
                    {ann.status}
                  </span>
                  <span className="text-[11px] text-[#aab4c8] shrink-0 w-10 text-right">
                    {ann.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
