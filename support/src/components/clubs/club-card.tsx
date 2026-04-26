import Link from "next/link";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

export interface ClubCardProps {
  id: string;
  name: string;
  category: string;
  desc: string;
  members: number;
  accent: { bg: string; border: string; text: string; hex?: string };
}

export function ClubCard({ club, delay }: { club: ClubCardProps; delay: string }) {
  const initials = club.name
    .replace("NSU ", "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  // Generate category badge colors based on category string
  const getBadgeColors = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "tech": return "bg-[rgba(13,115,119,0.12)] text-[#0D7377]"; // Teal
      case "arts": return "bg-[#fdf2f8] text-[#ec4899]"; // Pink
      case "academic": return "bg-[#eff6ff] text-[#3b82f6]"; // Blue
      case "sports": return "bg-[#fffbeb] text-[#f59e0b]"; // Amber
      case "cultural": return "bg-[#f5f3ff] text-[#8b5cf6]"; // Purple
      default: return "bg-[#f5f6fa] text-[#8896b0]";
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-[12px] border-[1.5px] border-[#e8ecf2] overflow-hidden transition-all duration-200 ease-out hover:border-[#0D7377] hover:shadow-[0_8px_24px_rgba(13,115,119,0.12)] hover:-translate-y-[2px] animate-fade-up opacity-0"
      style={{ animationDelay: delay, animationFillMode: "forwards" }}
    >
      {/* 100px Banner Placeholder */}
      <div 
        className="h-[100px] w-full shrink-0 relative bg-gradient-to-br from-white to-transparent"
        style={{ backgroundColor: club.accent.hex || "#f5f6fa" }}
      >
        <div className="absolute inset-0 bg-white/40" />
        <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: "radial-gradient(circle at top right, rgba(0,0,0,0.05), transparent 60%)" }} />
      </div>

      <div className="px-4 pb-4 flex flex-col flex-1 relative bg-white">
        {/* Avatar overlapping banner */}
        <div 
          className="absolute -top-6 left-4 flex h-12 w-12 items-center justify-center rounded-[10px] border-[2px] border-white font-syne font-bold text-[15px] shadow-sm bg-white"
          style={{ color: club.accent.hex || "#0f1828" }}
        >
          {initials}
        </div>

        {/* Category Badge placed on right */}
        <div className="flex justify-end mt-2 mb-2">
           <span className={cn(
            "px-2.5 py-[3px] rounded-[20px] text-[10px] font-bold tracking-[0.5px]",
            getBadgeColors(club.category)
          )}>
            {club.category.toUpperCase()}
          </span>
        </div>

        <h3 className="font-syne font-bold text-[#0f1828] text-[14px] leading-tight mb-1">{club.name}</h3>
        <p className="text-[12px] text-[#8896b0] font-medium leading-[1.4] mb-4 line-clamp-1">{club.desc}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#f5f6fa] text-[#0f1828] text-[11px] font-bold">
            <Users className="w-3 h-3 text-[#8896b0]" />
            {club.members}
          </div>
          <Link 
            href={`/clubs/${club.id}`}
            className="flex items-center justify-center h-[30px] px-3.5 rounded-[8px] bg-white border-[1.5px] border-[#0D7377] text-[#0D7377] text-[12px] font-bold transition-all duration-200 group-hover:bg-[#0D7377] group-hover:text-white"
          >
            View Club
          </Link>
        </div>
      </div>
    </div>
  );
}
