"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, AlertTriangle, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { recruitmentApi } from "@/lib/api";

type ApplicantStatus = "New" | "Interview" | "Accepted" | "Rejected";

interface ApplicantRow {
  id: string;
  name: string;
  email: string;
  position: string;
  date: string;
  status: ApplicantStatus;
  dualClub?: boolean;
}

const STATUS_FILTERS: { label: string; value: ApplicantStatus | "All" }[] = [
  { label: "All", value: "All" },
  { label: "New", value: "New" },
  { label: "Interview Scheduled", value: "Interview" },
  { label: "Accepted", value: "Accepted" },
  { label: "Rejected", value: "Rejected" },
];

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  NEW: { bg: "bg-[#e6f4f5]", text: "text-[#0D7377]" },
  INTERVIEW: { bg: "bg-[#FEF3C7]", text: "text-[#F59E0B]" },
  ACCEPTED: { bg: "bg-[#dcfce7]", text: "text-[#22c55e]" },
  REJECTED: { bg: "bg-[#fee2e2]", text: "text-[#EF4444]" },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function transformApplication(app: any): ApplicantRow {
  return {
    id: app.id,
    name: app.user?.name || "Unknown",
    email: app.user?.email || "",
    position: app.position,
    date: new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    status: app.status as ApplicantStatus,
  };
}

export default function RecruitmentManagerPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<ApplicantStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState<ApplicantRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recruitmentCycle, setRecruitmentCycle] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.role !== "CLUB_ADMIN" || !user.clubId) return;

      try {
        const cycles = await recruitmentApi.getCycles({ clubId: user.clubId, status: "OPEN" });
        if (cycles.length > 0) {
          setRecruitmentCycle(cycles[0]);
          const cycleData = await recruitmentApi.getCycleById(cycles[0].id);
          setApplications(cycleData.applications?.map(transformApplication) || []);
        }
      } catch (err) {
        console.error("Failed to fetch recruitment data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      if (activeFilter !== "All" && a.status !== activeFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !a.id.includes(q)) return false;
      }
      return true;
    });
  }, [applications, activeFilter, search]);

  const getStatusStyle = (status: string) => {
    return STATUS_STYLES[status] || { bg: "bg-[#f5f6fa]", text: "text-[#8896b0]" };
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const newCount = applications.filter(a => a.status === "NEW").length;
  const interviewCount = applications.filter(a => a.status === "INTERVIEW").length;
  const acceptedCount = applications.filter(a => a.status === "ACCEPTED").length;

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* ── PAGE HEADER ──────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up opacity-0"
        style={{ animationDelay: "0s", animationFillMode: "both" }}
      >
        <div>
          <h1 className="font-syne font-[800] text-[22px] text-[#0f1828] mb-1">
            Recruitment Manager
          </h1>
          <p className="text-[14px] text-[#8896b0]">
            Spring 2026 Cycle · NSU ACM SC
          </p>
        </div>
        <Link
          href="/admin/recruitment/settings"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-[8px] border-[1.5px] border-[#0D7377] text-[#0D7377] font-syne font-[700] text-[13px] hover:bg-[#e6f4f5] transition-colors w-fit shrink-0"
        >
          <SettingsIcon className="w-4 h-4" />
          Settings
        </Link>
      </div>

      {/* ── RECRUITMENT STATUS BANNER ────────────────────── */}
      <div
        className="bg-[#101828] rounded-[12px] p-5 animate-fade-up opacity-0"
        style={{ animationDelay: "0.07s", animationFillMode: "both" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: status */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${recruitmentCycle?.status === "OPEN" ? "bg-[#0D7377]" : "bg-[#8896b0]"}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${recruitmentCycle?.status === "OPEN" ? "bg-[#0D7377]" : "bg-[#8896b0]"}`} />
            </span>
            <div>
              <p className="font-syne font-[700] text-[14px] text-white">
                Recruitment is {recruitmentCycle?.status === "OPEN" ? "OPEN" : "CLOSED"}
              </p>
              <p className="text-[12px] text-[rgba(255,255,255,0.4)] mt-0.5">
                {recruitmentCycle 
                  ? `Closes ${new Date(recruitmentCycle.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                  : "No active recruitment cycle"}
              </p>
            </div>
          </div>

          {/* Center: stat pills */}
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-[12px] font-[600] text-white">
              {applications.length} Applied
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-[12px] font-[600] text-white">
              {interviewCount} Interview
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-[12px] font-[600] text-white">
              {acceptedCount} Accepted
            </span>
          </div>

          {/* Right: close button */}
          <button className="h-10 px-5 rounded-[8px] border-[1.5px] border-white/[0.25] text-white font-syne font-[700] text-[13px] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors shrink-0">
            Close Recruitment
          </button>
        </div>
      </div>

      {/* ── FILTER + SEARCH BAR ──────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-up opacity-0"
        style={{ animationDelay: "0.14s", animationFillMode: "both" }}
      >
        {/* Status filter chips */}
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
        <div className="relative w-full sm:w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aab4c8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full h-9 rounded-[8px] border-[1.5px] border-[#e8ecf2] pl-9 pr-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] transition-all bg-white"
          />
        </div>
      </div>

      {/* ── APPLICANT TABLE ──────────────────────────────── */}
      <div
        className="animate-fade-up opacity-0"
        style={{ animationDelay: "0.21s", animationFillMode: "both" }}
      >
        {filtered.length === 0 ? (
          <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] py-16 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full border-[2px] border-dashed border-[#e8ecf2] flex items-center justify-center mb-4">
              <span className="text-3xl">👤</span>
            </div>
            <p className="font-syne font-[700] text-[15px] text-[#0f1828] mb-1">
              No applicants found
            </p>
            <p className="text-[13px] text-[#8896b0]">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="hidden md:block bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f5f6fa] border-b border-[#e8ecf2]">
                    <th className="text-left px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                      Applicant
                    </th>
                    <th className="text-left px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                      Student ID
                    </th>
                    <th className="text-left px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                      Applied For
                    </th>
                    <th className="text-left px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                      Date
                    </th>
                    <th className="text-left px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                      Status
                    </th>
                    <th className="text-right px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-[#e8ecf2] hover:bg-[#fafafc] transition-colors cursor-pointer group"
                    >
                      {/* Applicant */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#e6f4f5] flex items-center justify-center text-[11px] font-[700] text-[#0D7377] shrink-0">
                            {getInitials(a.name)}
                          </div>
                          <div>
                            <p className="font-syne font-[700] text-[13px] text-[#0f1828] leading-tight">
                              {a.name}
                            </p>
                            <p className="text-[11px] text-[#8896b0] mt-0.5">
                              {a.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="px-5 py-3 text-[13px] text-[#0f1828] font-[500]">
                        {a.id}
                      </td>

                      {/* Applied For */}
                      <td className="px-5 py-3">
                        <span className="inline-block text-[12px] font-[600] text-[#8896b0] bg-[#f5f6fa] px-2.5 py-0.5 rounded-full">
                          {a.position}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3 text-[13px] text-[#8896b0]">
                        {a.date}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-block text-[11px] font-[700] px-2.5 py-1 rounded-full",
                              getStatusStyle(a.status).bg,
                              getStatusStyle(a.status).text
                            )}
                          >
                            {getStatusLabel(a.status)}
                          </span>
                          {a.dualClub && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-[600] px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#F59E0B]">
                              <AlertTriangle className="w-3 h-3" />
                              Applied to 2 clubs
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3 text-right">
                        <Link
                          href={`/admin/recruitment/${a.id}`}
                          className="text-[13px] font-[600] text-[#0D7377] hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile cards ── */}
            <div className="flex flex-col gap-3 md:hidden">
              {filtered.map((a) => (
                <div
                  key={a.id}
                  className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-[#e6f4f5] flex items-center justify-center text-[12px] font-[700] text-[#0D7377] shrink-0">
                      {getInitials(a.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-syne font-[700] text-[14px] text-[#0f1828] truncate">
                        {a.name}
                      </p>
                      <p className="text-[11px] text-[#8896b0] mt-0.5">
                        {a.id} · {a.position}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-[700] px-2.5 py-1 rounded-full shrink-0",
                        getStatusStyle(a.status).bg,
                        getStatusStyle(a.status).text
                      )}
                    >
                      {getStatusLabel(a.status)}
                    </span>
                  </div>

                  {a.dualClub && (
                    <div className="flex items-center gap-1.5 mb-3 text-[11px] font-[600] text-[#F59E0B] bg-[#FEF3C7] rounded-full px-2.5 py-1 w-fit">
                      <AlertTriangle className="w-3 h-3" />
                      Applied to 2 clubs
                    </div>
                  )}

                  <Link
                    href={`/admin/recruitment/${a.id}`}
                    className="block text-center h-9 rounded-[8px] bg-[#0D7377] text-white font-syne font-[700] text-[13px] hover:bg-[#0a5c60] transition-colors"
                  >
                    View &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
