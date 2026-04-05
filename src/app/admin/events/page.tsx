"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════════ */

type EventStatus = "Pending Approval" | "Approved" | "Draft" | "Rejected";

interface EventRow {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  isOnline: boolean;
  status: EventStatus;
  rejectionReason?: string;
}

const STATUS_FILTERS: { label: string; value: EventStatus | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Pending Approval", value: "Pending Approval" },
  { label: "Approved", value: "Approved" },
  { label: "Draft", value: "Draft" },
  { label: "Rejected", value: "Rejected" },
];

const STATUS_STYLES: Record<EventStatus, { bg: string; text: string }> = {
  "Pending Approval": { bg: "bg-[#FEF3C7]", text: "text-[#F59E0B]" },
  Approved: { bg: "bg-[#dcfce7]", text: "text-[#22c55e]" },
  Draft: { bg: "bg-[#f5f6fa]", text: "text-[#8896b0]" },
  Rejected: { bg: "bg-[#fee2e2]", text: "text-[#EF4444]" },
};

const MOCK_EVENTS: EventRow[] = [
  {
    id: "1",
    name: "Intra-University Hackathon",
    type: "Competition",
    date: "2026-03-10",
    time: "09:00",
    venue: "LIB 602",
    isOnline: false,
    status: "Pending Approval",
  },
  {
    id: "2",
    name: "Competitive Programming Bootcamp",
    type: "Workshop",
    date: "2026-03-18",
    time: "10:00",
    venue: "NAC 201",
    isOnline: false,
    status: "Approved",
  },
  {
    id: "3",
    name: "AI Workshop: Intro to LLMs",
    type: "Workshop",
    date: "2026-04-02",
    time: "14:00",
    venue: "Online",
    isOnline: true,
    status: "Draft",
  },
  {
    id: "4",
    name: "NSU Tech Carnival 2026",
    type: "Competition",
    date: "2026-04-14",
    time: "11:00",
    venue: "Plaza Area",
    isOnline: false,
    status: "Approved",
  },
  {
    id: "5",
    name: "Git & GitHub for Beginners",
    type: "Seminar",
    date: "2026-02-22",
    time: "15:00",
    venue: "NAC 301",
    isOnline: false,
    status: "Approved",
  },
  {
    id: "6",
    name: "Code Review Session",
    type: "Workshop",
    date: "2026-03-28",
    time: "13:00",
    venue: "NAC 201",
    isOnline: false,
    status: "Rejected",
    rejectionReason:
      "Event conflicts with the Spring Fest on the same date. Please reschedule to the following week.",
  },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

function formatEventDate(iso: string, time: string) {
  const d = new Date(iso + "T00:00:00");
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();
  const year = d.getFullYear();
  let timeStr = "";
  if (time) {
    const [h, m] = time.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    timeStr = ` · ${h12}:${m} ${ampm}`;
  }
  return `${month} ${day}, ${year}${timeStr}`;
}

/* ═══════════════════════════════════════════════════════════
   DELETE CONFIRMATION DIALOG
   ═══════════════════════════════════════════════════════════ */

function DeleteDialog({
  eventName,
  onCancel,
  onConfirm,
}: {
  eventName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-[16px] shadow-2xl max-w-[400px] w-full mx-4 p-6 animate-fade-up"
        style={{ animationFillMode: "both" }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#fee2e2] flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6 text-[#EF4444]" />
          </div>
          <h3 className="font-syne font-[700] text-[18px] text-[#0f1828] mb-2">
            Delete Event?
          </h3>
          <p className="text-[13px] text-[#8896b0] mb-6 leading-relaxed">
            Are you sure you want to delete &ldquo;{eventName}&rdquo;? This
            action cannot be undone.
          </p>
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 h-10 rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#8896b0] font-syne font-[700] text-[13px] hover:bg-[#f5f6fa] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-10 bg-[#EF4444] text-white rounded-[8px] font-syne font-[700] text-[13px] hover:bg-[#dc2626] transition-all shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function MyEventsPage() {
  const [activeFilter, setActiveFilter] = useState<EventStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [expandedRejection, setExpandedRejection] = useState<string | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<EventRow | null>(null);
  const [events, setEvents] = useState<EventRow[]>(MOCK_EVENTS);

  /* ── Filtering ─────────────────────────────────────── */
  const filtered = events.filter((e) => {
    if (activeFilter !== "All" && e.status !== activeFilter) return false;
    if (
      search.trim() &&
      !e.name.toLowerCase().includes(search.trim().toLowerCase())
    )
      return false;
    return true;
  });

  /* ── Delete handler ────────────────────────────────── */
  const confirmDelete = () => {
    if (!deleteTarget) return;
    setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <>
      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <DeleteDialog
          eventName={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      <div className="flex flex-col gap-6 pb-10">
        {/* ── PAGE HEADER ──────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up opacity-0"
          style={{ animationDelay: "0s", animationFillMode: "both" }}
        >
          <div>
            <h1 className="font-syne font-[800] text-[22px] text-[#0f1828] mb-1">
              My Events
            </h1>
            <p className="text-[14px] text-[#8896b0]">
              All events created by NSU ACM SC
            </p>
          </div>
          <Link
            href="/admin/events/create"
            className="inline-flex items-center gap-2 h-10 px-5 bg-[#0D7377] text-white rounded-[8px] font-syne font-[700] text-[13px] hover:bg-[#0a5c60] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm w-fit"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        </div>

        {/* ── FILTER BAR ───────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-up opacity-0"
          style={{ animationDelay: "0.07s", animationFillMode: "both" }}
        >
          {/* Status chips */}
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={cn(
                  "h-8 px-3.5 rounded-[8px] text-[12px] font-[600] border-[1.5px] transition-all duration-150",
                  activeFilter === f.value
                    ? "bg-[#0D7377] text-white border-[#0D7377]"
                    : "bg-white text-[#8896b0] border-[#e8ecf2] hover:border-[#0D7377] hover:text-[#0D7377]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aab4c8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full h-9 rounded-[8px] border-[1.5px] border-[#e8ecf2] pl-9 pr-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all bg-white"
            />
          </div>
        </div>

        {/* ── EVENTS TABLE (Desktop) ───────────────────────── */}
        <div
          className="animate-fade-up opacity-0"
          style={{ animationDelay: "0.14s", animationFillMode: "both" }}
        >
          {filtered.length === 0 ? (
            /* Empty state */
            <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] py-16 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border-[2px] border-dashed border-[#e8ecf2] flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-[#aab4c8]" />
              </div>
              <p className="font-syne font-[700] text-[15px] text-[#0f1828] mb-1">
                No events found
              </p>
              <Link
                href="/admin/events/create"
                className="text-[13px] font-[600] text-[#0D7377] hover:underline mt-1"
              >
                Create your first event &rarr;
              </Link>
            </div>
          ) : (
            <>
              {/* ── Desktop table ── */}
              <div className="hidden md:block bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f5f6fa] border-b border-[#e8ecf2]">
                      <th className="text-left px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                        Event Name
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                        Date
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                        Venue
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                        Status
                      </th>
                      <th className="text-right px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((event) => (
                      <TableRow
                        key={event.id}
                        event={event}
                        isRejectionExpanded={expandedRejection === event.id}
                        onToggleRejection={() =>
                          setExpandedRejection(
                            expandedRejection === event.id ? null : event.id
                          )
                        }
                        onDelete={() => setDeleteTarget(event)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile cards ── */}
              <div className="flex flex-col gap-3 md:hidden">
                {filtered.map((event) => (
                  <MobileCard
                    key={event.id}
                    event={event}
                    isRejectionExpanded={expandedRejection === event.id}
                    onToggleRejection={() =>
                      setExpandedRejection(
                        expandedRejection === event.id ? null : event.id
                      )
                    }
                    onDelete={() => setDeleteTarget(event)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   TABLE ROW (Desktop)
   ═══════════════════════════════════════════════════════════ */

function TableRow({
  event,
  isRejectionExpanded,
  onToggleRejection,
  onDelete,
}: {
  event: EventRow;
  isRejectionExpanded: boolean;
  onToggleRejection: () => void;
  onDelete: () => void;
}) {
  const style = STATUS_STYLES[event.status];

  return (
    <>
      <tr className="border-b border-[#e8ecf2] group hover:bg-[#fafafc] transition-colors">
        {/* Event Name */}
        <td className="px-5 py-4">
          <p className="font-syne font-[700] text-[13px] text-[#0f1828] leading-tight">
            {event.name}
          </p>
          <span className="inline-block mt-1.5 text-[10px] font-[600] text-[#8896b0] bg-[#f5f6fa] px-2 py-0.5 rounded-full">
            {event.type}
          </span>
        </td>

        {/* Date */}
        <td className="px-5 py-4 text-[13px] text-[#0f1828] whitespace-nowrap">
          {formatEventDate(event.date, event.time)}
        </td>

        {/* Venue */}
        <td className="px-5 py-4">
          <span className="flex items-center gap-1.5 text-[13px] text-[#8896b0]">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {event.venue}
          </span>
        </td>

        {/* Status */}
        <td className="px-5 py-4">
          <span
            className={cn(
              "inline-block text-[11px] font-[700] px-2.5 py-1 rounded-full",
              style.bg,
              style.text
            )}
          >
            {event.status}
          </span>
          {event.status === "Rejected" && event.rejectionReason && (
            <button
              onClick={onToggleRejection}
              className="block mt-1 text-[11px] font-[600] text-[#EF4444] hover:underline"
            >
              {isRejectionExpanded ? "Hide Reason" : "See Reason"}
            </button>
          )}
        </td>

        {/* Actions */}
        <td className="px-5 py-4">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href="/admin/events/create"
              className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#8896b0] hover:text-[#0D7377] hover:bg-[#e6f4f5] transition-colors"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </Link>
            <button
              onClick={onDelete}
              className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#8896b0] hover:text-[#EF4444] hover:bg-[#fee2e2] transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#8896b0] hover:text-[#0D7377] hover:bg-[#e6f4f5] transition-colors"
              title="Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Rejection reason expanded row */}
      {isRejectionExpanded && event.rejectionReason && (
        <tr>
          <td colSpan={5} className="px-0 py-0">
            <div className="bg-[#fee2e2] border-l-4 border-[#EF4444] px-5 py-4 rounded-b-[12px]">
              <p className="text-[11px] font-[700] text-[#EF4444] uppercase tracking-[0.04em] mb-1.5">
                Rejection Reason from Super Admin:
              </p>
              <p className="text-[13px] text-[#0f1828] leading-relaxed mb-3">
                {event.rejectionReason}
              </p>
              <Link
                href="/admin/events/create"
                className="inline-flex items-center gap-1.5 h-8 px-4 rounded-[8px] border-[1.5px] border-[#EF4444] text-[#EF4444] font-syne font-[700] text-[12px] hover:bg-[#EF4444] hover:text-white transition-all"
              >
                Edit & Resubmit
              </Link>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   MOBILE CARD
   ═══════════════════════════════════════════════════════════ */

function MobileCard({
  event,
  isRejectionExpanded,
  onToggleRejection,
  onDelete,
}: {
  event: EventRow;
  isRejectionExpanded: boolean;
  onToggleRejection: () => void;
  onDelete: () => void;
}) {
  const style = STATUS_STYLES[event.status];

  return (
    <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] overflow-hidden">
      <div className="p-4">
        {/* Top: name + status */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <p className="font-syne font-[700] text-[14px] text-[#0f1828] leading-tight truncate">
              {event.name}
            </p>
            <span className="inline-block mt-1 text-[10px] font-[600] text-[#8896b0] bg-[#f5f6fa] px-2 py-0.5 rounded-full">
              {event.type}
            </span>
          </div>
          <span
            className={cn(
              "inline-block text-[10px] font-[700] px-2.5 py-1 rounded-full shrink-0",
              style.bg,
              style.text
            )}
          >
            {event.status}
          </span>
        </div>

        {/* Date + venue */}
        <div className="flex flex-col gap-1 mt-3 mb-3">
          <span className="text-[12px] text-[#8896b0]">
            {formatEventDate(event.date, event.time)}
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-[#8896b0]">
            <MapPin className="w-3 h-3 shrink-0" />
            {event.venue}
          </span>
        </div>

        {/* Rejected: see reason */}
        {event.status === "Rejected" && event.rejectionReason && (
          <button
            onClick={onToggleRejection}
            className="text-[11px] font-[600] text-[#EF4444] hover:underline mb-3"
          >
            {isRejectionExpanded ? "Hide Reason" : "See Reason"}
          </button>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#e8ecf2]">
          <Link
            href="/admin/events/create"
            className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#8896b0] text-[12px] font-[600] hover:border-[#0D7377] hover:text-[#0D7377] transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Link>
          <button
            onClick={onDelete}
            className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#8896b0] text-[12px] font-[600] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Rejection reason expanded */}
      {isRejectionExpanded && event.rejectionReason && (
        <div className="bg-[#fee2e2] border-l-4 border-[#EF4444] px-4 py-3">
          <p className="text-[11px] font-[700] text-[#EF4444] uppercase tracking-[0.04em] mb-1">
            Rejection Reason:
          </p>
          <p className="text-[12px] text-[#0f1828] leading-relaxed mb-2.5">
            {event.rejectionReason}
          </p>
          <Link
            href="/admin/events/create"
            className="inline-flex items-center gap-1.5 h-7 px-3 rounded-[6px] border-[1.5px] border-[#EF4444] text-[#EF4444] font-syne font-[700] text-[11px] hover:bg-[#EF4444] hover:text-white transition-all"
          >
            Edit & Resubmit
          </Link>
        </div>
      )}
    </div>
  );
}
