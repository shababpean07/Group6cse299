"use client";

import { useState, useEffect } from "react";
import { UserPlus, Clock, CheckCircle2, Inbox } from "lucide-react";
import { ApplyModal } from "@/components/recruitment/ApplyModal";
import { ApplicationTrackerModal } from "@/components/recruitment/ApplicationTrackerModal";

const MOCK_DATA = [
  {
    id: 1,
    name: "NSU Finance Club",
    desc: "Learn investment banking & corporate finance.",
    type: "Academic",
    status: "open",
    urgency: "high",
    deadlineText: "Closes Mar 15 ⚡",
    initials: "FC",
    barWidth: "85%"
  },
  {
    id: 2,
    name: "NSU ACM SC",
    desc: "Competitive programming and software engineering.",
    type: "Tech",
    status: "open",
    urgency: "low",
    deadlineText: "Closes Mar 22",
    initials: "AC",
    barWidth: "40%"
  },
  {
    id: 3,
    name: "NSU Robotics Club",
    desc: "Build autonomous machines and IoT systems.",
    type: "Tech",
    status: "open",
    urgency: "low",
    deadlineText: "Closes Mar 25",
    initials: "RC",
    barWidth: "25%"
  },
  {
    id: 4,
    name: "NSU Drama Club",
    desc: "Stage acting, direction, and script writing.",
    type: "Arts",
    status: "closed",
    urgency: "none",
    deadlineText: "Closed",
    initials: "DC",
    barWidth: "100%"
  },
  {
    id: 5,
    name: "NSU Photography Club",
    desc: "Master the art of visual storytelling.",
    type: "Arts",
    status: "member",
    urgency: "none",
    deadlineText: "✓ Member",
    initials: "PC",
    barWidth: "100%"
  }
];

export default function RecruitmentPortal() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'open' | 'urgent' | 'applied'>('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('All');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const filteredData = MOCK_DATA.filter((club) => {
    // Check status filter
    let statusMatch = true;
    if (activeStatusFilter === 'open') statusMatch = club.status === 'open';
    if (activeStatusFilter === 'urgent') statusMatch = club.status === 'open' && club.urgency === 'high';
    if (activeStatusFilter === 'applied') statusMatch = club.status === 'member'; 

    // Check type filter
    let typeMatch = true;
    if (activeTypeFilter !== 'All') typeMatch = club.type === activeTypeFilter;

    return statusMatch && typeMatch;
  });

  // Calculate stats based on type filter (so numbers update if you select a category)
  const typeFilteredData = MOCK_DATA.filter(club => activeTypeFilter === 'All' ? true : club.type === activeTypeFilter);

  const stats = [
    { 
      id: 'open',
      label: "Open Now", 
      val: typeFilteredData.filter(c => c.status === 'open').length.toString(), 
      icon: UserPlus, 
      color: "#0D7377", 
      bg: "#e6f4f5" 
    },
    { 
      id: 'urgent',
      label: "Closes Soon", 
      val: typeFilteredData.filter(c => c.status === 'open' && c.urgency === 'high').length.toString(), 
      icon: Clock, 
      color: "#F59E0B", 
      bg: "#FEF3C7" 
    },
    { 
      id: 'applied',
      label: "Applied", 
      val: typeFilteredData.filter(c => c.status === 'member').length.toString(), 
      icon: CheckCircle2, 
      color: "#22c55e", 
      bg: "#dcfce7" 
    }
  ];

  const clubTypes = ['All', 'Academic', 'Tech', 'Arts', 'Cultural', 'Sports'];

  return (
    <div className="flex flex-col w-full h-full pb-10">
      <ApplyModal 
        isOpen={!!selectedClub} 
        onClose={() => setSelectedClub(null)} 
        clubName={selectedClub || ""}
      />

      <ApplicationTrackerModal 
        isOpen={isTrackerOpen} 
        onClose={() => setIsTrackerOpen(false)} 
      />
      
      {/* Header */}
      <div className="flex flex-col gap-1 mb-8 opacity-0 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        <h1 className="font-syne text-[22px] font-[800] text-text-primary tracking-tight">Recruitment Portal</h1>
        <p className="text-[14px] font-[500] text-text-secondary">Find your community</p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-hide opacity-0 animate-fade-up" style={{ animationDelay: '0.10s' }}>
        {clubTypes.map((chip) => (
          <button 
            key={chip} 
            onClick={() => setActiveTypeFilter(chip)}
            className={`px-4 py-1.5 rounded-[99px] text-[13px] font-[700] transition-colors shrink-0 ${
              activeTypeFilter === chip 
                ? 'bg-teal text-white shadow-[0_4px_12px_rgba(13,115,119,0.2)]' 
                : 'bg-white border border-border text-text-secondary hover:border-teal hover:text-text-primary'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 opacity-0 animate-fade-up" style={{ animationDelay: '0.16s' }}>
        {stats.map((s) => (
          <button 
            key={s.label} 
            onClick={() => setActiveStatusFilter(activeStatusFilter === s.id ? 'all' : s.id as 'all' | 'open' | 'urgent' | 'applied')}
            className={`bg-white border text-left rounded-[16px] p-[20px] flex items-center gap-4 hover:-translate-y-[2px] transition-all ${
              activeStatusFilter === s.id 
                ? 'border-teal shadow-[0_8px_24px_rgba(13,115,119,0.15)] scale-[1.02]' 
                : 'border-border hover:shadow-[0_8px_24px_rgba(13,115,119,0.10)]'
            }`}
          >
            <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
              <s.icon className="w-[18px] h-[18px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-syne text-[30px] font-[800] text-text-primary leading-none tracking-[-1px]">{s.val}</span>
              <span className="text-[13px] text-text-secondary font-[600] mt-1.5">{s.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Grid + Sidebar */}
      <div className="flex flex-col xl:flex-row gap-[24px] opacity-0 animate-fade-up" style={{ animationDelay: '0.22s' }}>
        
        {/* Cards Grid */}
        <div className="flex-1 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[14px] content-start">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-border rounded-[16px] h-[190px] animate-shimmer" />
            ))
          ) : filteredData.length === 0 ? (
            <div className="col-span-full border-[1.5px] border-dashed border-border rounded-[14px] bg-white flex flex-col items-center justify-center p-12 text-center">
              <div className="w-[42px] h-[42px] rounded-[12px] bg-canvas flex items-center justify-center mb-4">
                 <Inbox className="w-[24px] h-[24px] text-text-muted" />
              </div>
              <h3 className="font-syne text-[16px] font-[800] text-text-primary mb-1">No recruitments match your criteria</h3>
              <p className="text-[13px] font-[500] text-text-secondary mb-5">Try changing your filters to see more clubs.</p>
              <button 
                onClick={() => {
                  setActiveStatusFilter('all');
                  setActiveTypeFilter('All');
                }}
                className="h-9 px-5 bg-white border border-teal text-teal rounded-[10px] text-[13px] font-[700] hover:bg-teal hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredData.map((card, i) => {
              
              let badgeStyles = "";
              if (card.status === "open" && card.urgency === "high") badgeStyles = "bg-[#FEF3C7] text-[#F59E0B]";
              else if (card.status === "open") badgeStyles = "bg-teal-light text-teal";
              else if (card.status === "closed") badgeStyles = "bg-canvas text-text-secondary";
              else if (card.status === "member") badgeStyles = "bg-[#dcfce7] text-[#22c55e]";

              let barColor = "";
              if (card.status === "open" && card.urgency === "high") barColor = "bg-[#F59E0B]";
              else if (card.status === "open") barColor = "bg-teal";
              else if (card.status === "closed") barColor = "bg-border";
              else if (card.status === "member") barColor = "bg-[#22c55e]";

              let btnStyles = "";
              let btnText = "Apply Now";
              if (card.status === "open") {
                btnStyles = "bg-teal text-white hover:bg-teal-dark";
              } else {
                btnStyles = "bg-canvas text-text-muted cursor-not-allowed";
                btnText = card.status === "closed" ? "Recruitment Closed" : "Already a Member";
              }

              return (
                <div 
                  key={card.id} 
                  className="bg-white rounded-[16px] border border-border p-[20px] flex flex-col hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(13,115,119,0.10)] transition-all group opacity-0 animate-fade-up"
                  style={{ animationDelay: `${0.22 + (i * 0.05)}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="font-syne w-[38px] h-[38px] rounded-[10px] bg-teal-light text-teal flex items-center justify-center text-[15px] font-[800]">
                      {card.initials}
                    </div>
                    <div className={`px-[8px] py-[3px] rounded-[6px] text-[11px] font-[700] ${badgeStyles}`}>
                      {card.deadlineText}
                    </div>
                  </div>
                  
                  <h4 className="text-[14px] font-[700] text-text-primary mb-1">{card.name}</h4>
                  <p className="text-[12px] text-text-secondary font-[500] line-clamp-1 mb-6">{card.desc}</p>
                  
                  <div className="mt-auto">
                    <div className="w-full h-[6px] bg-canvas rounded-full overflow-hidden mb-4 relative">
                       <div 
                         className={`absolute top-0 left-0 h-full rounded-full ${barColor} animate-bar-grow-x`} 
                         style={{ width: card.barWidth }} 
                       />
                    </div>
                    
                    <button 
                      className={`w-full h-9 rounded-[10px] text-[13px] font-[700] transition-colors ${btnStyles}`} 
                      disabled={card.status !== "open"}
                      onClick={() => setSelectedClub(card.name)}
                    >
                       {btnText}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Activity Card */}
        <div className="w-full xl:w-[260px] shrink-0 opacity-0 animate-fade-up" style={{ animationDelay: '0.28s' }}>
          <div className="bg-sidebar-bg rounded-[16px] p-[18px_20px] flex flex-col h-[180px] sticky top-[26px]">
            <h3 className="font-syne text-[11px] font-[800] text-white/50 uppercase tracking-[2px] mb-4">Your Activity</h3>
            <div className="flex-1 flex flex-col justify-center">
              <span className="font-syne text-[34px] font-[800] text-white tracking-[-1px] leading-none">4</span>
              <span className="text-[13px] text-white/85 font-[500] mt-1.5">Applications submitted</span>
            </div>
            <button 
              onClick={() => setIsTrackerOpen(true)}
              className="w-full mt-4 bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.12)] text-white text-[13px] font-[700] h-9 rounded-[10px] transition-colors"
            >
              View Status
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
