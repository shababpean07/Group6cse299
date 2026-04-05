"use client";

import { useState } from "react";
import { CheckCircle2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

type AnnouncementStatus = "Live" | "Scheduled" | "Draft";
type FilterType = "All" | "Live" | "Scheduled" | "Draft";
type AudienceType = "All Students" | "Club Admins Only" | "All Users";

interface Announcement {
  id: string;
  title: string;
  body: string;
  status: AnnouncementStatus;
  publishedDate: string | null;
  scheduledDate: string | null;
  audience: AudienceType;
  pinned: boolean;
}

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "NSU Spring Fest 2026 registrations are now open",
    body: "All clubs are invited to submit event proposals by March 20. Please follow the updated guidelines available on the club portal. Late submissions will not be considered under any circumstances.",
    status: "Live",
    publishedDate: "Mar 1",
    scheduledDate: null,
    audience: "All Users",
    pinned: true,
  },
  {
    id: "2",
    title: "Updated Code of Conduct for all club activities",
    body: "Following the recent amendments, all clubs must ensure their members adhere to the revised code of conduct. A mandatory briefing session will be held on March 15 at the auditorium.",
    status: "Live",
    publishedDate: "Feb 20",
    scheduledDate: null,
    audience: "All Users",
    pinned: false,
  },
  {
    id: "3",
    title: "Mid-semester break event scheduling guidelines",
    body: "During the mid-semester break (March 22–28), clubs should avoid scheduling major events. Small indoor meetings are permitted with prior approval from the student affairs office.",
    status: "Draft",
    publishedDate: null,
    scheduledDate: null,
    audience: "Club Admins Only",
    pinned: false,
  },
  {
    id: "4",
    title: "Welcome to Spring 2026 semester!",
    body: "A warm welcome to all students returning for the Spring 2026 semester. Club fairs will be held during the first week. Check your dashboard for updated club schedules and recruitment timelines.",
    status: "Live",
    publishedDate: "Jan 15",
    scheduledDate: null,
    audience: "All Users",
    pinned: false,
  },
  {
    id: "5",
    title: "Ramadan schedule adjustments for club events",
    body: "During Ramadan, all club events should be scheduled after Iftar time. Clubs must submit revised timing plans to the Super Admin office by March 18 for approval.",
    status: "Scheduled",
    publishedDate: null,
    scheduledDate: "Mar 20",
    audience: "All Users",
    pinned: false,
  },
];

/* ═══════════════════════════════════════════════════════════
   ANNOUNCEMENT CARD
   ═══════════════════════════════════════════════════════════ */

function AnnouncementCard({
  announcement,
  index,
  onArchive,
}: {
  announcement: Announcement;
  index: number;
  onArchive: (id: string) => void;
}) {
  const accentColor =
    announcement.status === "Live"
      ? "#0D7377"
      : announcement.status === "Scheduled"
        ? "#F59E0B"
        : "#d1d9e6";

  const statusBadgeClass =
    announcement.status === "Live"
      ? "bg-[#e6f4f5] text-[#0D7377]"
      : announcement.status === "Scheduled"
        ? "bg-[#FEF3C7] text-[#D97706]"
        : "bg-[#f5f6fa] text-[#8896b0]";

  const bottomText =
    announcement.status === "Live"
      ? "Live for all users"
      : announcement.status === "Scheduled"
        ? `Scheduled: ${announcement.scheduledDate}`
        : "Draft";

  return (
    <div
      className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-5 relative hover:border-[#0D7377] hover:shadow-[0_8px_24px_rgba(13,115,119,0.12)] hover:-translate-y-[2px] transition-all duration-200 animate-fade-up opacity-0"
      style={{
        animationDelay: `${0.07 * (index + 1)}s`,
        animationFillMode: "both",
        borderLeft: `4px solid ${accentColor}`,
        borderRadius: "0 12px 12px 0",
      }}
    >
      {/* Top row: status badge + date */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            "text-[10px] font-[700] px-2.5 py-0.5 rounded-full",
            statusBadgeClass
          )}
        >
          {announcement.status}
        </span>
        {announcement.publishedDate && (
          <span className="text-[11px] text-[#aab4c8]">
            {announcement.publishedDate}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-syne font-[700] text-[15px] text-[#0f1828] mb-1.5">
        {announcement.title}
      </h3>

      {/* Body preview */}
      <p className="text-[13px] text-[#8896b0] leading-relaxed mb-3">
        {announcement.body.length > 100
          ? `${announcement.body.slice(0, 100)}…`
          : announcement.body}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-3 border-t border-[#e8ecf2]">
        <span className="text-[12px] text-[#8896b0] font-[500]">
          {bottomText}
          {announcement.pinned && (
            <span className="ml-2 text-[#0D7377] font-[600]">· Pinned</span>
          )}
        </span>
        <div className="flex items-center gap-3">
          <button className="text-[12px] font-[600] text-[#0D7377] hover:underline">
            Edit
          </button>
          <button
            onClick={() => onArchive(announcement.id)}
            className="text-[12px] font-[600] text-[#aab4c8] hover:text-[#EF4444] transition-colors"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CREATE / EDIT PANEL
   ═══════════════════════════════════════════════════════════ */

function CreatePanel({
  onPublish,
  onSaveDraft,
  onClose,
  isMobile,
}: {
  onPublish: (data: {
    title: string;
    body: string;
    audience: AudienceType;
    publishNow: boolean;
    scheduledDate: string;
    pinned: boolean;
  }) => void;
  onSaveDraft: (data: {
    title: string;
    body: string;
    audience: AudienceType;
  }) => void;
  onClose?: () => void;
  isMobile?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<AudienceType>("All Users");
  const [publishNow, setPublishNow] = useState(true);
  const [scheduledDate, setScheduledDate] = useState("");
  const [pinned, setPinned] = useState(false);
  const [published, setPublished] = useState(false);

  const charCount = body.length;
  const maxChars = 500;

  const handlePublish = () => {
    if (!title.trim() || !body.trim()) return;
    onPublish({
      title: title.trim(),
      body: body.trim(),
      audience,
      publishNow,
      scheduledDate,
      pinned,
    });
    setPublished(true);
  };

  const handleSaveDraft = () => {
    if (!title.trim()) return;
    onSaveDraft({
      title: title.trim(),
      body: body.trim(),
      audience,
    });
  };

  const handleCreateAnother = () => {
    setTitle("");
    setBody("");
    setAudience("All Users");
    setPublishNow(true);
    setScheduledDate("");
    setPinned(false);
    setPublished(false);
  };

  if (published) {
    return (
      <div
        className={cn(
          "bg-[#dcfce7] border-[1.5px] border-[#22c55e] rounded-[12px] p-6 flex flex-col items-center justify-center text-center animate-fade-up opacity-0",
          isMobile ? "min-h-[300px]" : "",
        )}
        style={{ animationFillMode: "both" }}
      >
        <CheckCircle2 className="w-6 h-6 text-[#22c55e] mb-3" />
        <h3 className="font-syne font-[700] text-[16px] text-[#22c55e] mb-1.5">
          Announcement Published!
        </h3>
        <p className="text-[13px] text-[#8896b0] mb-5">
          Your announcement is now live for all users.
        </p>
        <button
          onClick={handleCreateAnother}
          className="w-full h-10 rounded-[8px] border-[1.5px] border-[#0D7377] text-[#0D7377] font-syne font-[700] text-[13px] hover:bg-[#e6f4f5] transition-colors"
        >
          Create Another
        </button>
      </div>
    );
  }

  const audiences: AudienceType[] = ["All Students", "Club Admins Only", "All Users"];

  return (
    <div
      className={cn(
        "bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-6 animate-fade-up opacity-0",
        isMobile ? "min-h-[300px]" : "sticky top-[80px]",
      )}
      style={{ animationFillMode: "both" }}
    >
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-[#f5f6fa] transition-colors"
        >
          <X className="w-4 h-4 text-[#8896b0]" />
        </button>
      )}

      <h2 className="font-syne font-[700] text-[16px] text-[#0f1828] mb-5">
        New Announcement
      </h2>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-[12px] font-[600] text-[#0f1828] mb-1.5">
          Announcement Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Spring Fest 2026 is now open"
          className="w-full h-10 rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] focus:outline-none focus:border-[#0D7377] focus:ring-1 focus:ring-[#0D7377] transition-colors"
        />
      </div>

      {/* Body */}
      <div className="mb-4">
        <label className="block text-[12px] font-[600] text-[#0f1828] mb-1.5">
          Body
        </label>
        <textarea
          value={body}
          onChange={(e) => {
            if (e.target.value.length <= maxChars) setBody(e.target.value);
          }}
          rows={5}
          placeholder="Write your announcement here. Keep it clear and concise..."
          className="w-full rounded-[8px] border-[1.5px] border-[#e8ecf2] p-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] resize-none focus:outline-none focus:border-[#0D7377] focus:ring-1 focus:ring-[#0D7377] transition-colors"
        />
        <p className="text-[11px] text-[#aab4c8] text-right mt-1">
          {charCount} / {maxChars}
        </p>
      </div>

      {/* Audience */}
      <div className="mb-4">
        <label className="block text-[12px] font-[600] text-[#0f1828] mb-2">
          Visible to
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          {audiences.map((a) => (
            <button
              key={a}
              onClick={() => setAudience(a)}
              className={cn(
                "h-8 px-3.5 rounded-full text-[12px] font-[600] transition-all",
                audience === a
                  ? "bg-[#0D7377] text-white"
                  : "bg-white border-[1.5px] border-[#e8ecf2] text-[#8896b0] hover:text-[#0f1828] hover:border-[#0D7377]"
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Publish Mode */}
      <div className="mb-4">
        <label className="block text-[12px] font-[600] text-[#0f1828] mb-2">
          Publish
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="publish"
              checked={publishNow}
              onChange={() => setPublishNow(true)}
              className="w-4 h-4 border-[#e8ecf2] text-[#0D7377] focus:ring-[#0D7377] focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-[13px] font-[600] text-[#0f1828]">
              Publish Now
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="publish"
              checked={!publishNow}
              onChange={() => setPublishNow(false)}
              className="w-4 h-4 border-[#e8ecf2] text-[#0D7377] focus:ring-[#0D7377] focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-[13px] font-[600] text-[#0f1828]">
              Schedule
            </span>
          </label>
        </div>
        {!publishNow && (
          <div className="mt-3 animate-fade-up opacity-0" style={{ animationFillMode: "both" }}>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full h-10 rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] focus:outline-none focus:border-[#0D7377] focus:ring-1 focus:ring-[#0D7377] transition-colors"
            />
          </div>
        )}
      </div>

      {/* Priority toggle */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-[600] text-[#0f1828]">
              Pin to top of dashboard
            </p>
            <p className="text-[11px] text-[#aab4c8] mt-0.5">
              Pinned announcements appear above other content.
            </p>
          </div>
          <button
            onClick={() => setPinned(!pinned)}
            className={cn(
              "w-10 h-6 rounded-full transition-colors relative shrink-0",
              pinned ? "bg-[#0D7377]" : "bg-[#d1d9e6]"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm",
                pinned ? "left-5" : "left-1"
              )}
            />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <button
        onClick={handlePublish}
        disabled={!title.trim() || !body.trim()}
        className={cn(
          "w-full h-11 rounded-[8px] font-syne font-[700] text-[13px] text-white transition-all",
          title.trim() && body.trim()
            ? "bg-[#0D7377] hover:bg-[#0a5c60] hover:scale-[1.02] active:scale-[0.98]"
            : "bg-[#d4d8e0] cursor-not-allowed"
        )}
      >
        Publish Announcement
      </button>
      <button
        onClick={handleSaveDraft}
        disabled={!title.trim()}
        className={cn(
          "w-full h-10 rounded-[8px] border-[1.5px] font-syne font-[700] text-[13px] mt-2 transition-all",
          title.trim()
            ? "border-[#0D7377] text-[#0D7377] hover:bg-[#e6f4f5]"
            : "border-[#e8ecf2] text-[#aab4c8] cursor-not-allowed"
        )}
      >
        Save as Draft
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function SuperAnnouncementsPage() {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);
  const [filter, setFilter] = useState<FilterType>("All");
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const filters: FilterType[] = ["All", "Live", "Scheduled", "Draft"];

  const filtered = announcements.filter((a) => {
    if (filter === "All") return true;
    return a.status === filter;
  });

  const handlePublish = (data: {
    title: string;
    body: string;
    audience: AudienceType;
    publishNow: boolean;
    scheduledDate: string;
    pinned: boolean;
  }) => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: data.title,
      body: data.body,
      status: data.publishNow ? "Live" : "Scheduled",
      publishedDate: data.publishNow
        ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : null,
      scheduledDate: data.publishNow ? null : data.scheduledDate,
      audience: data.audience,
      pinned: data.pinned,
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
  };

  const handleSaveDraft = (data: {
    title: string;
    body: string;
    audience: AudienceType;
  }) => {
    const draft: Announcement = {
      id: Date.now().toString(),
      title: data.title,
      body: data.body,
      status: "Draft",
      publishedDate: null,
      scheduledDate: null,
      audience: data.audience,
      pinned: false,
    };
    setAnnouncements((prev) => [draft, ...prev]);
  };

  const handleArchive = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="pb-10">
      {/* ── PAGE HEADER ───────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 animate-fade-up opacity-0"
        style={{ animationDelay: "0s", animationFillMode: "both" }}
      >
        <div>
          <h1 className="font-syne font-[800] text-[22px] text-[#0f1828] mb-1">
            Announcements
          </h1>
          <p className="text-[14px] text-[#8896b0]">
            Broadcast messages to all NSU ClubHub users.
          </p>
        </div>
        <button
          onClick={() => setMobilePanelOpen(true)}
          className="md:hidden flex items-center gap-2 h-10 px-5 bg-[#0D7377] text-white rounded-[8px] font-syne font-[700] text-[13px] hover:bg-[#0a5c60] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
        <button
          className="hidden md:flex items-center gap-2 h-10 px-5 bg-[#0D7377] text-white rounded-[8px] font-syne font-[700] text-[13px] hover:bg-[#0a5c60] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm shrink-0"
        >
          ＋ New Announcement
        </button>
      </div>

      {/* ── TWO COLUMN LAYOUT ─────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN — Announcement List */}
        <div className="w-full lg:w-[55%] flex flex-col gap-4">
          {/* Filter tabs */}
          <div className="flex items-center gap-5 animate-fade-up opacity-0" style={{ animationDelay: "0.07s", animationFillMode: "both" }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "text-[13px] font-[600] pb-1 transition-colors relative",
                  filter === f
                    ? "text-[#0D7377]"
                    : "text-[#8896b0] hover:text-[#0f1828]"
                )}
              >
                {f}
                {filter === f && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0D7377] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Announcement cards */}
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filtered.map((announcement, i) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  index={i}
                  onArchive={handleArchive}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-20 animate-fade-up opacity-0"
              style={{ animationFillMode: "both" }}
            >
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#e8ecf2] flex items-center justify-center mb-5">
                <span className="text-[28px] text-[#aab4c8]">📢</span>
              </div>
              <h2 className="font-syne font-[700] text-[18px] text-[#0f1828] mb-1">
                No announcements
              </h2>
              <p className="text-[14px] text-[#8896b0]">
                No {filter.toLowerCase()} announcements found.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Create Panel (desktop) */}
        <div className="hidden lg:block w-[45%]">
          <CreatePanel
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
          />
        </div>
      </div>

      {/* ── MOBILE BOTTOM SHEET ───────────────────────── */}
      {mobilePanelOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobilePanelOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#f5f6fa] rounded-t-[16px] p-5 max-h-[85vh] overflow-y-auto lg:hidden animate-fade-up opacity-0"
            style={{ animationFillMode: "both" }}
          >
            <div className="w-10 h-1 bg-[#d1d9e6] rounded-full mx-auto mb-5" />
            <CreatePanel
              onPublish={() => {
                handlePublish({
                  title: "",
                  body: "",
                  audience: "All Users",
                  publishNow: true,
                  scheduledDate: "",
                  pinned: false,
                });
                setMobilePanelOpen(false);
              }}
              onSaveDraft={() => {
                handleSaveDraft({
                  title: "",
                  body: "",
                  audience: "All Users",
                });
                setMobilePanelOpen(false);
              }}
              onClose={() => setMobilePanelOpen(false)}
              isMobile
            />
          </div>
        </>
      )}
    </div>
  );
}
