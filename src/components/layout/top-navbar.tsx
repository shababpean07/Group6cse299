"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopNavbar() {
  return (
    <header className="h-[58px] bg-white border-b border-[#e8ecf2] flex items-center justify-between px-6 shrink-0 z-10">
      <div className="w-full max-w-[360px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <Input 
          placeholder="Search for clubs, events, or students..." 
          className="pl-9 h-9 bg-canvas border-transparent focus-visible:ring-teal focus-visible:bg-white transition-all rounded-md text-sm"
        />
      </div>
      
      <div className="flex items-center gap-5">
        <button className="relative text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
        </button>
        <Avatar className="w-8 h-8 border border-border cursor-pointer">
          <AvatarFallback className="bg-teal-light text-teal text-xs font-bold">AS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
