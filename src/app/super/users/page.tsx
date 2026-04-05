"use client";

import { useState } from "react";
import {
  Users,
  Shield,
  Star,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldOff,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

type UserRole = "Student" | "Club Admin" | "Super Admin";
type UserStatus = "Active" | "Inactive" | "Suspended";
type RoleFilter = "All Users" | "Students" | "Club Admins" | "Super Admins";
type StatusFilter = "All Status" | "Active" | "Inactive" | "Suspended";

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  joined: string;
  status: UserStatus;
  initials: string;
}

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const mockUsers: MockUser[] = [
  { id: "1", name: "Alif Shahriar", email: "alif.shahriar@northsouth.edu", role: "Student", department: "CSE", joined: "Jan 2026", status: "Active", initials: "AS" },
  { id: "2", name: "Arif Rahman", email: "arif.rahman@northsouth.edu", role: "Club Admin", department: "NSU ACM SC", joined: "Jan 2025", status: "Active", initials: "AR" },
  { id: "3", name: "Sadia Islam", email: "sadia.islam@northsouth.edu", role: "Student", department: "BBA", joined: "Jan 2026", status: "Active", initials: "SI" },
  { id: "4", name: "Shakib Al Hasan", email: "shakib.hasan@northsouth.edu", role: "Club Admin", department: "NSU Drama Club", joined: "Jan 2025", status: "Active", initials: "SH" },
  { id: "5", name: "Irfan Mahmud", email: "irfan.mahmud@northsouth.edu", role: "Club Admin", department: "NSU Finance Club", joined: "Jan 2025", status: "Active", initials: "IM" },
  { id: "6", name: "Farhan Ahmed", email: "farhan.ahmed@northsouth.edu", role: "Student", department: "EEE", joined: "Feb 2026", status: "Active", initials: "FA" },
  { id: "7", name: "Nusrat Jahan", email: "nusrat.jahan@northsouth.edu", role: "Student", department: "ENL", joined: "Jan 2026", status: "Active", initials: "NJ" },
  { id: "8", name: "Tanjim Hossain", email: "tanjim.hossain@northsouth.edu", role: "Student", department: "CSE", joined: "Mar 2026", status: "Suspended", initials: "TH" },
  { id: "9", name: "Rakib Hossain", email: "rakib.hossain@northsouth.edu", role: "Club Admin", department: "NSU Photography", joined: "Jan 2025", status: "Inactive", initials: "RH" },
  { id: "10", name: "Super Admin", email: "admin@northsouth.edu", role: "Super Admin", department: "Platform", joined: "Jan 2025", status: "Active", initials: "SA" },
];

const roleFilters: RoleFilter[] = ["All Users", "Students", "Club Admins", "Super Admins"];
const statusFilters: StatusFilter[] = ["All Status", "Active", "Inactive", "Suspended"];
const roles: UserRole[] = ["Student", "Club Admin", "Super Admin"];

const ITEMS_PER_PAGE = 10;

/* ═══════════════════════════════════════════════════════════
   SUSPEND MODAL
   ═══════════════════════════════════════════════════════════ */

function SuspendModal({
  user,
  onConfirm,
  onCancel,
}: {
  user: MockUser;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-up opacity-0"
      style={{ animationFillMode: "both" }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-[16px] shadow-2xl max-w-[420px] w-full mx-4 p-6 relative animate-fade-up opacity-0"
        style={{ animationDelay: "0.07s", animationFillMode: "both" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-[#f5f6fa] transition-colors"
        >
          <X className="w-4 h-4 text-[#8896b0]" />
        </button>

        <div className="w-12 h-12 rounded-[12px] bg-[#FEF3C7] flex items-center justify-center mb-4">
          <ShieldOff className="w-6 h-6 text-[#D97706]" />
        </div>

        <h2 className="font-syne font-[700] text-[18px] text-[#0f1828] mb-2">
          Suspend User?
        </h2>

        <div className="text-[13px] text-[#8896b0] leading-relaxed mb-4 space-y-1">
          <p>
            Suspending <span className="font-[600] text-[#0f1828]">{user.name}</span> will:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-[12px]">
            <li>Prevent them from logging in</li>
            <li>Hide their applications and RSVPs</li>
            <li>Send them an email notification</li>
          </ul>
          <p className="text-[11px] text-[#aab4c8] mt-1">You can reinstate the account at any time.</p>
        </div>

        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for suspension (required)"
          className="w-full h-10 rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-colors mb-5"
          autoFocus
        />

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#0f1828] font-syne font-[700] text-[13px] hover:bg-[#f5f6fa] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (reason.trim()) onConfirm(reason.trim());
            }}
            disabled={!reason.trim()}
            className={cn(
              "flex-1 h-10 rounded-[8px] font-syne font-[700] text-[13px] text-white transition-all",
              reason.trim()
                ? "bg-[#D97706] hover:bg-[#b45309] hover:scale-[1.02]"
                : "bg-[#d4d8e0] cursor-not-allowed"
            )}
          >
            Suspend Account
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DELETE MODAL
   ═══════════════════════════════════════════════════════════ */

function DeleteModal({
  user,
  onConfirm,
  onCancel,
}: {
  user: MockUser;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [input, setInput] = useState("");
  const matches = input.trim().toLowerCase() === user.email.toLowerCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-up opacity-0"
      style={{ animationFillMode: "both" }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-[16px] shadow-2xl max-w-[420px] w-full mx-4 p-6 relative animate-fade-up opacity-0"
        style={{ animationDelay: "0.07s", animationFillMode: "both" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-[#f5f6fa] transition-colors"
        >
          <X className="w-4 h-4 text-[#8896b0]" />
        </button>

        <div className="w-12 h-12 rounded-[12px] bg-[#fee2e2] flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 text-[#EF4444]" />
        </div>

        <h2 className="font-syne font-[700] text-[18px] text-[#EF4444] mb-2">
          Delete Account?
        </h2>

        <div className="text-[13px] text-[#8896b0] leading-relaxed mb-4">
          <p>
            This will permanently delete all data for <span className="font-[600] text-[#0f1828]">{user.name}</span>.
          </p>
          <p className="text-[11px] text-[#EF4444] font-[600] mt-1">This action CANNOT be undone.</p>
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type ${user.email} to confirm`}
          className="w-full h-10 rounded-[8px] border-[1.5px] border-[#e8ecf2] px-3 text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] focus:outline-none focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444] transition-colors mb-5"
          autoFocus
        />

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#0f1828] font-syne font-[700] text-[13px] hover:bg-[#f5f6fa] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!matches}
            className={cn(
              "flex-1 h-10 rounded-[8px] font-syne font-[700] text-[13px] text-white transition-all",
              matches
                ? "bg-[#EF4444] hover:bg-[#dc2626] hover:scale-[1.02]"
                : "bg-[#d4d8e0] cursor-not-allowed"
            )}
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROLE CHANGE POPOVER
   ═══════════════════════════════════════════════════════════ */

function RoleChangePopover({
  user,
  onSave,
  onCancel,
}: {
  user: MockUser;
  onSave: (role: UserRole) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<UserRole>(user.role);

  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onCancel} />
      <div className="absolute z-30 mt-2 bg-white border-[1.5px] border-[#e8ecf2] rounded-[10px] shadow-[0_8px_24px_rgba(13,115,119,0.12)] p-4 min-w-[220px] animate-fade-up opacity-0" style={{ animationFillMode: "both" }}>
        <p className="text-[13px] font-[600] text-[#0f1828] mb-3">
          Change Role — {user.name}
        </p>
        <div className="space-y-2 mb-4">
          {roles.map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`role-${user.id}`}
                checked={selected === r}
                onChange={() => setSelected(r)}
                className="w-4 h-4 border-[#e8ecf2] text-[#0D7377] focus:ring-[#0D7377] focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[13px] font-[500] text-[#0f1828]">{r}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSave(selected)}
            className="flex-1 h-9 rounded-[8px] bg-[#0D7377] text-white font-syne font-[700] text-[12px] hover:bg-[#0a5c60] hover:scale-[1.02] transition-all flex items-center justify-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            Save Role
          </button>
          <button
            onClick={onCancel}
            className="h-9 px-3 rounded-[8px] text-[12px] font-[600] text-[#8896b0] hover:text-[#0f1828] hover:bg-[#f5f6fa] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function SuperUsersPage() {
  const [users, setUsers] = useState<MockUser[]>(mockUsers);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All Users");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Status");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rolePopoverId, setRolePopoverId] = useState<string | null>(null);
  const [suspendUserId, setSuspendUserId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const filtered = users
    .filter((u) => {
      if (roleFilter === "All Users") return true;
      if (roleFilter === "Students") return u.role === "Student";
      if (roleFilter === "Club Admins") return u.role === "Club Admin";
      if (roleFilter === "Super Admins") return u.role === "Super Admin";
      return true;
    })
    .filter((u) => {
      if (statusFilter === "All Status") return true;
      return u.status === statusFilter;
    })
    .filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paged = filtered.slice(start, start + ITEMS_PER_PAGE);
  const end = Math.min(start + ITEMS_PER_PAGE, filtered.length);

  const totalStudents = users.filter((u) => u.role === "Student").length;
  const totalClubAdmins = users.filter((u) => u.role === "Club Admin").length;
  const totalSuperAdmins = users.filter((u) => u.role === "Super Admin").length;

  const suspendUser = users.find((u) => u.id === suspendUserId);
  const deleteUser = users.find((u) => u.id === deleteUserId);

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
    setRolePopoverId(null);
  };

  const handleSuspend = (_id: string, _reason: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === _id ? { ...u, status: "Suspended" as UserStatus } : u))
    );
    setSuspendUserId(null);
  };

  const handleReinstate = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Active" as UserStatus } : u))
    );
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteUserId(null);
  };

  const avatarBg = (role: UserRole) => {
    if (role === "Student") return "bg-[#0D7377]";
    if (role === "Club Admin") return "bg-[#D97706]";
    return "bg-[#D97706]";
  };

  const roleBadgeClass = (role: UserRole) => {
    if (role === "Student") return "bg-[#e6f4f5] text-[#0D7377]";
    if (role === "Club Admin") return "bg-[#FEF3C7] text-[#D97706]";
    return "bg-[rgba(217,119,6,0.15)] text-[#D97706] border border-[rgba(217,119,6,0.3)]";
  };

  const statusBadgeClass = (status: UserStatus) => {
    if (status === "Active") return "bg-[#dcfce7] text-[#22c55e]";
    if (status === "Inactive") return "bg-[#f5f6fa] text-[#8896b0]";
    return "bg-[#fee2e2] text-[#EF4444]";
  };

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* ── PAGE HEADER ───────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 animate-fade-up opacity-0"
        style={{ animationDelay: "0s", animationFillMode: "both" }}
      >
        <div>
          <h1 className="font-syne font-[800] text-[22px] text-[#0f1828] mb-1">
            User Management
          </h1>
          <p className="text-[14px] text-[#8896b0]">
            All registered NSU ClubHub accounts
          </p>
        </div>
        <button className="flex items-center gap-2 h-10 px-5 rounded-[8px] border-[1.5px] border-[#0D7377] text-[#0D7377] font-syne font-[700] text-[13px] hover:bg-[#e6f4f5] transition-colors shrink-0">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* ── STAT ROW ──────────────────────────────────── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up opacity-0"
        style={{ animationDelay: "0.07s", animationFillMode: "both" }}
      >
        {/* Total Students */}
        <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-[#e6f4f5] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-[#0D7377]" />
          </div>
          <div>
            <p className="font-syne font-[700] text-[22px] text-[#0f1828] leading-none">
              {totalStudents.toLocaleString()}
            </p>
            <p className="text-[12px] text-[#8896b0] mt-0.5">Total Students</p>
          </div>
        </div>

        {/* Club Admins */}
        <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-[#FEF3C7] flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-[#D97706]" />
          </div>
          <div>
            <p className="font-syne font-[700] text-[22px] text-[#0f1828] leading-none">
              {totalClubAdmins}
            </p>
            <p className="text-[12px] text-[#8896b0] mt-0.5">Club Admins</p>
          </div>
        </div>

        {/* Super Admins */}
        <div className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-[rgba(217,119,6,0.15)] flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-[#D97706]" />
          </div>
          <div>
            <p className="font-syne font-[700] text-[22px] text-[#0f1828] leading-none">
              {totalSuperAdmins}
            </p>
            <p className="text-[12px] text-[#8896b0] mt-0.5">Super Admins</p>
          </div>
        </div>
      </div>

      {/* ── FILTER + SEARCH BAR ───────────────────────── */}
      <div
        className="flex flex-col gap-3 animate-fade-up opacity-0"
        style={{ animationDelay: "0.14s", animationFillMode: "both" }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          {/* Role filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {roleFilters.map((f) => (
              <button
                key={f}
                onClick={() => { setRoleFilter(f); setPage(1); }}
                className={cn(
                  "h-8 px-3.5 rounded-full text-[12px] font-[600] transition-all",
                  roleFilter === f
                    ? "bg-[#0D7377] text-white"
                    : "bg-white border-[1.5px] border-[#e8ecf2] text-[#8896b0] hover:text-[#0f1828] hover:border-[#0D7377]"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="flex-1 min-w-[200px] max-w-[320px] ml-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aab4c8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email..."
              className="w-full h-9 pl-9 pr-3 rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] focus:outline-none focus:border-[#0D7377] focus:ring-1 focus:ring-[#0D7377] transition-colors bg-white"
            />
          </div>

          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
            className="h-9 px-3 rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[12px] font-[600] text-[#8896b0] bg-white focus:outline-none focus:border-[#0D7377] focus:ring-1 focus:ring-[#0D7377] transition-colors cursor-pointer appearance-none pr-8"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238896b0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
            }}
          >
            {statusFilters.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── USERS TABLE ───────────────────────────────── */}
      <div
        className="bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] overflow-hidden animate-fade-up opacity-0"
        style={{ animationDelay: "0.21s", animationFillMode: "both" }}
      >
        {/* Table header */}
        <div className="bg-[#f5f6fa] border-b border-[#e8ecf2] grid grid-cols-[1fr_1.3fr_0.8fr_0.6fr_0.6fr_0.5fr] px-5 py-2.5 text-[11px] font-[700] uppercase text-[#aab4c8] tracking-wider">
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Joined</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {/* Table rows */}
        {paged.length > 0 ? (
          paged.map((user, i) => {
            const isSuspended = user.status === "Suspended";
            const isRolePopoverOpen = rolePopoverId === user.id;

            return (
              <div
                key={user.id}
                className={cn(
                  "grid grid-cols-[1fr_1.3fr_0.8fr_0.6fr_0.6fr_0.5fr] px-5 py-3 border-b border-[#e8ecf2] items-center hover:bg-[#fafafc] transition-colors last:border-b-0 relative",
                  isSuspended && "bg-[rgba(239,68,68,0.04)]"
                )}
                style={{ animationDelay: `${0.03 * i}s` }}
              >
                {/* User cell */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-syne font-[700] shrink-0", avatarBg(user.role))}>
                    {user.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-syne font-[700] text-[13px] text-[#0f1828] truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-[#aab4c8] truncate">
                      {user.department}
                    </p>
                  </div>
                </div>

                {/* Email cell */}
                <p className="text-[12px] text-[#8896b0] truncate pr-4">
                  {user.email}
                </p>

                {/* Role cell */}
                <div>
                  <span className={cn(
                    "text-[10px] font-[700] px-2.5 py-0.5 rounded-full inline-block",
                    roleBadgeClass(user.role)
                  )}>
                    {user.role}
                  </span>
                </div>

                {/* Joined cell */}
                <span className="text-[12px] text-[#aab4c8]">
                  {user.joined}
                </span>

                {/* Status cell */}
                <div>
                  <span className={cn(
                    "text-[10px] font-[700] px-2.5 py-0.5 rounded-full inline-block",
                    statusBadgeClass(user.status)
                  )}>
                    {user.status}
                  </span>
                </div>

                {/* Actions cell */}
                <div className="flex items-center gap-1">
                  {isSuspended ? (
                    <button
                      onClick={() => handleReinstate(user.id)}
                      className="text-[11px] font-[600] text-[#22c55e] hover:underline"
                    >
                      Reinstate
                    </button>
                  ) : (
                    <>
                      <div className="relative">
                        <button
                          onClick={() => setRolePopoverId(isRolePopoverOpen ? null : user.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-[6px] hover:bg-[#e6f4f5] transition-colors"
                          title="Edit Role"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#0D7377]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </button>
                        {isRolePopoverOpen && (
                          <RoleChangePopover
                            user={user}
                            onSave={(role) => handleRoleChange(user.id, role)}
                            onCancel={() => setRolePopoverId(null)}
                          />
                        )}
                      </div>

                      {user.role !== "Super Admin" && (
                        <>
                          <button
                            onClick={() => setSuspendUserId(user.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-[6px] hover:bg-[#FEF3C7] transition-colors"
                            title="Suspend"
                          >
                            <ShieldOff className="w-3.5 h-3.5 text-[#D97706]" />
                          </button>
                          <button
                            onClick={() => setDeleteUserId(user.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-[6px] hover:bg-[#fee2e2] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Users className="w-10 h-10 text-[#aab4c8] mb-3" />
            <h2 className="font-syne font-[700] text-[16px] text-[#0f1828] mb-1">
              No users found
            </h2>
            <p className="text-[13px] text-[#8896b0]">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* ── PAGINATION ────────────────────────────────── */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between animate-fade-up opacity-0"
          style={{ animationDelay: "0.28s", animationFillMode: "both" }}
        >
          <p className="text-[12px] text-[#aab4c8]">
            Showing {start + 1}–{end} of {filtered.length} user{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={cn(
                "w-8 h-8 rounded-[8px] text-[12px] font-[600] transition-colors flex items-center justify-center",
                page === 1
                  ? "text-[#aab4c8] cursor-not-allowed"
                  : "text-[#0f1828] hover:bg-[#f5f6fa]"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "w-8 h-8 rounded-[8px] text-[12px] font-[600] transition-colors",
                  p === page
                    ? "bg-[#0D7377] text-white"
                    : "text-[#0f1828] hover:bg-[#f5f6fa]"
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={cn(
                "w-8 h-8 rounded-[8px] text-[12px] font-[600] transition-colors flex items-center justify-center",
                page === totalPages
                  ? "text-[#aab4c8] cursor-not-allowed"
                  : "text-[#0f1828] hover:bg-[#f5f6fa]"
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── MODALS ────────────────────────────────────── */}
      {suspendUser && (
        <SuspendModal
          user={suspendUser}
          onConfirm={(reason) => handleSuspend(suspendUser.id, reason)}
          onCancel={() => setSuspendUserId(null)}
        />
      )}

      {deleteUser && (
        <DeleteModal
          user={deleteUser}
          onConfirm={() => handleDelete(deleteUser.id)}
          onCancel={() => setDeleteUserId(null)}
        />
      )}
    </div>
  );
}
