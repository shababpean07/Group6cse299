"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, X, Users, Check } from "lucide-react";

export default function STU05ModalPreviewPage() {
  return (
    <div className="relative min-h-screen w-full flex overflow-hidden bg-[#f5f6fa]">
      
      {/* 1. BLURRED DASHBOARD BACKGROUND */}
      <div className="absolute inset-0 z-0 flex blur-[6px] opacity-50 pointer-events-none select-none">
        {/* Fake Sidebar */}
        <div className="w-[228px] h-full bg-[#101828] shrink-0 border-r-[1.5px] border-[#1d2b3a]" />
        {/* Fake Main Content */}
        <div className="flex-1 flex flex-col h-full">
          {/* Fake Topbar */}
          <div className="h-[58px] bg-white border-b-[1.5px] border-[#e8ecf2] w-full shrink-0" />
          <div 
            className="flex-1 p-7 gap-6 flex flex-col" 
            style={{ 
              backgroundImage: "radial-gradient(#d1d9e6 1px, transparent 1px)", 
              backgroundSize: "22px 22px" 
            }}
          >
            <div className="w-1/3 h-10 bg-[#e8ecf2] rounded-lg mb-4" />
            <div className="w-full h-[140px] bg-white rounded-[14px] border-[1.5px] border-[#e8ecf2] shadow-sm" />
            <div className="flex gap-6 mt-2">
              <div className="flex-1 h-[400px] bg-white rounded-[14px] border-[1.5px] border-[#e8ecf2] shadow-sm" />
              <div className="flex-1 h-[400px] bg-white rounded-[14px] border-[1.5px] border-[#e8ecf2] shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. OVERLAY (Dimming) */}
      <div className="absolute inset-0 z-10 bg-[#101828]/40 backdrop-blur-[2px]" />

      {/* 3. FOREGROUND: TWO MODALS SIDE BY SIDE */}
      <div className="relative z-20 w-full min-h-screen flex flex-col xl:flex-row items-center justify-center gap-10 p-8 overflow-y-auto py-16">
        
        {/* FRAME 1: Default State */}
        <EventModalFrame variant="default" />
        
        {/* FRAME 2: Confirmed State */}
        <EventModalFrame variant="confirmed" />
        
      </div>
    </div>
  );
}

function EventModalFrame({ variant }: { variant: "default" | "confirmed" }) {
  const [isConfirmed, setIsConfirmed] = useState(variant === "confirmed");

  return (
    <div className="w-full max-w-[560px] bg-white rounded-[16px] shadow-2xl overflow-hidden flex flex-col shrink-0 animate-fade-up border-[1.5px] border-[#e8ecf2] relative">
      
      {/* Close Button */}
      <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-20 backdrop-blur-sm">
        <X className="w-4 h-4" />
      </button>

      {/* Banner Placeholder */}
      <div 
        className="h-[180px] w-full relative shrink-0"
        style={{ 
          backgroundColor: "#0D7377",
          backgroundImage: "radial-gradient(circle at 20% 0%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 100%, rgba(0,0,0,0.2) 0%, transparent 50%)"
        }}
      />

      {/* Content Body */}
      <div className="p-6 md:p-8 flex flex-col">
        
        {/* Event Title */}
        <h2 className="font-syne text-[20px] font-bold text-[#0f1828] mt-4 leading-tight">
          Robotics Showcase 2026
        </h2>

        {/* Info Chips Row */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f6fa] text-[#0f1828] text-[12px] font-bold rounded-[8px]">
            <Calendar className="w-3.5 h-3.5 text-[#8896b0]" />
            Mar 10 · 3:00 PM
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f6fa] text-[#0f1828] text-[12px] font-bold rounded-[8px]">
            <MapPin className="w-3.5 h-3.5 text-[#8896b0]" />
            NAC Auditorium, NSU
          </div>
        </div>

        {/* Hosted By Row */}
        <div className="flex items-center gap-3 mt-6 p-3 rounded-[12px] border-[1.5px] border-[#e8ecf2] bg-white">
          <div className="w-8 h-8 rounded-[8px] bg-[rgba(13,115,119,0.12)] text-[#0D7377] font-syne font-bold text-[12px] flex items-center justify-center shrink-0">
            RC
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#0f1828] leading-none mb-1">NSU Robotics Club</span>
            <span className="text-[11px] font-medium text-[#8896b0] leading-none flex items-center gap-1">
              <Users className="w-3 h-3" /> 42 members
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-[13.5px] leading-[1.6] text-[#0f1828] font-medium opacity-90">
          Join us for the annual Robotics Showcase where top teams present their autonomous machines. Get a hands-on experience with the latest tech and network with fellow enthusiasts.
        </p>

        {/* Divider */}
        <div className="h-[1.5px] bg-[#e8ecf2] w-full my-6 shrink-0" />

        {/* RSVP Section */}
        <div className="flex flex-col">
          <span className="font-syne text-[13px] font-semibold text-[#8896b0] mb-3">
            Will you attend?
          </span>

          {isConfirmed ? (
            <div className="w-full h-11 flex items-center justify-center gap-2 border-[1.5px] border-[#10b981] bg-[rgba(16,185,129,0.1)] text-[#10b981] font-bold text-[14px] rounded-[8px] cursor-default animate-in zoom-in-95 fade-in duration-300">
              <Check className="w-4 h-4" strokeWidth={3} />
              You're going!
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsConfirmed(true)}
                className="flex-1 h-11 bg-[#0D7377] text-white font-bold text-[14px] rounded-[8px] hover:bg-[#0a5c60] transition-all hover:scale-[1.02] shadow-[0_4px_12px_rgba(13,115,119,0.15)] flex items-center justify-center"
              >
                RSVP Yes
              </button>
              <button className="flex-1 h-11 bg-white border-[1.5px] border-[#e8ecf2] text-[#0f1828] font-bold text-[14px] rounded-[8px] hover:border-[#0D7377] hover:text-[#0D7377] transition-all flex items-center justify-center">
                Can't Make It
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
