"use client";

import { useState } from "react";
import {
  Users,
  Star,
  UserPlus,
  Search,
  Download,
  ChevronDown,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════════ */

type MemberRole = "Executive" | "General Member" | "Technical Team" | "PR Team" | "Event Team";
type MemberStatus = "Active" | "Inactive";

interface MemberRow {
  id: string;
  name: string;
  studentId: string;
  email: string;
  role: MemberRole;
  roleDetail: string;
  joined: string;
  status: MemberStatus;
}

const ROLE_FILTERS: { label: string; value: MemberRole | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Executive", value: "Executive" },
  { label: "General Member", value: "General Member" },
  { label: "Technical Team", value: "Technical Team" },
  { label: "PR Team", value: "PR Team" },
  { label: "Event Team", value: "Event Team" },
];

const ROLE_STYLES: Record<MemberRole, { bg: string; text: string }> = {
  Executive: { bg: "bg-[#e6f4f5]", text: "text-[#0D7377]" },
  "General Member": { bg: "bg-[#f5f6fa]", text: "text-[#8896b0]" },
  "Technical Team": { bg: "bg-[#eff6ff]", text: "text-[#3b82f6]" },
  "PR Team": { bg: "bg-[#fdf2f8]", text: "text-[#ec4899]" },
  "Event Team": { bg: "bg-[#FEF3C7]", text: "text-[#F59E0B]" },
};

const STATUS_STYLES: Record<MemberStatus, { bg: string; text: string }> = {
  Active: { bg: "bg-[#dcfce7]", text: "text-[#22c55e]" },
  Inactive: { bg: "bg-[#f5f6fa]", text: "text-[#8896b0]" },
};

const MEMBERS: MemberRow[] = [
  { id: "1", name: "Arif Rahman",    studentId: "2212001", email: "arif.rahman@northsouth.edu",   role: "Executive", roleDetail: "President",          joined: "Jan 2025", status: "Active" },
  { id: "2", name: "Sadia Islam",    studentId: "2212002", email: "sadia.islam@northsouth.edu",   role: "Executive", roleDetail: "Vice President",     joined: "Jan 2025", status: "Active" },
  { id: "3", name: "Tanvir Ahmed",   studentId: "2212003", email: "tanvir.ahmed@northsouth.edu",  role: "Executive", roleDetail: "General Secretary",  joined: "Jan 2025", status: "Active" },
  { id: "4", name: "Nusrat Jahan",   studentId: "2212004", email: "nusrat.jahan@northsouth.edu",  role: "Executive", roleDetail: "Treasurer",          joined: "Jan 2025", status: "Active" },
  { id: "5", name: "Rakib Hossain",  studentId: "2213005", email: "rakib.hossain@northsouth.edu", role: "Technical Team", roleDetail: "",             joined: "Mar 2026", status: "Active" },
  { id: "6", name: "Tanjim Hossain", studentId: "2213006", email: "tanjim.hossain@northsouth.edu", role: "General Member", roleDetail: "",            joined: "Mar 2026", status: "Active" },
  { id: "7", name: "Mehazabien C.",  studentId: "2213007", email: "mehazabien@northsouth.edu",    role: "PR Team", roleDetail: "",                   joined: "Mar 2026", status: "Active" },
  { id: "8", name: "Ashfaq Zaman",   studentId: "2213008", email: "ashfaq.zaman@northsouth.edu",  role: "Event Team", roleDetail: "",                joined: "Mar 2026", status: "Active" },
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
   REMOVE CONFIRMATION DIALOG
   ═══════════════════════════════════════════════════════════ */

function RemoveDialog({
  memberName,
  onCancel,
  onConfirm,
}: {
  memberName: string;
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
            <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
          </div>
          <h3 className="font-syne font-[700] text-[18px] text-[#0f1828] mb-2">
            Remove Member?
          </h3>
          <p className="text-[13px] text-[#8896b0] mb-6 leading-relaxed">
            Removing {memberName} will revoke their club membership.
            This action cannot be undone.
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
              Remove
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

export default function MembersPage() {
  const [activeFilter, setActiveFilter] = useState<MemberRole | "All">("All");
  const [search, setSearch] = useState("");
  const [removeTarget, setRemoveTarget] = useState<MemberRow | null>(null);
  const [members, setMembers] = useState<MemberRow[]>(MEMBERS);

  const filtered = members.filter((m) => {
    if (activeFilter !== "All" && m.role !== activeFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      if (!m.name.toLowerCase().includes(q) && !m.studentId.includes(q)) return false;
    }
    return true;
  });

  const confirmRemove = () => {
    if (!removeTarget) return;
    setMembers((prev) => prev.filter((m) => m.id !== removeTarget.id));
    setRemoveTarget(null);
  };

  return (
    <>
      {removeTarget && (
        <RemoveDialog
          memberName={removeTarget.name}
          onCancel={() => setRemoveTarget(null)}
          onConfirm={confirmRemove}
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
              Members
            </h1>
            <p className="text-[14px] text-[#8896b0]">
              NSU ACM SC · 142 registered members
            </p>
          </div>
          <button className="inline-flex items-center gap-2 h-10 px-5 rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#8896b0] font-syne font-[700] text-[13px] hover:border-[#0D7377] hover:text-[#0D7377] transition-colors w-fit shrink-0 bg-white">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* ── STAT ROW ─────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={Users} value="142" label="Total Members" iconColor="#0D7377" iconBg="#e6f4f5" />
          <StatCard icon={Star} value="4" label="Executive Board" iconColor="#F59E0B" iconBg="#FEF3C7" />
          <StatCard icon={UserPlus} value="28" label="New This Cycle" iconColor="#22c55e" iconBg="#dcfce7" />
        </div>

        {/* ── FILTER + SEARCH ──────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-up opacity-0"
          style={{ animationDelay: "0.14s", animationFillMode: "both" }}
        >
          <div className="flex flex-wrap items-center gap-2">
            {ROLE_FILTERS.map((f) => (
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

        {/* ── MEMBERS TABLE ────────────────────────────────── */}
        <div
          className="animate-fade-up opacity-0"
          style={{ animationDelay: "0.21s", animationFillMode: "both" }}
        >
          {filtered.length === 0 ? (
            <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] py-16 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border-[2px] border-dashed border-[#e8ecf2] flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[#aab4c8]" />
              </div>
              <p className="font-syne font-[700] text-[15px] text-[#0f1828] mb-1">
                No members found
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
                        Member
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                        Student ID
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                        Role
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-[700] uppercase tracking-[0.06em] text-[#aab4c8]">
                        Joined
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
                    {filtered.map((m) => (
                      <Row
                        key={m.id}
                        member={m}
                        onRemove={() => setRemoveTarget(m)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile cards ── */}
              <div className="flex flex-col gap-3 md:hidden">
                {filtered.map((m) => (
                  <MobileCard
                    key={m.id}
                    member={m}
                    onRemove={() => setRemoveTarget(m)}
                  />
                ))}
              </div>
            </>
          )}

          {/* ── Pagination ── */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-[12px] text-[#8896b0]">
              Showing <span className="font-[600] text-[#0f1828]">1–8</span> of{" "}
              <span className="font-[600] text-[#0f1828]">142</span>
            </p>
            <div className="flex items-center gap-2">
              <button className="h-9 w-9 flex items-center justify-center rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#8896b0] hover:border-[#0D7377] hover:text-[#0D7377] transition-colors bg-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="h-9 w-9 flex items-center justify-center rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#8896b0] hover:border-[#0D7377] hover:text-[#0D7377] transition-colors bg-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAT CARD
   ═══════════════════════════════════════════════════════════ */

function StatCard({
  icon: Icon,
  value,
  label,
  iconColor,
  iconBg,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-4 flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="w-[18px] h-[18px]" style={{ color: iconColor }} />
      </div>
      <div>
        <p className="font-syne font-[700] text-[22px] text-[#0f1828] leading-none">
          {value}
        </p>
        <p className="text-[12px] text-[#8896b0] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TABLE ROW (Desktop)
   ═══════════════════════════════════════════════════════════ */

function Row({
  member,
  onRemove,
}: {
  member: MemberRow;
  onRemove: () => void;
}) {
  const [roleOpen, setRoleOpen] = useState(false);

  return (
    <tr className="border-b border-[#e8ecf2] hover:bg-[#fafafc] transition-colors group">
      {/* Member */}
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-[700] shrink-0",
              member.role === "Executive"
                ? "bg-[#e6f4f5] text-[#0D7377]"
                : "bg-[#f5f6fa] text-[#8896b0]"
            )}
          >
            {getInitials(member.name)}
          </div>
          <div>
            <p className="font-syne font-[700] text-[13px] text-[#0f1828] leading-tight">
              {member.name}
            </p>
            <p className="text-[11px] text-[#8896b0] mt-0.5">{member.email}</p>
          </div>
        </div>
      </td>

      {/* Student ID */}
      <td className="px-5 py-3 text-[13px] text-[#0f1828] font-[500]">
        {member.studentId}
      </td>

      {/* Role */}
      <td className="px-5 py-3">
        <span
          className={cn(
            "inline-block text-[11px] font-[600] px-2.5 py-1 rounded-full",
            ROLE_STYLES[member.role].bg,
            ROLE_STYLES[member.role].text
          )}
        >
          {member.roleDetail || member.role}
        </span>
      </td>

      {/* Joined */}
      <td className="px-5 py-3 text-[12px] text-[#8896b0]">
        {member.joined}
      </td>

      {/* Status */}
      <td className="px-5 py-3">
        <span
          className={cn(
            "inline-block text-[11px] font-[700] px-2.5 py-1 rounded-full",
            STATUS_STYLES[member.status].bg,
            STATUS_STYLES[member.status].text
          )}
        >
          {member.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Role dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleOpen(!roleOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#8896b0] hover:text-[#0D7377] hover:bg-[#e6f4f5] transition-colors"
              title="Change Role"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            {roleOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border-[1.5px] border-[#e8ecf2] rounded-[10px] shadow-lg py-1 w-[160px] z-10">
                {(["Executive", "Technical Team", "PR Team", "Event Team", "General Member"] as MemberRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleOpen(false)}
                    className="w-full text-left px-3 py-1.5 text-[12px] font-[600] text-[#0f1828] hover:bg-[#f5f6fa] transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Remove */}
          <button
            onClick={onRemove}
            className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#8896b0] hover:text-[#EF4444] hover:bg-[#fee2e2] transition-colors"
            title="Remove Member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ═══════════════════════════════════════════════════════════
   MOBILE CARD
   ═══════════════════════════════════════════════════════════ */

function MobileCard({
  member,
  onRemove,
}: {
  member: MemberRow;
  onRemove: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-[700] shrink-0",
            member.role === "Executive"
              ? "bg-[#e6f4f5] text-[#0D7377]"
              : "bg-[#f5f6fa] text-[#8896b0]"
          )}
        >
          {getInitials(member.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-syne font-[700] text-[14px] text-[#0f1828] truncate">
            {member.name}
          </p>
          <p className="text-[11px] text-[#8896b0] mt-0.5">
            {member.studentId} · {member.joined}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={cn(
                "text-[10px] font-[600] px-2.5 py-0.5 rounded-full",
                ROLE_STYLES[member.role].bg,
                ROLE_STYLES[member.role].text
              )}
            >
              {member.roleDetail || member.role}
            </span>
            <span
              className={cn(
                "text-[10px] font-[700] px-2.5 py-0.5 rounded-full",
                STATUS_STYLES[member.status].bg,
                STATUS_STYLES[member.status].text
              )}
            >
              {member.status}
            </span>
          </div>
        </div>

        {/* Dots menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#8896b0] hover:bg-[#f5f6fa] transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border-[1.5px] border-[#e8ecf2] rounded-[10px] shadow-lg py-1 w-[140px] z-10">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full text-left px-3 py-2 text-[12px] font-[600] text-[#0f1828] hover:bg-[#f5f6fa] transition-colors"
              >
                Change Role
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onRemove();
                }}
                className="w-full text-left px-3 py-2 text-[12px] font-[600] text-[#EF4444] hover:bg-[#fee2e2] transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
