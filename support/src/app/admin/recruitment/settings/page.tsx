"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Lock,
  GripVertical,
  Mail,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

interface Position {
  id: string;
  name: string;
  slots: number;
}

interface CustomQuestion {
  id: string;
  text: string;
  type: "Short Text" | "Long Text";
  required: boolean;
}

/* ═══════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════ */

const initialPositions: Position[] = [
  { id: "1", name: "General Member", slots: 20 },
  { id: "2", name: "Technical Team", slots: 10 },
  { id: "3", name: "PR & Marketing", slots: 10 },
  { id: "4", name: "Event Management", slots: 10 },
];

const initialQuestions: CustomQuestion[] = [
  {
    id: "q1",
    text: "Tell us about any relevant experience or skills.",
    type: "Long Text",
    required: false,
  },
];

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function RecruitmentSettingsPage() {
  const [recruitmentOpen, setRecruitmentOpen] = useState(true);
  const [openDate, setOpenDate] = useState("2026-02-20");
  const [closeDate, setCloseDate] = useState("2026-03-28");
  const [totalSlots, setTotalSlots] = useState("50");

  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [questions, setQuestions] = useState<CustomQuestion[]>(initialQuestions);

  const [notifSubmission, setNotifSubmission] = useState(true);
  const [notifStatusChange, setNotifStatusChange] = useState(true);
  const [notifNewApp, setNotifNewApp] = useState(true);
  const [notifReminder, setNotifReminder] = useState(false);

  /* ── Position helpers ────────────────────────────────── */
  const updatePosition = (id: string, field: keyof Position, value: string | number) => {
    setPositions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const removePosition = (id: string) => {
    setPositions((prev) => prev.filter((p) => p.id !== id));
  };

  const addPosition = () => {
    setPositions((prev) => [
      ...prev,
      { id: `p-${Date.now()}`, name: "", slots: 5 },
    ]);
  };

  /* ── Question helpers ────────────────────────────────── */
  const updateQuestion = (id: string, field: keyof CustomQuestion, value: string | boolean) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: `q-${Date.now()}`, text: "", type: "Long Text", required: false },
    ]);
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* ── PAGE HEADER ──────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-up opacity-0"
        style={{ animationDelay: "0s", animationFillMode: "both" }}
      >
        <div>
          <Link
            href="/admin/recruitment"
            className="inline-flex items-center gap-1.5 text-[13px] font-[600] text-[#0D7377] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Recruitment
          </Link>
          <h1 className="font-syne font-[800] text-[22px] text-[#0f1828] mb-1">
            Recruitment Settings
          </h1>
          <p className="text-[14px] text-[#8896b0]">Spring 2026 Cycle</p>
        </div>
        <button className="h-10 px-6 bg-[#0D7377] text-white rounded-[8px] font-syne font-[700] text-[13px] hover:bg-[#0a5c60] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm shrink-0">
          Save Settings
        </button>
      </div>

      {/* ── SECTION 1: Cycle Configuration ───────────────── */}
      <div
        className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-6 animate-fade-up opacity-0"
        style={{ animationDelay: "0.07s", animationFillMode: "both" }}
      >
        <h2 className="font-syne font-[700] text-[15px] text-[#0f1828] mb-5">
          Cycle Configuration
        </h2>

        <div className="flex flex-col gap-5">
          {/* Recruitment Status Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-[14px] font-[700] transition-colors",
                  recruitmentOpen ? "text-[#22c55e]" : "text-[#EF4444]"
                )}
              >
                Recruitment is currently {recruitmentOpen ? "OPEN" : "CLOSED"}
              </p>
              <p className="text-[12px] text-[#8896b0] mt-0.5">
                Toggle to open or close applications
              </p>
            </div>
            <Switch
              checked={recruitmentOpen}
              onCheckedChange={setRecruitmentOpen}
              className={cn(
                "data-[state=checked]:bg-[#22c55e]",
                !recruitmentOpen && "data-[state=unchecked]:bg-[#EF4444]"
              )}
            />
          </div>

          {/* Open / Close Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-[600] text-[#0f1828]">
                Opens On
              </label>
              <input
                type="date"
                value={openDate}
                onChange={(e) => setOpenDate(e.target.value)}
                className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-[600] text-[#0f1828]">
                Closes On
              </label>
              <input
                type="date"
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
                className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
              />
            </div>
          </div>

          {/* Total Slots */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[600] text-[#0f1828]">
              Maximum Applicants
            </label>
            <input
              type="number"
              value={totalSlots}
              onChange={(e) => setTotalSlots(e.target.value)}
              min={1}
              className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
            />
            <p className="text-[11px] text-[#8896b0]">
              Applications will auto-close when this limit is reached.
            </p>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Available Positions ───────────────── */}
      <div
        className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-6 animate-fade-up opacity-0"
        style={{ animationDelay: "0.14s", animationFillMode: "both" }}
      >
        <h2 className="font-syne font-[700] text-[15px] text-[#0f1828] mb-1">
          Available Positions
        </h2>
        <p className="text-[12px] text-[#8896b0] mb-5">
          Applicants select one position when applying.
        </p>

        <div className="flex flex-col gap-3">
          {positions.map((pos) => (
            <div
              key={pos.id}
              className="flex items-center gap-3 group"
            >
              <GripVertical className="w-4 h-4 text-[#aab4c8] shrink-0 cursor-grab" />
              <input
                type="text"
                value={pos.name}
                onChange={(e) => updatePosition(pos.id, "name", e.target.value)}
                placeholder="Position name"
                className="flex-1 h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[12px] text-[#8896b0]">slots</span>
                <input
                  type="number"
                  value={pos.slots}
                  onChange={(e) =>
                    updatePosition(pos.id, "slots", parseInt(e.target.value) || 0)
                  }
                  min={1}
                  className="w-[72px] h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] text-center outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                />
              </div>
              <button
                onClick={() => removePosition(pos.id)}
                className="w-9 h-9 flex items-center justify-center rounded-[8px] text-[#aab4c8] opacity-0 group-hover:opacity-100 hover:text-[#EF4444] hover:bg-[#fee2e2] transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            onClick={addPosition}
            className="w-full h-[43px] rounded-[8px] border-[2px] border-dashed border-[#0D7377]/30 text-[#0D7377] text-[13px] font-[600] flex items-center justify-center gap-2 hover:border-[#0D7377] hover:bg-[#e6f4f5] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Position
          </button>
        </div>
      </div>

      {/* ── SECTION 3: Application Form Questions ────────── */}
      <div
        className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-6 animate-fade-up opacity-0"
        style={{ animationDelay: "0.21s", animationFillMode: "both" }}
      >
        <h2 className="font-syne font-[700] text-[15px] text-[#0f1828] mb-1">
          Application Form Questions
        </h2>
        <p className="text-[12px] text-[#8896b0] mb-5">
          The questions applicants answer when they apply.
        </p>

        <div className="flex flex-col gap-4">
          {/* Locked Q1 */}
          <div className="bg-[#f5f6fa] rounded-[10px] p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#8896b0]" />
              <span className="text-[13px] font-[600] text-[#0f1828]">
                Why do you want to join [Club Name]?
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-[600] text-[#8896b0] bg-white px-2 py-0.5 rounded-full border border-[#e8ecf2]">
                Motivation
              </span>
              <span className="text-[11px] font-[600] text-[#0D7377] bg-[#e6f4f5] px-2 py-0.5 rounded-full">
                Required · Min 50 chars
              </span>
            </div>
          </div>

          {/* Locked Q2 */}
          <div className="bg-[#f5f6fa] rounded-[10px] p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#8896b0]" />
              <span className="text-[13px] font-[600] text-[#0f1828]">
                NSU Student ID
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-[600] text-[#8896b0] bg-white px-2 py-0.5 rounded-full border border-[#e8ecf2]">
                Auto-filled from profile
              </span>
              <span className="text-[11px] font-[600] text-[#8896b0]">
                Read-only
              </span>
            </div>
          </div>

          {/* Custom questions */}
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[10px] p-4 flex flex-col gap-3 group"
            >
              <div className="flex items-start gap-2">
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                  placeholder="Enter your custom question..."
                  className="flex-1 h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                />
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-[8px] text-[#aab4c8] opacity-0 group-hover:opacity-100 hover:text-[#EF4444] hover:bg-[#fee2e2] transition-all shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Type selector */}
                <select
                  value={q.type}
                  onChange={(e) =>
                    updateQuestion(
                      q.id,
                      "type",
                      e.target.value as "Short Text" | "Long Text"
                    )
                  }
                  className="h-[34px] rounded-[6px] border-[1.5px] border-[#e8ecf2] px-2.5 text-[12px] text-[#0f1828] outline-none focus:border-[#0D7377] bg-white"
                >
                  <option value="Short Text">Short Text</option>
                  <option value="Long Text">Long Text</option>
                </select>

                {/* Required toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#8896b0]">Required</span>
                  <Switch
                    checked={q.required}
                    onCheckedChange={(v) => updateQuestion(q.id, "required", v)}
                    className="data-[state=checked]:bg-[#0D7377]"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="w-full h-[43px] rounded-[8px] border-[2px] border-dashed border-[#0D7377]/30 text-[#0D7377] text-[13px] font-[600] flex items-center justify-center gap-2 hover:border-[#0D7377] hover:bg-[#e6f4f5] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Custom Question
          </button>
        </div>
      </div>

      {/* ── SECTION 4: Notification Triggers ─────────────── */}
      <div
        className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-6 animate-fade-up opacity-0"
        style={{ animationDelay: "0.28s", animationFillMode: "both" }}
      >
        <h2 className="font-syne font-[700] text-[15px] text-[#0f1828] mb-5">
          Notification Triggers
        </h2>

        <div className="flex flex-col">
          <ToggleRow
            icon={<Mail className="w-4 h-4" />}
            label="Email applicant on submission received"
            checked={notifSubmission}
            onChange={setNotifSubmission}
            border
          />
          <ToggleRow
            icon={<Mail className="w-4 h-4" />}
            label="Email applicant on status change (Interview/Accept/Reject)"
            checked={notifStatusChange}
            onChange={setNotifStatusChange}
            border
          />
          <ToggleRow
            icon={<Bell className="w-4 h-4" />}
            label="In-app notification to admin on new application"
            checked={notifNewApp}
            onChange={setNotifNewApp}
            border
          />
          <ToggleRow
            icon={<Bell className="w-4 h-4" />}
            label="Reminder to admin 3 days before cycle closes"
            checked={notifReminder}
            onChange={setNotifReminder}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOGGLE ROW COMPONENT
   ═══════════════════════════════════════════════════════════ */

function ToggleRow({
  icon,
  label,
  checked,
  onChange,
  border,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  border?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-3.5",
        border && "border-b border-[#e8ecf2]"
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-[#8896b0]">{icon}</span>
        <span className="text-[13px] font-[600] text-[#0f1828]">{label}</span>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-[#0D7377]"
      />
    </div>
  );
}
