"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const events = [
  {
    id: 1,
    name: "Intra-University Hackathon",
    club: "NSU ACM SC",
    day: "10",
    month: "MAR",
    eventMonth: 2, // March (0-indexed)
    eventYear: 2026,
    eventDay: 10,
    color: "text-[#0D7377]",
    bg: "bg-[rgba(13,115,119,0.12)]",
  },
  {
    id: 2,
    name: "Robot Showcase 2026",
    club: "NSU Robotics Club",
    day: "14",
    month: "MAR",
    eventMonth: 2,
    eventYear: 2026,
    eventDay: 14,
    color: "text-[#8b5cf6]",
    bg: "bg-[#f5f3ff]",
  },
  {
    id: 3,
    name: "Creative Pitch Deck",
    club: "NSU Debate Club",
    day: "19",
    month: "MAR",
    eventMonth: 2,
    eventYear: 2026,
    eventDay: 19,
    color: "text-[#f59e0b]",
    bg: "bg-[#fffbeb]",
  },
];

export function UpcomingEvents() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(2);  // March 2026
  const [currentYear, setCurrentYear] = useState(2026);

  const goToPrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const monthLabel = new Date(currentYear, currentMonth, 1).toLocaleString("en-US", { month: "long" });

  const isCurrentRealMonth = currentMonth === now.getMonth() && currentYear === now.getFullYear();
  const today = isCurrentRealMonth ? now.getDate() : -1;

  // Only mark event dots in the month they belong to
  const eventDays = events
    .filter((e) => e.eventMonth === currentMonth && e.eventYear === currentYear)
    .map((e) => e.eventDay);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <section className="flex flex-col w-full lg:w-[380px] shrink-0 animate-fade-up" style={{ animationDelay: "0.35s" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne text-[18px] font-[700] text-text-primary">Upcoming Events</h2>
        <Link href="/events" className="text-[13px] font-[700] text-teal hover:text-teal-dark transition-colors">
          View All
        </Link>
      </div>

      <div className="bg-surface rounded-[12px] border-[1.5px] border-border p-5 shadow-sm hover:border-teal hover:shadow-[0_8px_24px_rgba(13,115,119,0.12)] hover:-translate-y-[2px] transition-all duration-200">
        {/* Events List */}
        <div className="space-y-4 mb-6">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-4 group">
              <div className={cn("flex flex-col items-center justify-center w-12 h-14 rounded-[10px] shrink-0 transition-colors", event.bg, event.color)}>
                <span className="font-syne font-[700] text-[20px] leading-none">{event.day}</span>
                <span className="text-[10px] font-[700] tracking-wider mt-0.5">{event.month}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-[700] text-text-primary text-[14px] truncate group-hover:text-teal transition-colors">{event.name}</h3>
                <p className="text-[12px] font-[500] text-text-secondary truncate">{event.club}</p>
              </div>
              <Link 
                href="/events" 
                className="flex items-center justify-center h-8 px-4 text-[12px] font-[700] text-teal border-[1.5px] border-teal rounded-[8px] hover:bg-teal-light transition-all duration-200 shrink-0"
              >
                RSVP
              </Link>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[1.5px] w-full bg-border mb-5" />

        {/* Mini Calendar Widget */}
        <div className="select-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-syne font-[700] text-text-primary text-[14px]">
              {monthLabel} {currentYear}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={goToPrev}
                aria-label="Previous month"
                className="p-1 rounded text-text-secondary hover:bg-canvas hover:text-text-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNext}
                aria-label="Next month"
                className="p-1 rounded text-text-secondary hover:bg-canvas hover:text-text-primary transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-2 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-[10px] font-[700] text-text-muted">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {calendarDays.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="h-8 w-full" />;
              }

              const isToday = day === today;
              const hasEvent = eventDays.includes(day);

              return (
                <div key={day} className="flex justify-center items-center h-8 relative">
                  <div
                    className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-[600] z-10",
                      isToday
                        ? "bg-teal text-white shadow-md shadow-teal-glow"
                        : "text-text-primary hover:bg-canvas cursor-pointer"
                    )}
                  >
                    {day}
                  </div>
                  {hasEvent && !isToday && (
                    <div className="absolute bottom-0 w-1 h-1 rounded-full bg-amber-500 z-20" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
