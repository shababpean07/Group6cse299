"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  Inbox,
  UserPlus,
  ChevronRight,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const kpiCards = [
  {
    icon: Users,
    value: "142",
    label: "Registered Members",
    iconColor: "#0D7377",
    iconBg: "#e6f4f5",
  },
  {
    icon: Calendar,
    value: "3",
    label: "Events This Month",
    iconColor: "#0D7377",
    iconBg: "#e6f4f5",
  },
  {
    icon: Inbox,
    value: "18",
    label: "Pending Applications",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
  {
    icon: UserPlus,
    value: "Open",
    label: "Recruitment Cycle",
    iconColor: "#22c55e",
    iconBg: "#dcfce7",
  },
];

const events = [
  {
    name: "Intra-University Hackathon",
    day: "10",
    month: "Mar",
    venue: "LIB 602",
    status: "Pending Approval" as const,
  },
  {
    name: "Competitive Programming Bootcamp",
    day: "18",
    month: "Mar",
    venue: "NAC 201",
    status: "Approved" as const,
  },
  {
    name: "AI Workshop: Intro to LLMs",
    day: "02",
    month: "Apr",
    venue: "Online",
    status: "Draft" as const,
  },
];

const statusStyle = {
  "Pending Approval": "bg-[#FEF3C7] text-[#F59E0B]",
  Approved: "bg-[#dcfce7] text-[#22c55e]",
  Draft: "bg-[#f5f6fa] text-[#8896b0]",
} as const;

const applicants = [
  { name: "Farhan Ahmed",   id: "2212345", role: "General Member",  status: "New" as const,       date: "Mar 4" },
  { name: "Sadia Islam",    id: "2213456", role: "Technical Team",  status: "Interview" as const,  date: "Mar 3" },
  { name: "Nusrat Jahan",   id: "2214567", role: "General Member",  status: "Accepted" as const,   date: "Mar 1" },
  { name: "Rakib Hossain",  id: "2215678", role: "PR Team",         status: "New" as const,        date: "Mar 4" },
  { name: "Tanjim Hossain", id: "2216789", role: "Event Team",      status: "Rejected" as const,   date: "Feb 28" },
];

const appStatusStyle = {
  New:       "bg-[#e6f4f5] text-[#0D7377]",
  Interview: "bg-[#FEF3C7] text-[#F59E0B]",
  Accepted:  "bg-[#dcfce7] text-[#22c55e]",
  Rejected:  "bg-[#fee2e2] text-[#EF4444]",
} as const;

const quickActions = [
  { emoji: "\uD83D\uDCC5", label: "Create New Event",       href: "/admin/events/create" },
  { emoji: "\uD83D\uDC65", label: "View All Members",       href: "/admin/members" },
  { emoji: "\uD83D\uDCCB", label: "Edit Club Profile",      href: "/admin/profile" },
  { emoji: "\u2699\uFE0F",  label: "Recruitment Settings",  href: "/admin/recruitment/settings" },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-8 pb-10">

      {/* ── PAGE HEADER ───────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up opacity-0"
        style={{ animationDelay: "0s", animationFillMode: "both" }}
      >
        <div>
          <h1 className="font-syne font-[800] text-[22px] text-[#0f1828] mb-1">
            Good morning, Arif 👋
          </h1>
          <p className="text-[14px] text-[#8896b0]">
            Here&apos;s what&apos;s happening with NSU ACM SC today.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/events/create")}
          className="flex items-center gap-2 h-10 px-5 bg-[#0D7377] text-white rounded-[8px] font-syne font-[700] text-[13px] hover:bg-[#0a5c60] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Event
        </button>
      </div>

      {/* ── KPI STAT ROW ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* My Events */}
          <section
            className="animate-fade-up opacity-0"
            style={{ animationDelay: "0.14s", animationFillMode: "both" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-[700] text-[16px] text-[#0f1828]">My Events</h2>
              <Link
                href="/admin/events"
                className="text-[13px] font-[600] text-[#0D7377] hover:underline flex items-center gap-1"
              >
                View All <span aria-hidden>&rarr;</span>
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {events.map((evt) => (
                <div
                  key={evt.name}
                  className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-4 flex items-center gap-4 hover:border-[#0D7377] hover:shadow-[0_8px_24px_rgba(13,115,119,0.12)] hover:-translate-y-[2px] transition-all duration-200"
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
                    <p className="font-syne font-[700] text-[14px] text-[#0f1828] truncate">
                      {evt.name}
                    </p>
                    <p className="text-[12px] text-[#8896b0] mt-0.5 flex items-center gap-2">
                      <span className="inline-block px-2 py-0.5 bg-[#f5f6fa] rounded text-[10px] font-[600] text-[#8896b0]">
                        ACM SC
                      </span>
                      {evt.venue}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span
                    className={cn(
                      "text-[11px] font-[700] px-3 py-1 rounded-full shrink-0 whitespace-nowrap",
                      statusStyle[evt.status]
                    )}
                  >
                    {evt.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Applications */}
          <section
            className="animate-fade-up opacity-0"
            style={{ animationDelay: "0.21s", animationFillMode: "both" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-[700] text-[16px] text-[#0f1828]">Recent Applications</h2>
              <Link
                href="/admin/recruitment"
                className="text-[13px] font-[600] text-[#0D7377] hover:underline flex items-center gap-1"
              >
                View All <span aria-hidden>&rarr;</span>
              </Link>
            </div>

            <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] overflow-hidden">
              {applicants.map((a, i) => (
                <div
                  key={a.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 hover:bg-[#f9fafb] transition-colors",
                    i !== applicants.length - 1 && "border-b border-[#e8ecf2]"
                  )}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#e6f4f5] flex items-center justify-center text-[11px] font-[700] text-[#0D7377] shrink-0">
                    {getInitials(a.name)}
                  </div>

                  {/* Name + ID */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-[600] text-[#0f1828] truncate">{a.name}</p>
                    <p className="text-[11px] text-[#aab4c8]">{a.id}</p>
                  </div>

                  {/* Position */}
                  <span className="hidden sm:block text-[12px] text-[#8896b0] w-[120px] truncate">
                    {a.role}
                  </span>

                  {/* Status chip */}
                  <span
                    className={cn(
                      "text-[10px] font-[700] px-2.5 py-0.5 rounded-full shrink-0",
                      appStatusStyle[a.status]
                    )}
                  >
                    {a.status}
                  </span>

                  {/* Date */}
                  <span className="hidden sm:block text-[11px] text-[#aab4c8] w-[52px] text-right shrink-0">
                    {a.date}
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

          {/* Recruitment Snapshot */}
          <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-5 flex flex-col gap-5">
            <h2 className="font-syne font-[700] text-[16px] text-[#0f1828]">Recruitment Snapshot</h2>

            {/* Deadline row */}
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-[#0f1828] font-[500]">
                Closes <span className="font-[700]">Mar 28, 2026</span>
              </p>
              <span className="text-[12px] font-[700] text-[#F59E0B] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">
                17 days left
              </span>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] text-[#8896b0]">18 of 50 slots filled</span>
                <span className="text-[12px] font-[700] text-[#0D7377]">36%</span>
              </div>
              <div className="w-full h-2 bg-[#e8ecf2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0D7377] rounded-full transition-all duration-500"
                  style={{ width: "36%" }}
                />
              </div>
            </div>

            {/* Stat pills */}
            <div className="flex items-center gap-2">
              <span className="flex-1 text-center py-2 rounded-[8px] bg-[#e6f4f5] text-[12px] font-[700] text-[#0D7377]">
                18 Applied
              </span>
              <span className="flex-1 text-center py-2 rounded-[8px] bg-[#FEF3C7] text-[12px] font-[700] text-[#F59E0B]">
                4 Interviewed
              </span>
              <span className="flex-1 text-center py-2 rounded-[8px] bg-[#dcfce7] text-[12px] font-[700] text-[#22c55e]">
                2 Accepted
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push("/admin/recruitment")}
              className="w-full h-10 rounded-[8px] border-[1.5px] border-[#0D7377] text-[#0D7377] font-syne font-[700] text-[13px] hover:bg-[#e6f4f5] transition-colors flex items-center justify-center gap-1"
            >
              Manage Applications <span aria-hidden>&rarr;</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-5">
            <h2 className="font-syne font-[700] text-[14px] text-[#0f1828] mb-2">Quick Actions</h2>

            <div className="flex flex-col">
              {quickActions.map((action, i) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={cn(
                    "flex items-center gap-3 py-3 hover:bg-[#f5f6fa] -mx-2 px-2 rounded-[6px] transition-colors",
                    i !== quickActions.length - 1 && "border-b border-[#e8ecf2]"
                  )}
                >
                  <span className="text-[16px] leading-none">{action.emoji}</span>
                  <span className="flex-1 text-[13px] font-[600] text-[#0f1828]">
                    {action.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#aab4c8]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
