import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, Calendar, Clock, ChevronRight, Star, ExternalLink, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { CLUBS_DATA } from "@/lib/data/clubs";

export default async function ClubProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Await params since Next.js 15 requires it when dealing with dynamic route segments
  const resolvedParams = await params;
  const club = CLUBS_DATA.find((c) => c.id === resolvedParams.id);

  if (!club) {
    notFound();
  }

  const initials = club.name
    .replace("NSU ", "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  const getBadgeColors = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "tech": return "bg-[rgba(13,115,119,0.12)] text-[#0D7377]";
      case "arts": return "bg-[#fdf2f8] text-[#ec4899]";
      case "academic": return "bg-[#eff6ff] text-[#3b82f6]";
      case "sports": return "bg-[#fffbeb] text-[#f59e0b]";
      case "cultural": return "bg-[#f5f3ff] text-[#8b5cf6]";
      default: return "bg-[#f5f6fa] text-[#8896b0]";
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[900px] mx-auto pb-12">
      
      {/* 1. HERO SECTION */}
      <div className="flex flex-col bg-white rounded-[14px] border-[1.5px] border-[#e8ecf2] overflow-hidden shadow-sm animate-fade-up opacity-0" style={{ animationDelay: "0s", animationFillMode: "forwards" }}>
        
        {/* Banner with Gradient Mesh */}
        <div 
          className="h-[180px] w-full relative"
          style={{ 
            backgroundColor: club.accent.hex,
            backgroundImage: `radial-gradient(circle at 0% 0%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(0,0,0,0.2) 0%, transparent 50%)`
          }}
        >
          {/* Breadcrumb over banner (top left) */}
          <div className="absolute top-5 left-6 flex items-center gap-2 text-white/80 text-[12px] font-bold tracking-wide z-10">
            <Link href="/clubs" className="hover:text-white transition-colors">CLUBS</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{club.name.toUpperCase()}</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="px-6 pb-6 md:px-8 md:pb-8 relative flex flex-col">
          {/* Overlapping Avatar */}
          <div 
            className="absolute -top-[28px] left-6 md:left-8 flex h-[56px] w-[56px] items-center justify-center rounded-[14px] border-[3px] border-white font-syne font-bold text-[20px] shadow-sm bg-white"
            style={{ color: club.accent.hex }}
          >
            {initials}
          </div>

          {/* Action Row & Info Container */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-10">
            <div>
              <h1 className="font-syne text-[26px] font-bold text-[#0f1828] mb-3">{club.name}</h1>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className={cn("px-2.5 py-[3px] rounded-[20px] text-[11px] font-bold tracking-[0.5px]", getBadgeColors(club.category))}>
                  {club.category.toUpperCase()}
                </span>
                
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#f5f6fa] text-[#0f1828] text-[12px] font-bold">
                  <Users className="w-3.5 h-3.5 text-[#8896b0]" />
                  {club.members} Members
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#f5f6fa] text-[#0f1828] text-[12px] font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#8896b0]" />
                  Est. {club.est}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button className="flex items-center justify-center gap-2 h-10 px-5 rounded-[8px] bg-white border-[1.5px] border-[#0D7377] text-[#0D7377] text-sm font-bold transition-all hover:bg-[#e6f4f5]">
                <Star className="w-4 h-4 fill-current" />
                Follow
              </button>
              
              {club.recruitment.isOpen ? (
                <button className="flex items-center justify-center gap-2 h-10 px-6 rounded-[8px] bg-[#0D7377] text-white text-sm font-bold transition-all hover:bg-[#0a5c60] hover:-translate-y-[1px] shadow-sm hover:shadow-[0_4px_12px_rgba(13,115,119,0.2)]">
                  Apply Now
                </button>
              ) : (
                <div className="flex items-center justify-center h-10 px-5 rounded-[8px] bg-[#f5f6fa] text-[#8896b0] text-sm font-bold cursor-not-allowed border-[1.5px] border-[#e8ecf2]">
                  Applications Closed
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. ABOUT & EXEC BOARD ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* About Section */}
        <section className="flex flex-col animate-fade-up opacity-0" style={{ animationDelay: "0.07s", animationFillMode: "forwards" }}>
          <h2 className="font-syne text-[18px] font-bold text-[#0f1828] mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#8896b0]" />
            About the Club
          </h2>
          <div className="bg-white rounded-[12px] border-[1.5px] border-[#e8ecf2] p-5 md:p-6 shadow-sm h-full">
            <p className="text-[#0f1828] font-medium leading-[1.7] text-[15px]">
              {club.about}
            </p>
          </div>
        </section>

        {/* Exec Board Section */}
        <section className="flex flex-col animate-fade-up opacity-0" style={{ animationDelay: "0.14s", animationFillMode: "forwards" }}>
          <h2 className="font-syne text-[18px] font-bold text-[#0f1828] mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#8896b0]" />
            Executive Board
          </h2>
          <div className="bg-white rounded-[12px] border-[1.5px] border-[#e8ecf2] p-4 shadow-sm h-full overflow-hidden">
            <div className="flex flex-nowrap overflow-x-auto gap-4 pb-2 md:pb-0 scrollbar-hide">
              {club.execBoard.map((member) => (
                <div key={member.id} className="flex flex-col items-center justify-center text-center gap-2 shrink-0 w-[100px] p-3 rounded-[8px] hover:bg-[#f5f6fa] transition-colors cursor-default border border-transparent hover:border-[#e8ecf2]">
                  <div className="w-[42px] h-[42px] rounded-full bg-[#f5f6fa] border-[1.5px] border-white shadow-sm text-[#0D7377] flex items-center justify-center font-syne font-bold text-sm shrink-0">
                    {member.initials}
                  </div>
                  <div>
                    <h4 className="font-syne text-[13px] font-bold text-[#0f1828] leading-tight mb-1">{member.name}</h4>
                    <p className="text-[10px] text-[#8896b0] font-medium leading-[1.2]">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 3. UPCOMING EVENTS */}
      {club.events && club.events.length > 0 && (
        <section className="flex flex-col animate-fade-up opacity-0" style={{ animationDelay: "0.21s", animationFillMode: "forwards" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne text-[18px] font-bold text-[#0f1828] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#8896b0]" />
              Upcoming Events
            </h2>
            <Link href="/events" className="text-sm font-semibold text-[#0D7377] hover:underline flex items-center gap-1">
              View All <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="bg-white rounded-[12px] border-[1.5px] border-[#e8ecf2] p-5 shadow-sm space-y-4">
            {club.events.map((event, idx) => (
              <div key={event.id} className={cn("flex flex-col sm:flex-row sm:items-center gap-4 group", idx !== club.events.length - 1 && "pb-4 border-b border-[#e8ecf2]")}>
                <div className={cn("flex flex-row sm:flex-col items-center justify-center sm:w-14 sm:h-16 rounded-xl shrink-0 transition-colors px-4 py-2 sm:px-0 sm:py-0", event.bg, event.color)}>
                  <span className="font-syne font-bold text-[18px] sm:text-[22px] leading-none sm:mb-1">{event.day}</span>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-wider ml-2 sm:ml-0">{event.month}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#0f1828] text-[16px] truncate group-hover:text-[#0D7377] transition-colors">{event.name}</h3>
                  <p className="text-[13px] font-medium text-[#8896b0] mt-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> 10:00 AM - 5:00 PM
                  </p>
                </div>
                <button className="h-9 px-5 w-full sm:w-auto text-sm font-bold text-[#0D7377] border-[1.5px] border-[#0D7377] rounded-[8px] hover:bg-[#e6f4f5] transition-all shrink-0">
                  RSVP
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. RECRUITMENT BANNER */}
      <section className="animate-fade-up opacity-0" style={{ animationDelay: "0.28s", animationFillMode: "forwards" }}>
        {club.recruitment.isOpen ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-[12px] bg-[#0D7377] shadow-[0_8px_24px_rgba(13,115,119,0.15)] relative overflow-hidden">
             {/* Decorative Background Element */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            
            <div className="relative z-10">
              <h3 className="font-syne text-[18px] font-bold text-white mb-1">Join the Team</h3>
              <p className="text-white/80 text-[14px] font-medium">Recruitment is open until <span className="text-white font-bold">{club.recruitment.deadline}</span></p>
            </div>
            <button className="relative z-10 w-full sm:w-auto h-11 px-8 rounded-[8px] bg-white text-[#0D7377] text-[15px] font-bold transition-all hover:bg-[#e6f4f5] hover:scale-[1.02] shadow-sm">
              Apply to {initials}
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center p-6 rounded-[12px] bg-[#f5f6fa] border-[1.5px] border-dashed border-[#d1d9e6]">
            <p className="text-[#8896b0] text-[15px] font-medium text-center">
              Recruitment is currently closed. Follow the club to get notified when applications open.
            </p>
          </div>
        )}
      </section>

    </div>
  );
}
