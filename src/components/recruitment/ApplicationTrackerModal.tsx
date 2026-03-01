"use client";

import { useState } from "react";
import { ChevronDown, FileText, Clock, AlertCircle, CheckCircle2, XCircle, Inbox, X } from "lucide-react";

// Mock Data
const MOCK_APPS = [
  {
    id: 1,
    club: "NSU ACM SC",
    initials: "AC",
    avatarBg: "#f0eeff",
    avatarColor: "#7C5CFC",
    appliedDate: "Applied Mar 1",
    status: "Accepted",
    steps: [
      { title: "Application Submitted", date: "Mar 1, 2026", status: "completed" },
      { title: "Under Review", date: "Mar 3, 2026", status: "completed" },
      { title: "Technical Interview", date: "Mar 6, 2026", status: "completed" },
      { title: "Final Decision", date: "Mar 10, 2026", status: "completed-green" }
    ]
  },
  {
    id: 2,
    club: "NSU Finance Club",
    initials: "FC",
    avatarBg: "#FEF3C7",
    avatarColor: "#F59E0B",
    appliedDate: "Applied Mar 1",
    status: "Interview",
    steps: [
      { title: "Application Submitted", date: "Mar 1, 2026", status: "completed" },
      { title: "Under Review", date: "Mar 3, 2026", status: "completed" },
      { title: "Interview Scheduled", date: "Mar 5, 2026", status: "active-amber" },
      { title: "Final Decision", date: "TBD", status: "pending" }
    ]
  },
  {
    id: 3,
    club: "NSU Photography Club",
    initials: "PC",
    avatarBg: "#e0f2fe",
    avatarColor: "#3b82f6",
    appliedDate: "Applied Mar 4",
    status: "Pending",
    steps: [
      { title: "Application Submitted", date: "Mar 4, 2026", status: "completed" },
      { title: "Under Review", date: "Mar 5, 2026", status: "active-purple" },
      { title: "Interview Phase", date: "TBD", status: "pending" },
      { title: "Final Decision", date: "TBD", status: "pending" }
    ]
  },
  {
    id: 4,
    club: "NSU Drama Club",
    initials: "DC",
    avatarBg: "#fce7f3",
    avatarColor: "#ec4899",
    appliedDate: "Applied Feb 25",
    status: "Rejected",
    steps: [
      { title: "Application Submitted", date: "Feb 25, 2026", status: "completed" },
      { title: "Under Review", date: "Feb 28, 2026", status: "completed" },
      { title: "Audition Phase", date: "Mar 2, 2026", status: "completed" },
      { title: "Final Decision", date: "Mar 5, 2026", status: "rejected" }
    ]
  }
];

const TABS = ["All", "Pending", "Interview", "Accepted", "Rejected"];

interface ApplicationTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationTrackerModal({ isOpen, onClose }: ApplicationTrackerModalProps) {
  const [activeTab, setActiveTab] = useState("All");
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({
    2: true // Pre-expand "Interview Scheduled" card (id: 2)
  });

  if (!isOpen) return null;

  const toggleCard = (id: number) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredApps = MOCK_APPS.filter(app => activeTab === "All" || app.status === activeTab);
  const showEmptyState = filteredApps.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
      <div className="absolute inset-0 bg-[#0f1828]/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-[800px] max-h-[90vh] bg-[#f7f7fc] rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col animate-scale-in border border-[#efeff5]">
        
        {/* MODAL HEADER */}
        <div className="h-[58px] flex items-center justify-between px-6 border-b border-[#efeff5] shrink-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <h2 className="font-[800] text-[18px] text-[#0f1828]">My Applications</h2>
            <div className="bg-[#f0eeff] text-[#7C5CFC] px-[8px] py-[3px] rounded-[6px] text-[11px] font-[700] flex items-center justify-center">
              {MOCK_APPS.length} total
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] text-[#8896b0] hover:bg-[#f4f4f8] hover:text-[#0f1828] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          
          {/* FILTER TABS */}
          <div className="flex items-center gap-6 border-b border-[#efeff5] mb-6">
            {TABS.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[13px] font-[600] relative transition-colors ${
                  activeTab === tab 
                    ? 'text-[#7C5CFC]' 
                    : 'text-[#8896b0] hover:text-[#0f1828]'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#7C5CFC] rounded-t-[2px]" />
                )}
              </button>
            ))}
          </div>

          {/* STAT STRIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Pending", val: "1", icon: Clock, color: "#8896b0", bg: "#white", border: "border-[#efeff5]" },
              { label: "Interview", val: "1", icon: AlertCircle, color: "#F59E0B", bg: "#FEF3C7", border: "border-[#efeff5]" },
              { label: "Accepted", val: "1", icon: CheckCircle2, color: "#22c55e", bg: "#dcfce7", border: "border-[#efeff5]" }
            ].map((s) => (
              <div key={s.label} className={`bg-white border ${s.border} rounded-[14px] p-[16px] flex items-center gap-3`}>
                <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
                  <s.icon className="w-[16px] h-[16px]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[20px] font-[800] text-[#0f1828] leading-none tracking-tight">{s.val}</span>
                  <span className="text-[12px] text-[#8896b0] font-[600] mt-1">{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* APPLICATION LIST */}
          <div className="flex flex-col gap-[10px] mb-6">
            {showEmptyState ? (
              <div className="border-[1.5px] border-dashed border-[#e0e0ec] rounded-[14px] bg-white flex flex-col items-center justify-center p-10 text-center my-2">
                <div className="w-[42px] h-[42px] rounded-[12px] bg-[#f7f7fc] flex items-center justify-center mb-4">
                  <Inbox className="w-[24px] h-[24px] text-[#c4c7cf]" />
                </div>
                <h3 className="text-[15px] font-[800] text-[#0f1828] mb-1">No applications found</h3>
                <p className="text-[12px] font-[500] text-[#8896b0]">You haven't submitted any applications for this status.</p>
              </div>
            ) : (
              filteredApps.map((app) => {
                const isExpanded = expandedCards[app.id];

                let badgeStyles = "";
                let badgeText = app.status;
                
                if (app.status === "Pending") badgeStyles = "border border-[#c4c7cf] text-[#8896b0] bg-white";
                else if (app.status === "Interview") badgeStyles = "bg-[#F59E0B] text-white border border-transparent";
                else if (app.status === "Accepted") badgeStyles = "bg-[#22c55e] text-white border border-transparent";
                else if (app.status === "Rejected") badgeStyles = "border border-[#EF4444] text-[#EF4444] bg-white";

                return (
                  <div key={app.id} className="bg-white rounded-[14px] border border-[#efeff5] flex flex-col overflow-hidden transition-all duration-300">
                    <button 
                      onClick={() => toggleCard(app.id)}
                      className="w-full flex items-center p-4 hover:bg-[#fcfcfd] transition-colors text-left"
                    >
                      <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 mr-4 text-[12px] font-[800]" style={{ backgroundColor: app.avatarBg, color: app.avatarColor }}>
                        {app.initials}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-[14px] font-[700] text-[#0f1828] mb-0.5">{app.club}</span>
                        <span className="text-[12px] font-[500] text-[#8896b0]">{app.appliedDate}</span>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className={`px-[10px] py-[3px] rounded-[6px] text-[11px] font-[700] tracking-wide ${badgeStyles}`}>
                          {badgeText}
                        </div>
                        <div className="w-[26px] h-[26px] rounded-full border border-[#efeff5] bg-white flex items-center justify-center text-[#8896b0]">
                          <ChevronDown className={`w-[14px] h-[14px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="mx-[56px] pb-6 pt-2 border-t border-[#efeff5] flex flex-col gap-[18px]">
                        {app.steps.map((step, idx) => {
                          const isLast = idx === app.steps.length - 1;
                          let dotStyle = "bg-[#e8e8f0]";
                          let lineStyle = "border-[#efeff5] border-dashed";
                          let textStyle = "text-[#8896b0]";
                          let animateClass = "";

                          if (step.status === "completed") {
                            dotStyle = "bg-[#7C5CFC]";
                            lineStyle = "border-[#7C5CFC] border-solid";
                            textStyle = "text-[#0f1828]";
                          } else if (step.status === "completed-green") {
                            dotStyle = "bg-[#22c55e]";
                            textStyle = "text-[#22c55e]";
                          } else if (step.status === "active-amber") {
                            dotStyle = "bg-[#F59E0B] shadow-[0_0_0_4px_rgba(245,158,11,0.2)]";
                            animateClass = "animate-pulse";
                            textStyle = "text-[#0f1828]";
                          } else if (step.status === "active-purple") {
                            dotStyle = "bg-[#7C5CFC] shadow-[0_0_0_4px_rgba(124,92,252,0.2)]";
                            animateClass = "animate-pulse";
                            textStyle = "text-[#0f1828]";
                          } else if (step.status === "rejected") {
                            dotStyle = "bg-[#EF4444]";
                            textStyle = "text-[#EF4444]";
                          }

                          return (
                            <div key={idx} className="flex items-start relative gap-4">
                              {!isLast && (
                                <div className={`absolute left-[4.5px] top-[14px] bottom-[-20px] w-0 border-l-[2px] ${lineStyle} z-0`} />
                              )}
                              <div className={`w-[11px] h-[11px] rounded-full shrink-0 mt-[2px] relative z-10 ring-[3px] ring-white ${dotStyle} ${animateClass}`} />
                              <div className="flex flex-col mt-[-2px]">
                                <span className={`text-[13px] font-[600] ${textStyle}`}>{step.title}</span>
                                <span className="text-[11px] font-[500] text-[#c4c7cf] mt-0.5">{step.date}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* DARK CARD at bottom */}
          <div className="bg-[#0f1828] rounded-[14px] p-[18px] w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-[10px] font-[800] text-white/50 uppercase tracking-[2px] mb-1">Timeline</h3>
              <p className="text-[13px] text-white font-[500] flex items-center gap-2">
                Spring 2026
                <span className="bg-[rgba(255,255,255,0.1)] text-white/80 px-2 py-0.5 rounded-[4px] text-[10px] font-[700]">4 Total</span>
              </p>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex flex-col gap-1.5 flex-1 sm:w-[80px]">
                <div className="flex items-center gap-1.5 text-[10px] font-[600] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8896b0]" />Pending
                </div>
                <div className="w-full h-[4px] bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8896b0]" style={{ width: '25%' }} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1 sm:w-[80px]">
                <div className="flex items-center gap-1.5 text-[10px] font-[600] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />Interview
                </div>
                <div className="w-full h-[4px] bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F59E0B]" style={{ width: '25%' }} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1 sm:w-[80px]">
                <div className="flex items-center gap-1.5 text-[10px] font-[600] text-white/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />Decided
                </div>
                <div className="w-full h-[4px] bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#22c55e]" style={{ width: '25%' }} />
                  <div className="h-full bg-[#EF4444]" style={{ width: '25%' }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
