"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  MapPin,
  Link2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

/* ═══════════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════════ */

interface EventFormData {
  name: string;
  type: string;
  coHosts: string[];
  isPublic: boolean;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  meetingLink: string;
  isOnline: boolean;
  expectedAttendance: string;
  description: string;
  bannerFile: File | null;
  bannerPreview: string;
  tags: string[];
}

const STEPS = [
  { num: 1, label: "Event Basics" },
  { num: 2, label: "Date & Venue" },
  { num: 3, label: "Details & Banner" },
  { num: 4, label: "Review & Submit" },
];

const EVENT_TYPES = ["Workshop", "Seminar", "Competition", "Social"];

/* Simulated date conflict: if the user picks a date that matches this */
const CONFLICTING_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
})();

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(d: string) {
  if (!d) return "—";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(t: string) {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

/* ═══════════════════════════════════════════════════════════
   PROGRESS STEPPER
   ═══════════════════════════════════════════════════════════ */

function ProgressStepper({ current }: { current: number }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-start justify-between relative">
        {/* Connecting line background */}
        <div className="absolute top-[14px] left-[14px] right-[14px] h-[2px] bg-[#e8ecf2]" />
        {/* Connecting line progress */}
        <div
          className="absolute top-[14px] left-[14px] h-[2px] bg-[#0D7377] transition-all duration-300"
          style={{
            width: `calc(${((current - 1) / (STEPS.length - 1)) * 100}% - ${current === 1 ? 0 : 0}px)`,
          }}
        />

        {STEPS.map((step) => {
          const isCompleted = step.num < current;
          const isActive = step.num === current;
          const isUpcoming = step.num > current;

          return (
            <div
              key={step.num}
              className="flex flex-col items-center relative z-10"
              style={{ width: `${100 / STEPS.length}%` }}
            >
              {/* Circle */}
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-[700] transition-all duration-200 shrink-0",
                  isCompleted && "bg-[#0f1828] text-white",
                  isActive && "bg-[#0D7377] text-white shadow-[0_0_0_4px_rgba(13,115,119,0.15)]",
                  isUpcoming && "bg-white border-[1.5px] border-[#e8ecf2] text-[#aab4c8]"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.num}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-[11px] font-[600] text-center whitespace-nowrap",
                  isActive && "text-[#0D7377]",
                  isCompleted && "text-[#0f1828]",
                  isUpcoming && "text-[#aab4c8]"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function CreateEventPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);

  const [form, setForm] = useState<EventFormData>({
    name: "",
    type: "",
    coHosts: [],
    isPublic: true,
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    meetingLink: "",
    isOnline: false,
    expectedAttendance: "",
    description: "",
    bannerFile: null,
    bannerPreview: "",
    tags: [],
  });

  /* Co-host input state */
  const [coHostInput, setCoHostInput] = useState("");

  /* Tag input state */
  const [tagInput, setTagInput] = useState("");

  /* Banner error state */
  const [bannerError, setBannerError] = useState("");

  /* ── Update helpers ──────────────────────────────────── */
  const updateField = useCallback(
    <K extends keyof EventFormData>(key: K, value: EventFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  /* ── Navigation ──────────────────────────────────────── */
  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));
  const goToStep = (n: number) => setStep(n);

  /* ── Step 1 validation ───────────────────────────────── */
  const step1Valid = form.name.trim().length > 0;

  /* ── Co-host helpers ─────────────────────────────────── */
  const addCoHost = () => {
    const v = coHostInput.trim();
    if (v && !form.coHosts.includes(v)) {
      updateField("coHosts", [...form.coHosts, v]);
    }
    setCoHostInput("");
  };

  const removeCoHost = (host: string) => {
    updateField(
      "coHosts",
      form.coHosts.filter((h) => h !== host)
    );
  };

  /* ── Tag helpers ─────────────────────────────────────── */
  const addTag = () => {
    const v = tagInput.trim().toLowerCase();
    if (v && !form.tags.includes(v)) {
      updateField("tags", [...form.tags, v]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    updateField(
      "tags",
      form.tags.filter((t) => t !== tag)
    );
  };

  /* ── Banner upload ───────────────────────────────────── */
  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerError("");

    if (file.size > 2 * 1024 * 1024) {
      setBannerError("File exceeds 2 MB. Please choose a smaller image.");
      updateField("bannerFile", null);
      updateField("bannerPreview", "");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    updateField("bannerFile", file);
    const reader = new FileReader();
    reader.onload = () => {
      updateField("bannerPreview", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeBanner = () => {
    updateField("bannerFile", null);
    updateField("bannerPreview", "");
    setBannerError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Submit ──────────────────────────────────────────── */
  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1800));
    router.push("/admin/events");
  };

  const handleSaveDraft = () => {
    router.push("/admin/events");
  };

  /* ── Date conflict check ─────────────────────────────── */
  const hasDateConflict = form.date === CONFLICTING_DATE;

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */

  return (
    <>
      {/* ── RESUBMIT MODAL ──────────────────────────────── */}
      {showResubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="bg-white rounded-[16px] shadow-2xl max-w-[440px] w-full mx-4 p-6 animate-fade-up"
            style={{ animationFillMode: "both" }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h3 className="font-syne font-[700] text-[18px] text-[#0f1828] mb-2">
                Resubmit for Approval?
              </h3>
              <p className="text-[13px] text-[#8896b0] mb-6 leading-relaxed">
                This event was previously approved. Making changes will require
                it to be reviewed and approved again by the Super Admin.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowResubmitModal(false)}
                  className="flex-1 h-10 rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#8896b0] font-syne font-[700] text-[13px] hover:bg-[#f5f6fa] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowResubmitModal(false);
                    handleSubmit();
                  }}
                  className="flex-1 h-10 bg-[#F59E0B] text-white rounded-[8px] font-syne font-[700] text-[13px] hover:bg-[#d97706] transition-all shadow-sm"
                >
                  Proceed & Resubmit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 pb-10">
        {/* ── PAGE HEADER ──────────────────────────────────── */}
        <div
          className="animate-fade-up opacity-0"
          style={{ animationDelay: "0s", animationFillMode: "both" }}
        >
          <h1 className="font-syne font-[800] text-[22px] text-[#0f1828] mb-1">
            Create New Event
          </h1>
          <p className="text-[14px] text-[#8896b0]">
            Fill in the details below to submit your event for approval.
          </p>
        </div>

        {/* ── PROGRESS STEPPER ─────────────────────────────── */}
        <div
          className="animate-fade-up opacity-0"
          style={{ animationDelay: "0.07s", animationFillMode: "both" }}
        >
          <ProgressStepper current={step} />
        </div>

        {/* ── STEP CONTENT ─────────────────────────────────── */}
        <div
          className="animate-fade-up opacity-0"
          style={{ animationDelay: "0.14s", animationFillMode: "both" }}
        >
          {/* ════════════════════════════════════════════════
             STEP 1 — EVENT BASICS
             ════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-6 max-w-[680px] mx-auto">
              <h2 className="font-syne font-[700] text-[16px] text-[#0f1828] mb-5">
                Event Basics
              </h2>

              <div className="flex flex-col gap-5">
                {/* Event Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Event Name <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="e.g. Intra-University Hackathon"
                    className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                  />
                </div>

                {/* Event Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Event Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EVENT_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => updateField("type", form.type === t ? "" : t)}
                        className={cn(
                          "h-9 px-4 rounded-[8px] text-[13px] font-[600] border-[1.5px] transition-all duration-150",
                          form.type === t
                            ? "bg-[#0D7377] text-white border-[#0D7377]"
                            : "bg-white text-[#8896b0] border-[#e8ecf2] hover:border-[#0D7377] hover:text-[#0D7377]"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hosting Club — locked */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Hosting Club
                  </label>
                  <input
                    type="text"
                    value="NSU ACM SC"
                    readOnly
                    className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] bg-[#f0f0f8] px-3 text-[13px] text-[#8896b0] cursor-not-allowed outline-none"
                  />
                </div>

                {/* Co-hosts */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Co-hosts
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={coHostInput}
                      onChange={(e) => setCoHostInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCoHost();
                        }
                      }}
                      placeholder="+ Add co-host club"
                      className="flex-1 h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={addCoHost}
                      disabled={!coHostInput.trim()}
                      className="h-[43px] px-4 rounded-[8px] bg-[#0D7377] text-white text-[13px] font-[600] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0a5c60] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {form.coHosts.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {form.coHosts.map((host) => (
                        <span
                          key={host}
                          className="inline-flex items-center gap-1.5 h-7 px-3 bg-[#e6f4f5] text-[#0D7377] text-[12px] font-[600] rounded-full"
                        >
                          {host}
                          <button
                            type="button"
                            onClick={() => removeCoHost(host)}
                            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#0D7377] hover:text-white transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Public event toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-[600] text-[#0f1828]">
                      Public Event
                    </p>
                    <p className="text-[11px] text-[#8896b0]">
                      Visible to all students
                    </p>
                  </div>
                  <Switch
                    checked={form.isPublic}
                    onCheckedChange={(v) => updateField("isPublic", v)}
                    className="data-[state=checked]:bg-[#0D7377]"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={next}
                  disabled={!step1Valid}
                  className="h-10 px-6 bg-[#0D7377] text-white rounded-[8px] font-syne font-[700] text-[13px] flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0a5c60] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
             STEP 2 — DATE & VENUE
             ════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-6 max-w-[680px] mx-auto">
              <h2 className="font-syne font-[700] text-[16px] text-[#0f1828] mb-5">
                Date & Venue
              </h2>

              <div className="flex flex-col gap-5">
                {/* Event Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    min={todayStr()}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                  />
                </div>

                {/* Date Conflict Warning */}
                {hasDateConflict && (
                  <div className="flex items-start gap-3 bg-[#FEF3C7] border-l-4 border-[#F59E0B] rounded-r-[8px] px-4 py-3">
                    <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[13px] font-[600] text-[#92400e]">
                        Potential Date Conflict
                      </p>
                      <p className="text-[12px] text-[#92400e]/80 mt-0.5">
                        Another club event &quot;NSU Photography Workshop&quot; is
                        scheduled for this date. You can still proceed.
                      </p>
                    </div>
                  </div>
                )}

                {/* Start / End Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-[600] text-[#0f1828]">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={(e) => updateField("startTime", e.target.value)}
                      className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-[600] text-[#0f1828]">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={(e) => updateField("endTime", e.target.value)}
                      className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                    />
                  </div>
                </div>

                {/* Online Event toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-[600] text-[#0f1828]">
                      Online Event
                    </p>
                    <p className="text-[11px] text-[#8896b0]">
                      Replace venue with a meeting link
                    </p>
                  </div>
                  <Switch
                    checked={form.isOnline}
                    onCheckedChange={(v) => updateField("isOnline", v)}
                    className="data-[state=checked]:bg-[#0D7377]"
                  />
                </div>

                {/* Venue or Meeting Link */}
                {form.isOnline ? (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-[600] text-[#0f1828]">
                      Meeting Link
                    </label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aab4c8]" />
                      <input
                        type="url"
                        value={form.meetingLink}
                        onChange={(e) =>
                          updateField("meetingLink", e.target.value)
                        }
                        placeholder="e.g. https://meet.google.com/abc-defg-hij"
                        className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] pl-9 pr-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-[600] text-[#0f1828]">
                      Venue
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aab4c8]" />
                      <input
                        type="text"
                        value={form.venue}
                        onChange={(e) => updateField("venue", e.target.value)}
                        placeholder="e.g. NAC Auditorium, NSU"
                        className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] pl-9 pr-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Expected Attendance */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Expected Attendance
                  </label>
                  <input
                    type="number"
                    value={form.expectedAttendance}
                    onChange={(e) =>
                      updateField("expectedAttendance", e.target.value)
                    }
                    placeholder="e.g. 150"
                    min={1}
                    className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={back}
                  className="h-10 px-5 rounded-[8px] text-[#8896b0] font-syne font-[700] text-[13px] flex items-center gap-2 hover:bg-[#f5f6fa] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={next}
                  className="h-10 px-6 bg-[#0D7377] text-white rounded-[8px] font-syne font-[700] text-[13px] flex items-center gap-2 hover:bg-[#0a5c60] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
             STEP 3 — DETAILS & BANNER
             ════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-6 max-w-[680px] mx-auto">
              <h2 className="font-syne font-[700] text-[16px] text-[#0f1828] mb-5">
                Details & Banner
              </h2>

              <div className="flex flex-col gap-5">
                {/* Event Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Event Description
                  </label>
                  <div className="relative">
                    <textarea
                      rows={5}
                      maxLength={800}
                      value={form.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      placeholder="Describe your event — what it is, who it's for, and what participants can expect..."
                      className="w-full rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 py-2.5 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all resize-none"
                    />
                    <span className="absolute bottom-2 right-3 text-[10px] text-[#aab4c8]">
                      {form.description.length} / 800
                    </span>
                  </div>
                </div>

                {/* Banner Upload */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Event Banner
                  </label>

                  {form.bannerPreview ? (
                    /* Preview */
                    <div className="relative rounded-[8px] overflow-hidden border-[1.5px] border-[#e8ecf2]">
                      <img
                        src={form.bannerPreview}
                        alt="Banner preview"
                        className="w-full h-40 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeBanner}
                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-[#fee2e2] hover:text-[#EF4444] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* Upload zone */
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "w-full h-40 rounded-[8px] border-[2px] border-dashed flex flex-col items-center justify-center gap-2 transition-all",
                        bannerError
                          ? "border-[#EF4444] bg-[#fee2e2]"
                          : "border-[#e8ecf2] bg-[#f5f6fa] hover:border-[#0D7377] hover:bg-[#e6f4f5]"
                      )}
                    >
                      <Upload
                        className={cn(
                          "w-8 h-8",
                          bannerError ? "text-[#EF4444]" : "text-[#aab4c8]"
                        )}
                      />
                      {bannerError ? (
                        <p className="text-[13px] font-[600] text-[#EF4444]">
                          {bannerError}
                        </p>
                      ) : (
                        <>
                          <p className="text-[13px] font-[600] text-[#8896b0]">
                            Click to upload banner image
                          </p>
                          <p className="text-[11px] text-[#aab4c8]">
                            Recommended: 1200x400px. Max 2 MB.
                          </p>
                        </>
                      )}
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerSelect}
                    className="hidden"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="e.g. coding, hackathon, prizes"
                    className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                  />
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 h-7 px-3 bg-[#e6f4f5] text-[#0D7377] text-[12px] font-[600] rounded-full"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#0D7377] hover:text-white transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={back}
                  className="h-10 px-5 rounded-[8px] text-[#8896b0] font-syne font-[700] text-[13px] flex items-center gap-2 hover:bg-[#f5f6fa] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={next}
                  className="h-10 px-6 bg-[#0D7377] text-white rounded-[8px] font-syne font-[700] text-[13px] flex items-center gap-2 hover:bg-[#0a5c60] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
             STEP 4 — REVIEW & SUBMIT
             ════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-6 max-w-[680px] mx-auto">
              <h2 className="font-syne font-[700] text-[18px] text-[#0f1828] mb-6">
                Review Your Event
              </h2>

              <div className="flex flex-col gap-4">
                {/* Event Name */}
                <ReviewRow
                  label="Event Name"
                  value={form.name || "—"}
                  onEdit={() => goToStep(1)}
                />

                {/* Event Type */}
                <ReviewRow
                  label="Event Type"
                  value={form.type || "—"}
                  onEdit={() => goToStep(1)}
                />

                {/* Hosting Club */}
                <ReviewRow
                  label="Hosting Club"
                  value="NSU ACM SC"
                />

                {/* Co-hosts */}
                {form.coHosts.length > 0 && (
                  <ReviewRow
                    label="Co-hosts"
                    value={form.coHosts.join(", ")}
                    onEdit={() => goToStep(1)}
                  />
                )}

                {/* Visibility */}
                <ReviewRow
                  label="Visibility"
                  value={form.isPublic ? "Public" : "Private"}
                  onEdit={() => goToStep(1)}
                />

                <div className="border-t border-[#e8ecf2]" />

                {/* Date */}
                <ReviewRow
                  label="Date"
                  value={formatDate(form.date)}
                  onEdit={() => goToStep(2)}
                />

                {/* Time */}
                <ReviewRow
                  label="Time"
                  value={
                    form.startTime || form.endTime
                      ? `${formatTime(form.startTime)} — ${formatTime(form.endTime)}`
                      : "—"
                  }
                  onEdit={() => goToStep(2)}
                />

                {/* Venue / Link */}
                <ReviewRow
                  label={form.isOnline ? "Meeting Link" : "Venue"}
                  value={
                    form.isOnline
                      ? form.meetingLink || "—"
                      : form.venue || "—"
                  }
                  onEdit={() => goToStep(2)}
                />

                {/* Attendance */}
                <ReviewRow
                  label="Expected Attendance"
                  value={form.expectedAttendance || "—"}
                  onEdit={() => goToStep(2)}
                />

                <div className="border-t border-[#e8ecf2]" />

                {/* Description */}
                <ReviewRow
                  label="Description"
                  value={form.description || "—"}
                  onEdit={() => goToStep(3)}
                  multiline
                />

                {/* Banner */}
                {form.bannerPreview && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-[600] text-[#8896b0]">
                        Banner
                      </span>
                      <button
                        type="button"
                        onClick={() => goToStep(3)}
                        className="text-[12px] font-[600] text-[#0D7377] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <img
                      src={form.bannerPreview}
                      alt="Event banner"
                      className="w-full h-32 object-cover rounded-[8px] border-[1.5px] border-[#e8ecf2]"
                    />
                  </div>
                )}

                {/* Tags */}
                {form.tags.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-[600] text-[#8896b0]">
                        Tags
                      </span>
                      <button
                        type="button"
                        onClick={() => goToStep(3)}
                        className="text-[12px] font-[600] text-[#0D7377] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block h-6 px-2.5 bg-[#e6f4f5] text-[#0D7377] text-[11px] font-[600] rounded-full leading-6"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full h-11 bg-[#0D7377] text-white rounded-[8px] font-syne font-[700] text-[14px] flex items-center justify-center gap-2 disabled:opacity-70 hover:bg-[#0a5c60] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Approval"
                  )}
                </button>
                <button
                  onClick={handleSaveDraft}
                  disabled={submitting}
                  className="w-full h-11 rounded-[8px] border-[1.5px] border-[#0D7377] text-[#0D7377] font-syne font-[700] text-[14px] hover:bg-[#e6f4f5] disabled:opacity-50 transition-all"
                >
                  Save as Draft
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   REVIEW ROW COMPONENT
   ═══════════════════════════════════════════════════════════ */

function ReviewRow({
  label,
  value,
  onEdit,
  multiline,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
  multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-[600] text-[#8896b0]">{label}</span>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-[12px] font-[600] text-[#0D7377] hover:underline"
          >
            Edit
          </button>
        )}
      </div>
      <p
        className={cn(
          "text-[13px] text-[#0f1828]",
          multiline && "leading-relaxed whitespace-pre-wrap"
        )}
      >
        {value}
      </p>
    </div>
  );
}
