"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { NotificationPanel } from "./notification-panel";

export function Topbar() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <>
      <header className="h-[58px] bg-white border-b border-[#efeff5] flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center w-full max-w-[380px] relative">
          <Search className="w-4 h-4 text-[#8896b0] absolute left-3" />
          <input 
            type="text" 
            placeholder="Search clubs, events..." 
            className="w-full h-9 bg-[#f7f7fc] border border-[#efeff5] rounded-[8px] pl-9 pr-10 text-[13px] font-[500] text-[#0f1828] placeholder:text-[#c4c7cf] outline-none focus:border-[#7C5CFC] focus:bg-white transition-colors"
          />
          <div className="absolute right-2 flex items-center justify-center bg-white border border-[#efeff5] rounded-[4px] px-1.5 h-5 text-[10px] font-[700] text-[#8896b0]">
            ⌘F
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="bg-[#0f1828] text-white text-[13px] font-[700] px-4 h-9 rounded-[10px] hover:bg-black transition-colors shadow-sm">
            + Apply Now
          </button>
          <button 
            onClick={() => setIsNotifOpen(true)}
            className="relative w-[32px] h-[32px] flex items-center justify-center text-[#8896b0] hover:text-[#0f1828] hover:bg-[#f4f4f8] rounded-[10px] transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-[6px] right-[7px] w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white"></span>
          </button>
          <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-tr from-[#7C5CFC] to-[#c4bffc] cursor-pointer shadow-sm flex items-center justify-center text-white text-[11px] font-[700]">
            AS
          </div>
        </div>
      </header>

      <NotificationPanel 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
      />
    </>
  );
}
