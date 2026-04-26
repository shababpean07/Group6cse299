"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  AlertTriangle,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { eventsApi } from "@/lib/api";

type EventStatus = "Pending" | "Conflict" | "Approved" | "Rejected";

interface EventType {
  id: string;
  name: string;
  club: string;
  date: string;
  month: string;
  year: string;
  time: string;
  venue: string;
  expectedAttendance: number;
  submittedBy: string;
  submittedDate: string;
  submittedTime: string;
  status: EventStatus;
  conflictWith?: {
    name: string;
    club: string;
    venue: string;
  };
}

type FilterType = "All" | "Pending" | "Conflicting" | "Approved" | "Rejected";

function transformApiEvent(apiEvent: any): EventType {
  const startDate = new Date(apiEvent.startDate);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const submittedDate = new Date(apiEvent.createdAt);
  
  let status: EventStatus = "Pending";
  if (apiEvent.status === "APPROVED") status = "Approved";
  else if (apiEvent.status === "REJECTED") status = "Rejected";
  else if (apiEvent.status === "PENDING_APPROVAL") status = "Pending";

  return {
    id: apiEvent.id,
    name: apiEvent.title,
    club: apiEvent.club?.name || "Unknown Club",
    date: String(startDate.getDate()),
    month: months[startDate.getMonth()],
    year: String(startDate.getFullYear()),
    time: startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    venue: apiEvent.venue || "TBD",
    expectedAttendance: apiEvent._count?.rsvps || 50,
    submittedBy: apiEvent.creator?.name || "Unknown",
    submittedDate: submittedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    submittedTime: submittedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    status,
  };
}

/* ═══════════════════════════════════════════════════════════
   CONFLICT MODAL
   ═══════════════════════════════════════════════════════════ */

function ConflictModal({
  event,
  onConfirm,
  onCancel,
}: {
  event: EventType;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [checked, setChecked] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-up opacity-0"
      style={{ animationFillMode: "both" }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-[16px] shadow-2xl max-w-[460px] w-full mx-4 p-6 relative animate-fade-up opacity-0"
        style={{ animationDelay: "0.07s", animationFillMode: "both" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-[#f5f6fa] transition-colors"
        >
          <X className="w-4 h-4 text-[#8896b0]" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-[12px] bg-[#FEF3C7] flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-[#F59E0B]" />
        </div>

        {/* Title */}
        <h2 className="font-syne font-[700] text-[18px] text-[#0f1828] mb-2">
          Confirm Approval Despite Conflict
        </h2>

        {/* Body */}
        <p className="text-[13px] text-[#8896b0] leading-relaxed mb-4">
          You are approving &quot;{event.name}&quot; on {event.month} {event.date} — the same date
          as &quot;{event.conflictWith?.name}&quot; by {event.conflictWith?.club}. Both events will appear
          on the student calendar. This action will be logged in the audit trail.
        </p>

        {/* Checkbox */}
        <label className="flex items-start gap-2 mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-[#e8ecf2] text-[#D97706] focus:ring-[#D97706] focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-[12px] font-[600] text-[#0f1828] leading-snug">
            I have reviewed the conflict and confirm this approval.
          </span>
        </label>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#0f1828] font-syne font-[700] text-[13px] hover:bg-[#f5f6fa] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!checked}
            className={cn(
              "flex-1 h-10 rounded-[8px] font-syne font-[700] text-[13px] text-white transition-all",
              checked
                ? "bg-[#D97706] hover:bg-[#b45309] hover:scale-[1.02]"
                : "bg-[#d4d8e0] cursor-not-allowed"
            )}
          >
            Approve Anyway
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EVENT CARD
   ═══════════════════════════════════════════════════════════ */

function EventCard({
  event,
  onApprove,
  onReject,
}: {
  event: EventType;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [proceedAnyway, setProceedAnyway] = useState(false);
  const [conflictModal, setConflictModal] = useState(false);

  const handleApprove = () => {
    if (event.status === "Conflict" && !proceedAnyway) {
      setConflictModal(true);
      return;
    }
    onApprove(event.id);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    onReject(event.id, rejectReason);
    setRejectOpen(false);
    setRejectReason("");
  };

  return (
    <>
      <div
        className={cn(
          "bg-white border-[1.5px] rounded-[12px] p-5 flex flex-col lg:flex-row gap-5 hover:border-[#0D7377] hover:shadow-[0_8px_24px_rgba(13,115,119,0.12)] hover:-translate-y-[2px] transition-all duration-200",
          event.status === "Conflict" && "border-l-[4px] border-l-[#F59E0B]"
        )}
      >
        {/* ZONE A — Event Info */}
        <div className="flex-1 min-w-0">
          {/* Top row: name + status */}
          <div className="flex items-start gap-3 mb-3">
            {/* Date block */}
            <div className="w-12 h-12 rounded-[8px] bg-[#e6f4f5] flex flex-col items-center justify-center shrink-0">
              <span className="font-syne font-[700] text-[18px] text-[#0D7377] leading-none">
                {event.date}
              </span>
              <span className="text-[9px] font-[700] uppercase text-[#8896b0] tracking-wider">
                {event.month}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-syne font-[700] text-[16px] text-[#0f1828] truncate">
                  {event.name}
                </h3>
                <span
                  className={cn(
                    "text-[10px] font-[700] px-2.5 py-0.5 rounded-full shrink-0",
                    event.status === "Pending" && "bg-[#e6f4f5] text-[#0D7377]",
                    event.status === "Conflict" && "bg-[#FEF3C7] text-[#D97706]",
                    event.status === "Approved" && "bg-[#dcfce7] text-[#22c55e]",
                    event.status === "Rejected" && "bg-[#fee2e2] text-[#EF4444]"
                  )}
                >
                  {event.status === "Conflict" ? "⚠ CONFLICT" : event.status}
                </span>
              </div>

              {/* Club chip + submitted info */}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="inline-block px-2.5 py-0.5 bg-[#e6f4f5] text-[#0D7377] text-[11px] font-[600] rounded-full">
                  {event.club}
                </span>
                <span className="text-[11px] text-[#aab4c8]">
                  Submitted by {event.submittedBy} · {event.submittedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Detail row */}
          <div className="flex items-center gap-5 mt-3 text-[12px] text-[#8896b0] flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {event.month} {event.date}, {event.year} · {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {event.venue}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {event.expectedAttendance} expected
            </span>
          </div>
        </div>

        {/* ZONE B — Conflict Warning */}
        {event.status === "Conflict" && event.conflictWith && (
          <div className="bg-[#FEF3C7] border-l-[3px] border-[#F59E0B] rounded-[6px] p-3 shrink-0 lg:w-[280px]">
            <p className="text-[12px] font-[600] text-[#92400e] leading-snug mb-2">
              ⚠ Conflict: {event.conflictWith.club} also has an event on {event.month} {event.date} ({event.conflictWith.venue}).
              Both events can coexist — but verify venue availability.
            </p>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={proceedAnyway}
                onChange={(e) => setProceedAnyway(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[#e8ecf2] text-[#D97706] focus:ring-[#D97706] focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[11px] font-[600] text-[#92400e]">Proceed anyway</span>
            </label>
          </div>
        )}

        {/* ZONE C — Action Panel */}
        <div className="lg:w-[220px] shrink-0 border-t lg:border-t-0 lg:border-l border-[#e8ecf2] pt-4 lg:pt-0 lg:pl-5 flex flex-col gap-3">
          {!rejectOpen ? (
            <>
              <button
                onClick={handleApprove}
                className="w-full h-10 rounded-[8px] bg-[#22c55e] text-white font-syne font-[700] text-[13px] hover:bg-[#16a34a] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => setRejectOpen(true)}
                className="w-full h-10 rounded-[8px] bg-white border-[1.5px] border-[#EF4444] text-[#EF4444] font-syne font-[700] text-[13px] hover:bg-[#fee2e2] transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 animate-fade-up opacity-0" style={{ animationFillMode: "both" }}>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Date conflict with university exam schedule..."
                className="w-full h-20 rounded-[8px] border-[1.5px] border-[#e8ecf2] p-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] resize-none focus:outline-none focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444] transition-colors"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className={cn(
                    "flex-1 h-10 rounded-[8px] font-syne font-[700] text-[13px] text-white transition-all",
                    rejectReason.trim()
                      ? "bg-[#EF4444] hover:bg-[#dc2626] hover:scale-[1.02]"
                      : "bg-[#d4d8e0] cursor-not-allowed"
                  )}
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => {
                    setRejectOpen(false);
                    setRejectReason("");
                  }}
                  className="h-10 px-4 rounded-[8px] text-[13px] font-[600] text-[#8896b0] hover:text-[#0f1828] hover:bg-[#f5f6fa] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Submission metadata */}
          <div className="text-[11px] text-[#aab4c8] space-y-0.5 pt-2 border-t border-[#e8ecf2]">
            <p>Submitted: {event.submittedDate}, {event.year} · {event.submittedTime}</p>
            <p>Club Admin: {event.submittedBy}</p>
          </div>
        </div>
      </div>

      {/* Conflict Confirmation Modal */}
      {conflictModal && (
        <ConflictModal
          event={event}
          onConfirm={() => {
            setConflictModal(false);
            onApprove(event.id);
          }}
          onCancel={() => setConflictModal(false)}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-up opacity-0" style={{ animationFillMode: "both" }}>
      {/* Dashed circle */}
      <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#e8ecf2] flex items-center justify-center mb-5">
        <Check className="w-8 h-8 text-[#22c55e]" />
      </div>
      <h2 className="font-syne font-[700] text-[18px] text-[#0f1828] mb-1">
        All caught up!
      </h2>
      <p className="text-[14px] text-[#8896b0] mb-5">
        No events are pending approval right now.
      </p>
      <a
        href="/super/approvals"
        className="text-[13px] font-[600] text-[#0D7377] hover:underline"
      >
        View Approved Events &rarr;
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function SuperApprovalsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [filter, setFilter] = useState<FilterType>("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsApi.getAll({});
        const transformed = data.map(transformApiEvent);
        setEvents(transformed);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === "SUPER_ADMIN") {
      fetchEvents();
    }
  }, [user]);

  const filters: FilterType[] = ["All", "Pending", "Conflicting", "Approved", "Rejected"];

  const filteredEvents = events.filter((evt) => {
    if (filter === "All") return true;
    if (filter === "Pending") return evt.status === "Pending";
    if (filter === "Conflicting") return evt.status === "Conflict";
    if (filter === "Approved") return evt.status === "Approved";
    if (filter === "Rejected") return evt.status === "Rejected";
    return true;
  });

  const hasConflicts = events.some((e) => e.status === "Conflict");

  const handleApprove = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Approved" as EventStatus } : e))
    );
  };

  const handleReject = (_id: string, _reason: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === _id ? { ...e, status: "Rejected" as EventStatus } : e))
    );
  };

  const pendingCount = events.filter((e) => e.status === "Pending" || e.status === "Conflict").length;

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* ── PAGE HEADER ───────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 animate-fade-up opacity-0"
        style={{ animationDelay: "0s", animationFillMode: "both" }}
      >
        <div>
          <h1 className="font-syne font-[800] text-[22px] text-[#0f1828] mb-1">
            Event Approval Queue
          </h1>
          <p className="text-[14px] text-[#8896b0]">
            Review and approve event submissions from club admins.
          </p>
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {filters.map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "h-8 px-3.5 rounded-full text-[12px] font-[600] transition-all",
                  isActive
                    ? "bg-[#0D7377] text-white"
                    : "bg-white border-[1.5px] border-[#e8ecf2] text-[#8896b0] hover:text-[#0f1828] hover:border-[#0D7377]"
                )}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── URGENCY BANNER ────────────────────────────── */}
      {hasConflicts && (
        <div
          className="bg-[#FEF3C7] border-l-[4px] border-[#F59E0B] rounded-[8px] p-4 flex items-start gap-3 animate-fade-up opacity-0"
          style={{ animationDelay: "0.07s", animationFillMode: "both" }}
        >
          <AlertTriangle className="w-[18px] h-[18px] text-[#F59E0B] shrink-0 mt-0.5" />
          <p className="text-[13px] font-[600] text-[#92400e] leading-snug">
            1 event conflict detected — two clubs have submitted events on the same date.
            Review carefully before approving.
          </p>
        </div>
      )}

      {/* ── EVENT CARDS ───────────────────────────────── */}
      {filteredEvents.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredEvents.map((evt, i) => (
            <div
              key={evt.id}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${0.07 * (i + 1)}s`, animationFillMode: "both" }}
            >
              <EventCard
                event={evt}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Pending count summary */}
      {pendingCount > 0 && (
        <div className="text-center text-[12px] text-[#aab4c8] pt-2">
          {pendingCount} event{pendingCount !== 1 ? "s" : ""} remaining in queue
        </div>
      )}
    </div>
  );
}
