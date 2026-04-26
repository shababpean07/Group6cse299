import { Users } from "lucide-react";
import Link from "next/link";

export function FollowedClubs() {
  return (
    <div className="flex flex-col h-full animate-fade-up flex-1" style={{ animationDelay: "0.28s" }}>
      <h2 className="font-syne font-[700] text-[18px] text-text-primary mb-4">Followed Clubs</h2>
      
      <div className="flex-1 bg-surface rounded-[14px] border-[1.5px] border-dashed border-[#d1d9e6] flex flex-col items-center justify-center p-10 min-h-[320px]">
        <div className="w-14 h-14 rounded-[12px] bg-canvas flex items-center justify-center mb-4">
          <Users className="w-7 h-7 text-text-muted" />
        </div>
        <h3 className="font-syne font-[700] text-[16px] text-text-primary mb-2">No clubs followed yet</h3>
        <p className="text-[13px] font-[500] text-text-secondary text-center max-w-[260px] mb-6">
          Follow clubs to see their updates, upcoming events, and recruitment notices right here.
        </p>
        <Link 
          href="/clubs" 
          className="flex items-center justify-center h-10 px-6 bg-surface border-[1.5px] border-teal text-teal font-[700] text-[13px] rounded-[8px] hover:bg-teal-light transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(13,115,119,0.12)]"
        >
          Browse Clubs
        </Link>
      </div>
    </div>
  );
}
