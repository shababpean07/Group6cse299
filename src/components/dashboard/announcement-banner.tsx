"use client";
import { useState } from "react";
import { Megaphone, X } from "lucide-react";

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(true);
  
  if (!visible) return null;

  return (
    <div 
      className="relative w-full bg-[#101828] rounded-[12px] overflow-hidden shadow-lg animate-fade-up"
      style={{ animationDelay: "0.14s" }}
    >
      {/* Decorative blurred circles */}
      <div className="absolute top-0 right-10 w-48 h-48 bg-teal rounded-full mix-blend-screen filter blur-[80px] opacity-30 pointer-events-none" />
      <div className="absolute -bottom-10 right-40 w-40 h-40 bg-teal-dark rounded-full mix-blend-screen filter blur-[60px] opacity-40 pointer-events-none" />
      
      {/* Left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-teal" />

      <div className="flex items-center justify-between p-5 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5 text-[#4ecdc4]" />
          </div>
          <div>
            <p className="text-white text-sm md:text-base font-sans font-[500] leading-tight flex items-center gap-2">
              <span className="font-syne font-bold text-[#4ecdc4]">NSU Spring Fest 2026 registrations are now open</span> 
              <span className="text-white/60">— submit proposals by March 20</span>
            </p>
          </div>
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
