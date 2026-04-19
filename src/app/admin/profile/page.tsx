"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  Check,
  Trash2,
  Plus,
  Globe,
  Instagram,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

interface ExecMember {
  id: string;
  name: string;
  role: string;
}

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════ */

const COLOR_SWATCHES = [
  { name: "Teal",   value: "#0D7377" },
  { name: "Blue",   value: "#2563EB" },
  { name: "Purple", value: "#7C5CFC" },
  { name: "Pink",   value: "#EC4899" },
  { name: "Amber",  value: "#F59E0B" },
  { name: "Green",  value: "#22c55e" },
];

const INITIAL_EXECS: ExecMember[] = [
  { id: "1", name: "Arif Rahman",   role: "President" },
  { id: "2", name: "Sadia Islam",   role: "Vice President" },
  { id: "3", name: "Tanvir Ahmed",  role: "General Secretary" },
  { id: "4", name: "Nusrat Jahan",  role: "Treasurer" },
];

const INITIAL_DESCRIPTION =
  "The NSU ACM Student Chapter is a community of technology enthusiasts at North South University. We organize hackathons, competitive programming contests, workshops on emerging technologies, and career development sessions. Our mission is to bridge the gap between academic learning and industry practices, empowering students to excel in the ever-evolving world of computer science.";

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

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ═══════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function ClubProfilePage() {
  const { logout } = useAuth();
  const router = useRouter();
  
  /* ── Form state ─────────────────────────────────────── */
  const [shortDesc, setShortDesc] = useState(
    "Technology community building future innovators at NSU"
  );
  const [foundedYear, setFoundedYear] = useState("2015");
  const [selectedColor, setSelectedColor] = useState("#0D7377");
  const [aboutText, setAboutText] = useState(INITIAL_DESCRIPTION);
  const [execs, setExecs] = useState<ExecMember[]>(INITIAL_EXECS);
  const [website, setWebsite] = useState("https://nsuacm.org");
  const [facebook, setFacebook] = useState("https://facebook.com/nsuacmsc");
  const [instagram, setInstagram] = useState("@nsuacmsc");

  /* ── Toast state ────────────────────────────────────── */
  const [showToast, setShowToast] = useState(false);

  /* ── Snapshot for discard ───────────────────────────── */
  const [snapshot] = useState({
    shortDesc: "Technology community building future innovators at NSU",
    foundedYear: "2015",
    selectedColor: "#0D7377",
    aboutText: INITIAL_DESCRIPTION,
    execs: INITIAL_EXECS,
    website: "https://nsuacm.org",
    facebook: "https://facebook.com/nsuacmsc",
    instagram: "@nsuacmsc",
  });

  /* ── Handlers ───────────────────────────────────────── */
  const handleSave = useCallback(() => {
    setShowToast(true);
  }, []);

  const handleDiscard = useCallback(() => {
    setShortDesc(snapshot.shortDesc);
    setFoundedYear(snapshot.foundedYear);
    setSelectedColor(snapshot.selectedColor);
    setAboutText(snapshot.aboutText);
    setExecs(snapshot.execs);
    setWebsite(snapshot.website);
    setFacebook(snapshot.facebook);
    setInstagram(snapshot.instagram);
  }, [snapshot]);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  const updateExec = (id: string, field: "name" | "role", value: string) => {
    setExecs((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const removeExec = (id: string) => {
    setExecs((prev) => prev.filter((e) => e.id !== id));
  };

  const addExec = () => {
    setExecs((prev) => [...prev, { id: uid(), name: "", role: "" }]);
  };

  /* ── Derived ────────────────────────────────────────── */
  const previewColor = selectedColor;

  return (
    <>
      {/* ── SUCCESS TOAST ───────────────────────────────── */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 animate-fade-up" style={{ animationFillMode: "both" }}>
          <div className="flex items-center gap-3 bg-[#22c55e] text-white pl-4 pr-3 py-3 rounded-[10px] shadow-lg">
            <Check className="w-4 h-4 shrink-0" />
            <span className="text-[13px] font-[600]">Profile saved successfully</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 w-5 h-5 flex items-center justify-center rounded hover:bg-white/20 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8 pb-10">

        {/* ── PAGE HEADER ─────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up opacity-0"
          style={{ animationDelay: "0s", animationFillMode: "both" }}
        >
          <div>
            <h1 className="font-syne font-[800] text-[22px] text-[#0f1828] mb-1">
              Club Profile
            </h1>
            <p className="text-[14px] text-[#8896b0]">
              Manage how your club appears to students.
            </p>
          </div>

          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="flex items-center gap-2 h-10 px-4 rounded-[8px] bg-[#fee2e2] text-[#EF4444] font-syne font-[700] text-[13px] hover:bg-[#fecaca] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
            <button
              onClick={handleDiscard}
              className="h-10 px-5 rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#8896b0] font-syne font-[700] text-[13px] hover:bg-[#f5f6fa] transition-colors"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSave}
              className="h-10 px-5 bg-[#0D7377] text-white rounded-[8px] font-syne font-[700] text-[13px] hover:bg-[#0a5c60] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* ── TWO COLUMN LAYOUT ───────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ═══ LEFT COL — FORM (65%) ═══ */}
          <div className="flex flex-col gap-6 lg:w-[65%]">

            {/* Card 1: Basic Information */}
            <div
              className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-6 animate-fade-up opacity-0"
              style={{ animationDelay: "0.07s", animationFillMode: "both" }}
            >
              <h2 className="font-syne font-[700] text-[16px] text-[#0f1828] mb-5">
                Basic Information
              </h2>

              <div className="flex flex-col gap-5">

                {/* Club Name — locked */}
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-[12px] font-[600] text-[#0f1828]">
                    Club Name
                    <Lock className="w-3 h-3 text-[#aab4c8]" />
                  </label>
                  <input
                    type="text"
                    value="NSU ACM SC"
                    readOnly
                    className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] bg-[#f0f0f8] px-3 text-[13px] text-[#8896b0] cursor-not-allowed outline-none"
                  />
                  <span className="text-[11px] text-[#aab4c8]">
                    Club name can only be changed by Super Admin.
                  </span>
                </div>

                {/* Short Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Short Description
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      maxLength={120}
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      placeholder="A one-line description of your club's mission..."
                      className="w-full rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 py-2.5 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all resize-none"
                    />
                    <span className="absolute bottom-2 right-3 text-[10px] text-[#aab4c8]">
                      {shortDesc.length} / 120
                    </span>
                  </div>
                </div>

                {/* Category — locked */}
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-[12px] font-[600] text-[#0f1828]">
                    Category
                    <Lock className="w-3 h-3 text-[#aab4c8]" />
                  </label>
                  <input
                    type="text"
                    value="Tech"
                    readOnly
                    className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] bg-[#f0f0f8] px-3 text-[13px] text-[#8896b0] cursor-not-allowed outline-none"
                  />
                </div>

                {/* Founded Year */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    value={foundedYear}
                    onChange={(e) => setFoundedYear(e.target.value)}
                    className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                  />
                </div>

                {/* Club Color */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Club Color / Accent
                  </label>
                  <div className="flex items-center gap-2.5">
                    {COLOR_SWATCHES.map((swatch) => (
                      <button
                        key={swatch.value}
                        type="button"
                        onClick={() => setSelectedColor(swatch.value)}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150",
                          selectedColor === swatch.value
                            ? "ring-2 ring-offset-2 ring-[#0D7377] scale-110"
                            : "hover:scale-110"
                        )}
                        style={{ backgroundColor: swatch.value }}
                        title={swatch.name}
                      >
                        {selectedColor === swatch.value && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-[#aab4c8]">
                    This colour appears on your club card and profile page.
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: About Section */}
            <div
              className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-6 animate-fade-up opacity-0"
              style={{ animationDelay: "0.14s", animationFillMode: "both" }}
            >
              <h2 className="font-syne font-[700] text-[16px] text-[#0f1828] mb-5">
                About Section
              </h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-[600] text-[#0f1828]">
                  Club Description
                </label>
                <div className="relative">
                  <textarea
                    rows={6}
                    maxLength={600}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    placeholder="Describe what your club does, its mission, and activities..."
                    className="w-full rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 py-2.5 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all resize-none"
                  />
                  <span className="absolute bottom-2 right-3 text-[10px] text-[#aab4c8]">
                    {aboutText.length} / 600
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Executive Board */}
            <div
              className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-6 animate-fade-up opacity-0"
              style={{ animationDelay: "0.21s", animationFillMode: "both" }}
            >
              <div className="mb-5">
                <h2 className="font-syne font-[700] text-[16px] text-[#0f1828] mb-1">
                  Executive Board Members
                </h2>
                <p className="text-[12px] text-[#8896b0]">
                  These names appear on your public club profile.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {execs.map((exec) => (
                  <div
                    key={exec.id}
                    className="flex items-center gap-3 group"
                  >
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-[700] text-white shrink-0"
                      style={{ backgroundColor: previewColor }}
                    >
                      {exec.name ? getInitials(exec.name) : "?"}
                    </div>

                    {/* Name */}
                    <input
                      type="text"
                      value={exec.name}
                      onChange={(e) => updateExec(exec.id, "name", e.target.value)}
                      placeholder="Full name"
                      className="flex-1 h-[40px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                    />

                    {/* Role */}
                    <input
                      type="text"
                      value={exec.role}
                      onChange={(e) => updateExec(exec.id, "role", e.target.value)}
                      placeholder="Position"
                      className="w-[160px] h-[40px] rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                    />

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => removeExec(exec.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#aab4c8] opacity-0 group-hover:opacity-100 hover:text-[#EF4444] hover:bg-[#fee2e2] transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add member */}
              <button
                type="button"
                onClick={addExec}
                className="mt-4 w-full h-[40px] rounded-[8px] border-[1.5px] border-dashed border-[#e8ecf2] text-[#0D7377] font-[600] text-[13px] flex items-center justify-center gap-2 hover:border-[#0D7377] hover:bg-[#e6f4f5] transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>

            {/* Card 4: Social & Contact Links */}
            <div
              className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-6 animate-fade-up opacity-0"
              style={{ animationDelay: "0.28s", animationFillMode: "both" }}
            >
              <h2 className="font-syne font-[700] text-[16px] text-[#0f1828] mb-5">
                Social & Contact Links
              </h2>

              <div className="flex flex-col gap-4">
                {/* Website */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aab4c8]" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://nsuacm.org"
                      className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] pl-9 pr-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                    />
                  </div>
                </div>

                {/* Facebook */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Facebook Page
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] leading-none">
                      📘
                    </span>
                    <input
                      type="url"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] pl-9 pr-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                    />
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-[600] text-[#0f1828]">
                    Instagram Handle
                  </label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aab4c8]" />
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@nsuacmsc"
                      className="w-full h-[43px] rounded-[8px] border-[1.5px] border-[#e8ecf2] pl-9 pr-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT COL — LIVE PREVIEW (35%) ═══ */}
          <div className="hidden lg:block lg:w-[35%]">
            <div
              className="sticky top-[80px] animate-fade-up opacity-0"
              style={{ animationDelay: "0.35s", animationFillMode: "both" }}
            >
              <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-5">
                {/* Label chip */}
                <div className="mb-4">
                  <span className="inline-block bg-[#e6f4f5] text-[#0D7377] font-syne font-[700] text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full">
                    Live Preview
                  </span>
                </div>

                {/* Preview card */}
                <div className="border-[1.5px] border-[#e8ecf2] rounded-[12px] overflow-hidden">
                  {/* Colored banner */}
                  <div
                    className="h-12 transition-colors duration-300"
                    style={{ backgroundColor: previewColor }}
                  />

                  {/* Content */}
                  <div className="px-4 pb-4 -mt-5">
                    {/* Club initials avatar */}
                    <div
                      className="w-12 h-12 rounded-full border-[3px] border-white flex items-center justify-center text-white font-syne font-[700] text-[14px] shadow-sm transition-colors duration-300"
                      style={{ backgroundColor: previewColor }}
                    >
                      AC
                    </div>

                    <h3 className="font-syne font-[700] text-[16px] text-[#0f1828] mt-3">
                      NSU ACM SC
                    </h3>
                    <p className="text-[12px] text-[#8896b0] mt-1 leading-relaxed line-clamp-2">
                      {shortDesc || "A one-line description of your club's mission..."}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <span
                        className="text-[10px] font-[700] px-2 py-0.5 rounded-full text-white transition-colors duration-300"
                        style={{ backgroundColor: previewColor }}
                      >
                        Tech
                      </span>
                      <span className="text-[11px] text-[#aab4c8]">
                        Est. {foundedYear || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Helper */}
                <p className="text-[11px] text-[#aab4c8] text-center mt-4">
                  This is how students see your club.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE STICKY FOOTER ────────────────────────── */}
        <div className="fixed bottom-16 left-0 right-0 z-30 flex sm:hidden flex-wrap items-center gap-3 px-5 py-3 bg-white border-t border-[#e8ecf2] shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex flex-1 min-w-[30%] items-center justify-center gap-1.5 h-10 rounded-[8px] bg-[#fee2e2] text-[#EF4444] font-syne font-[700] text-[13px] hover:bg-[#fecaca] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Out
          </button>
          <button
            onClick={handleDiscard}
            className="flex-[1.5] min-w-[30%] h-10 rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#8896b0] font-syne font-[700] text-[13px] hover:bg-[#f5f6fa] transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] min-w-[40%] h-10 bg-[#0D7377] text-white rounded-[8px] font-syne font-[700] text-[13px] hover:bg-[#0a5c60] transition-all shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
