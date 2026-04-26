"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  ChevronDown,
  MoreHorizontal,
  Eye,
  ShieldOff,
  UserCog,
  Building2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

type ClubStatus = "Active" | "Inactive";
type Category = "All" | "Tech" | "Arts" | "Academic" | "Cultural" | "Sports";

interface Club {
  id: string;
  name: string;
  category: string;
  members: number;
  admin: string;
  status: ClubStatus;
  accent: string;
  initials: string;
}

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const allClubs: Club[] = [
  { id: "1", name: "NSU ACM SC", category: "Tech", members: 1250, admin: "Arif Rahman", status: "Active", accent: "#0D7377", initials: "ACM" },
  { id: "2", name: "NSU Drama Club", category: "Arts", members: 420, admin: "Shakib Al Hasan", status: "Active", accent: "#E84393", initials: "NDC" },
  { id: "3", name: "NSU Finance Club", category: "Academic", members: 680, admin: "Irfan Mahmud", status: "Active", accent: "#0984E3", initials: "NFC" },
  { id: "4", name: "NSU Robotics Club", category: "Tech", members: 850, admin: "Fahim Hasan", status: "Active", accent: "#0D7377", initials: "NRC" },
  { id: "5", name: "NSU Photography", category: "Arts", members: 630, admin: "Ayman Sadiq", status: "Active", accent: "#FDCB6E", initials: "NPP" },
  { id: "6", name: "NSU Debate Club", category: "Cultural", members: 510, admin: "Zayed Bin Sayed", status: "Active", accent: "#6C5CE7", initials: "NDC" },
  { id: "7", name: "NSU Marketing", category: "Academic", members: 720, admin: "Shabab Rahman", status: "Active", accent: "#0984E3", initials: "NMC" },
  { id: "8", name: "NSU Athletics", category: "Sports", members: 950, admin: "Tawhid Hridoy", status: "Active", accent: "#00B894", initials: "NAT" },
  { id: "9", name: "NSU Shangskritik Shongothon", category: "Cultural", members: 890, admin: "Riaz Uddin", status: "Inactive", accent: "#E17055", initials: "NSS" },
  { id: "10", name: "NSU Programming Club", category: "Tech", members: 1100, admin: "Rafiq Islam", status: "Active", accent: "#0D7377", initials: "NPC" },
  { id: "11", name: "NSU Music Society", category: "Arts", members: 380, admin: "Tahsin Ahmed", status: "Active", accent: "#E84393", initials: "NMS" },
  { id: "12", name: "NSU Economics Club", category: "Academic", members: 540, admin: "Nadia Karim", status: "Active", accent: "#0984E3", initials: "NEC" },
  { id: "13", name: "NSU Dance Troupe", category: "Cultural", members: 290, admin: "Sara Hossain", status: "Active", accent: "#6C5CE7", initials: "NDT" },
  { id: "14", name: "NSU Cricket Club", category: "Sports", members: 870, admin: "Mehedi Hasan", status: "Active", accent: "#00B894", initials: "NCC" },
  { id: "15", name: "NSU AI Research Lab", category: "Tech", members: 460, admin: "Kamal Uddin", status: "Active", accent: "#0D7377", initials: "AIR" },
  { id: "16", name: "NSU Film Society", category: "Arts", members: 350, admin: "Roni Das", status: "Active", accent: "#E84393", initials: "NFS" },
  { id: "17", name: "NSU Accounting Club", category: "Academic", members: 610, admin: "Farhana Akter", status: "Active", accent: "#0984E3", initials: "NAC" },
  { id: "18", name: "NSU Football Club", category: "Sports", members: 1050, admin: "Imran Khan", status: "Active", accent: "#00B894", initials: "NFC" },
  { id: "19", name: "NSU Literary Circle", category: "Cultural", members: 440, admin: "Lubna Mariam", status: "Active", accent: "#6C5CE7", initials: "NLC" },
  { id: "20", name: "NSU Cyber Security Club", category: "Tech", members: 530, admin: "Sakib Ahmed", status: "Active", accent: "#0D7377", initials: "CSC" },
  { id: "21", name: "NSU Art Studio", category: "Arts", members: 310, admin: "Pooja Rani", status: "Active", accent: "#E84393", initials: "NAS" },
  { id: "22", name: "NSU Business Club", category: "Academic", members: 780, admin: "Hasan Mahmud", status: "Active", accent: "#0984E3", initials: "NBC" },
  { id: "23", name: "NSU Badminton Club", category: "Sports", members: 620, admin: "Jamil Ahsan", status: "Active", accent: "#00B894", initials: "NBd" },
  { id: "24", name: "NSU Theater Guild", category: "Cultural", members: 370, admin: "Nusrat Faria", status: "Inactive", accent: "#6C5CE7", initials: "NTG" },
  { id: "25", name: "NSU Data Science Club", category: "Tech", members: 690, admin: "Arif Hossain", status: "Active", accent: "#0D7377", initials: "DSC" },
  { id: "26", name: "NSU Calligraphy Club", category: "Arts", members: 220, admin: "Rahim Uddin", status: "Active", accent: "#E84393", initials: "NCC" },
  { id: "27", name: "NSU Management Club", category: "Academic", members: 560, admin: "Salma Begum", status: "Active", accent: "#0984E3", initials: "NMC" },
  { id: "28", name: "NSU Swimming Club", category: "Sports", members: 410, admin: "Karim Rahman", status: "Active", accent: "#00B894", initials: "NSC" },
  { id: "29", name: "NSU Cultural Forum", category: "Cultural", members: 730, admin: "Bithi Akter", status: "Active", accent: "#6C5CE7", initials: "NCF" },
  { id: "30", name: "NSU Web Dev Club", category: "Tech", members: 880, admin: "Tanvir Islam", status: "Active", accent: "#0D7377", initials: "WDC" },
  { id: "31", name: "NSU Poetry Circle", category: "Arts", members: 260, admin: "Anika Tabassum", status: "Active", accent: "#E84393", initials: "NPC" },
  { id: "32", name: "NSU Entrepreneurship", category: "Academic", members: 640, admin: "Rashid Chowdhury", status: "Active", accent: "#0984E3", initials: "NEC" },
  { id: "33", name: "NSU Basketball Club", category: "Sports", members: 530, admin: "Sohel Rana", status: "Active", accent: "#00B894", initials: "NBC" },
  { id: "34", name: "NSU Language Club", category: "Cultural", members: 480, admin: "Farida Yasmin", status: "Active", accent: "#6C5CE7", initials: "NLC" },
  { id: "35", name: "NSU Gaming Club", category: "Tech", members: 920, admin: "Saimon Hasan", status: "Active", accent: "#0D7377", initials: "NGC" },
  { id: "36", name: "NSU Fashion Club", category: "Arts", members: 340, admin: "Tasnim Jahan", status: "Active", accent: "#E84393", initials: "NFC" },
  { id: "37", name: "NSU Investment Club", category: "Academic", members: 470, admin: "Nabil Ahmed", status: "Active", accent: "#0984E3", initials: "NIC" },
  { id: "38", name: "NSU Table Tennis Club", category: "Sports", members: 360, admin: "Rafiqul Islam", status: "Active", accent: "#00B894", initials: "NTT" },
  { id: "39", name: "NSU Heritage Club", category: "Cultural", members: 390, admin: "Mousumi Das", status: "Active", accent: "#6C5CE7", initials: "NHC" },
  { id: "40", name: "NSU IoT Club", category: "Tech", members: 410, admin: "Shahidul Islam", status: "Active", accent: "#0D7377", initials: "IoT" },
];

const categories: Category[] = ["All", "Tech", "Arts", "Academic", "Cultural", "Sports"];

const ITEMS_PER_PAGE = 9;

const categoryColors: Record<string, string> = {
  Tech: "bg-[#e6f4f5] text-[#0D7377]",
  Arts: "bg-[#fce4ec] text-[#E84393]",
  Academic: "bg-[#e3f2fd] text-[#0984E3]",
  Cultural: "bg-[#ede7f6] text-[#6C5CE7]",
  Sports: "bg-[#e0f7ef] text-[#00B894]",
};

/* ═══════════════════════════════════════════════════════════
   DEACTIVATE MODAL
   ═══════════════════════════════════════════════════════════ */

function DeactivateModal({
  club,
  onConfirm,
  onCancel,
}: {
  club: Club;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [input, setInput] = useState("");
  const matches = input.trim().toLowerCase() === club.name.toLowerCase();

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
          <ShieldOff className="w-6 h-6 text-[#EF4444]" />
        </div>

        <h2 className="font-syne font-[700] text-[18px] text-[#0f1828] mb-2">
          Deactivate Club?
        </h2>

        <div className="text-[13px] text-[#8896b0] leading-relaxed mb-4 space-y-1">
          <p>Deactivating <span className="font-[600] text-[#0f1828]">{club.name}</span> will:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[12px]">
            <li>Hide the club from the student directory</li>
            <li>Suspend all active recruitment cycles</li>
            <li>Prevent club admin from posting events</li>
          </ul>
          <p className="text-[11px] text-[#aab4c8] mt-1">This can be reversed at any time.</p>
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type club name to confirm"
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
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MORE OPTIONS POPOVER
   ═══════════════════════════════════════════════════════════ */

function MorePopover({
  club,
  onClose,
  onDeactivate,
}: {
  club: Club;
  onClose: () => void;
  onDeactivate: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 bottom-full mb-2 z-40 w-52 bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] shadow-[0_8px_24px_rgba(13,115,119,0.12)] overflow-hidden animate-fade-up opacity-0" style={{ animationFillMode: "both" }}>
        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-[600] text-[#0f1828] hover:bg-[#f5f6fa] transition-colors"
        >
          <Eye className="w-4 h-4 text-[#8896b0]" />
          View Club Profile
        </button>
        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-[600] text-[#0f1828] hover:bg-[#f5f6fa] border-t border-[#e8ecf2] transition-colors"
        >
          <UserCog className="w-4 h-4 text-[#8896b0]" />
          Change Admin
        </button>
        <button
          onClick={() => {
            onDeactivate();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-[600] text-[#EF4444] hover:bg-[#fee2e2] border-t border-[#e8ecf2] transition-colors"
        >
          <ShieldOff className="w-4 h-4" />
          Deactivate Club
        </button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   CLUB CARD
   ═══════════════════════════════════════════════════════════ */

function ClubCard({ club }: { club: Club }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "bg-white border-[1.5px] border-[#e8ecf2] rounded-[12px] overflow-hidden hover:border-[#0D7377] hover:shadow-[0_8px_24px_rgba(13,115,119,0.12)] hover:-translate-y-[2px] transition-all duration-200 relative",
          club.status === "Inactive" && "opacity-75"
        )}
      >
        {/* Banner strip */}
        <div className="h-[60px] relative" style={{ backgroundColor: club.accent }}>
          {club.status === "Inactive" && (
            <div className="absolute inset-0 bg-black/40" />
          )}
          {/* Avatar overlapping banner bottom */}
          <div
            className="absolute -bottom-5 left-4 w-11 h-11 rounded-[10px] border-2 border-white flex items-center justify-center text-white font-syne font-[800] text-[13px] shadow-sm"
            style={{ backgroundColor: club.accent }}
          >
            {club.initials}
          </div>
        </div>

        {/* Card body */}
        <div className="px-4 pb-4 pt-8">
          <h3 className="font-syne font-[700] text-[14px] text-[#0f1828] truncate">
            {club.name}
          </h3>

          {/* Category chip */}
          <span className={cn("inline-block text-[10px] font-[700] px-2 py-0.5 rounded-full mt-1.5", categoryColors[club.category] || "bg-[#f5f6fa] text-[#8896b0]")}>
            {club.category}
          </span>

          {/* Member count */}
          <div className="flex items-center gap-1.5 mt-2 text-[12px] text-[#8896b0]">
            <Users className="w-3.5 h-3.5" />
            {club.members.toLocaleString()} members
          </div>

          {/* Admin */}
          <p className="text-[11px] text-[#aab4c8] mt-1">
            Admin: {club.admin}
          </p>

          {/* Status row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e8ecf2]">
            <span
              className={cn(
                "text-[10px] font-[700] px-2.5 py-0.5 rounded-full",
                club.status === "Active"
                  ? "bg-[#dcfce7] text-[#22c55e]"
                  : "bg-[#f5f6fa] text-[#8896b0]"
              )}
            >
              {club.status}
            </span>
            <div className="flex items-center gap-1">
              <Link
                href={`/clubs/${club.id}`}
                className="text-[12px] font-[600] text-[#0D7377] hover:underline px-2 py-1"
              >
                View
              </Link>
              <div className="relative">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className="w-7 h-7 flex items-center justify-center rounded-[6px] hover:bg-[#f5f6fa] transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4 text-[#8896b0]" />
                </button>
                {moreOpen && (
                  <MorePopover
                    club={club}
                    onClose={() => setMoreOpen(false)}
                    onDeactivate={() => setDeactivateOpen(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {deactivateOpen && (
        <DeactivateModal
          club={club}
          onConfirm={() => setDeactivateOpen(false)}
          onCancel={() => setDeactivateOpen(false)}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function SuperClubsPage() {
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = allClubs
    .filter((c) => category === "All" || c.category === category)
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortAsc ? a.members - b.members : b.members - a.members);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paged = filtered.slice(start, start + ITEMS_PER_PAGE);
  const end = Math.min(start + ITEMS_PER_PAGE, filtered.length);

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* ── PAGE HEADER ───────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up opacity-0"
        style={{ animationDelay: "0s", animationFillMode: "both" }}
      >
        <div>
          <h1 className="font-syne font-[800] text-[22px] text-[#0f1828] mb-1">
            Club Management
          </h1>
          <p className="text-[14px] text-[#8896b0]">
            {allClubs.length} registered clubs across all categories
          </p>
        </div>
        <button className="flex items-center gap-2 h-10 px-5 bg-[#0D7377] text-white rounded-[8px] font-syne font-[700] text-[13px] hover:bg-[#0a5c60] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm shrink-0">
          ＋ Register New Club
        </button>
      </div>

      {/* ── FILTER BAR ────────────────────────────────── */}
      <div
        className="flex flex-col gap-3 animate-fade-up opacity-0"
        style={{ animationDelay: "0.07s", animationFillMode: "both" }}
      >
        {/* Category chips + search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={cn(
                  "h-8 px-3.5 rounded-full text-[12px] font-[600] transition-all",
                  category === cat
                    ? "bg-[#0D7377] text-white"
                    : "bg-white border-[1.5px] border-[#e8ecf2] text-[#8896b0] hover:text-[#0f1828] hover:border-[#0D7377]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 min-w-[200px] max-w-[320px] ml-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aab4c8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search clubs by name..."
              className="w-full h-9 pl-9 pr-3 rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] focus:outline-none focus:border-[#0D7377] focus:ring-1 focus:ring-[#0D7377] transition-colors bg-white"
            />
          </div>
        </div>

        {/* Sort dropdown */}
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="flex items-center gap-1.5 text-[12px] font-[600] text-[#8896b0] hover:text-[#0f1828] transition-colors w-fit"
        >
          Sort by: Members {sortAsc ? "↑" : "↓"}
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", sortAsc && "rotate-180")} />
        </button>
      </div>

      {/* ── CLUB GRID ─────────────────────────────────── */}
      {paged.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-up opacity-0"
          style={{ animationDelay: "0.14s", animationFillMode: "both" }}
        >
          {paged.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-up opacity-0" style={{ animationFillMode: "both" }}>
          <Building2 className="w-10 h-10 text-[#aab4c8] mb-3" />
          <h2 className="font-syne font-[700] text-[16px] text-[#0f1828] mb-1">
            No clubs found
          </h2>
          <p className="text-[13px] text-[#8896b0]">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* ── PAGINATION ────────────────────────────────── */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between animate-fade-up opacity-0"
          style={{ animationDelay: "0.21s", animationFillMode: "both" }}
        >
          <p className="text-[12px] text-[#aab4c8]">
            Showing {start + 1}–{end} of {filtered.length} clubs
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={cn(
                "w-8 h-8 rounded-[8px] text-[12px] font-[600] transition-colors",
                page === 1
                  ? "text-[#aab4c8] cursor-not-allowed"
                  : "text-[#0f1828] hover:bg-[#f5f6fa]"
              )}
            >
              Prev
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
                "w-8 h-8 rounded-[8px] text-[12px] font-[600] transition-colors",
                page === totalPages
                  ? "text-[#aab4c8] cursor-not-allowed"
                  : "text-[#0f1828] hover:bg-[#f5f6fa]"
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
