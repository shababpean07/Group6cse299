import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function MiniCalendar() {
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const eventDates = [10, 14, 19];
  const today = 4;
  const emptyStartDays = 0; // Starts on Sunday for Mar 2026

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="font-syne font-bold text-sm text-text-primary">March 2026</span>
        <div className="flex gap-1">
          <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-canvas text-text-secondary"><ChevronLeft className="w-4 h-4" /></button>
          <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-canvas text-text-secondary"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {days.map(d => (
          <span key={d} className="text-[10px] font-bold text-text-secondary uppercase">{d}</span>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: emptyStartDays }).map((_, i) => (
          <div key={`empty-${i}`} className="h-7" />
        ))}
        {dates.map(date => {
          const isToday = date === today;
          const hasEvent = eventDates.includes(date);
          
          return (
            <div 
              key={date} 
              className={cn(
                "h-7 flex items-center justify-center rounded-md text-xs font-semibold relative cursor-pointer hover:bg-canvas transition-colors",
                isToday ? "bg-teal text-white hover:bg-teal-dark" : "text-text-primary"
              )}
            >
              {date}
              {hasEvent && !isToday && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-teal"></span>
              )}
              {hasEvent && isToday && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white"></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
