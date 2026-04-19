"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar, ExternalLink } from "lucide-react";
import { eventsApi } from "@/lib/api";
import { useQrTicket } from "@/context/QrTicketContext";

const FILTERS = ["All", "Academic", "Cultural", "Sports", "Tech", "Arts"];
const VIEWS = ["Month", "Week", "Agenda"];

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  Tech: { bg: "bg-[rgba(13,115,119,0.12)]", color: "text-[#0D7377]" },
  Arts: { bg: "bg-[#fdf2f8]", color: "text-[#ec4899]" },
  Academic: { bg: "bg-[#eff6ff]", color: "text-[#3b82f6]" },
  Sports: { bg: "bg-[#fffbeb]", color: "text-[#f59e0b]" },
  Cultural: { bg: "bg-[#f5f3ff]", color: "text-[#8b5cf6]" },
};

function transformEvent(apiEvent: any) {
  const startDate = new Date(apiEvent.startDate);
  const endDate = new Date(apiEvent.endDate);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const styles = CATEGORY_STYLES[apiEvent.category] || { bg: "bg-[#f5f6fa]", color: "text-[#8896b0]" };

  return {
    id: apiEvent.id,
    date: startDate.getDate(),
    month: months[startDate.getMonth()],
    year: startDate.getFullYear(),
    category: apiEvent.category,
    name: apiEvent.title,
    club: apiEvent.club?.name || "Unknown Club",
    time: `${formatTime(startDate)} - ${formatTime(endDate)}`,
    venue: apiEvent.venue || (apiEvent.isOnline ? "Online" : "TBD"),
    bg: styles.bg,
    color: styles.color,
  };
}

export default function EventCalendarPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeView, setActiveView] = useState("Month");
  const [popoverEventId, setPopoverEventId] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(1);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { RSVP } = useQrTicket();

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await eventsApi.getAll({
          category: activeFilter === "All" ? undefined : activeFilter,
          month: String(currentMonth),
          year: String(currentYear),
        });
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [activeFilter, currentMonth, currentYear]);

  const daysInMonth = 31;
  const firstDayOfWeek = 0;
  const todayDate = today.getDate();

  const filteredEvents = useMemo(() => {
    return events.map(transformEvent);
  }, [events]);
  // Grouped Events for Agenda View
  const groupedAgendaEvents = filteredEvents.reduce((acc, evt) => {
    if (!acc[evt.date]) acc[evt.date] = [];
    acc[evt.date].push(evt);
    return acc;
  }, {} as Record<number, typeof EVENTS_DATA>);
  const sortedAgendaDates = Object.keys(groupedAgendaEvents).map(Number).sort((a, b) => a - b);

  // Generate Calendar Grid (42 cells to ensure 6 rows if needed, or dynamic)
  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }
  // Pad the end to complete the last row
  const remainingCells = 7 - (calendarCells.length % 7);
  if (remainingCells < 7) {
    for (let i = 0; i < remainingCells; i++) {
      calendarCells.push(null);
    }
  }

  // Handle outside click for popover roughly
  const closePopover = () => setPopoverEventId(null);

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto pb-12" onClick={closePopover}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-up opacity-0" style={{ animationDelay: "0s", animationFillMode: "forwards" }}>
        
        <div className="flex flex-col gap-4">
          <h1 className="font-syne text-[32px] font-bold text-[#0f1828] leading-tight">Event Calendar</h1>
          
          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 max-w-[100vw]">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFilter(filter);
                  }}
                  className={cn(
                    "px-4 py-1.5 rounded-[20px] text-sm font-bold transition-all duration-200 shrink-0 border-[1.5px]",
                    isActive 
                      ? "bg-[#0D7377] text-white border-[#0D7377]" 
                      : "bg-white text-[#8896b0] border-[#e8ecf2] hover:bg-[#e6f4f5] hover:text-[#0D7377] hover:border-[#e6f4f5]"
                  )}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-[#f5f6fa] p-1 rounded-[10px] border-[1.5px] border-[#e8ecf2] shrink-0" onClick={e => e.stopPropagation()}>
          {VIEWS.map((view) => {
            const isActive = activeView === view;
            return (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={cn(
                  "px-5 py-2 rounded-[8px] text-[13px] font-bold transition-all duration-200",
                  isActive 
                    ? "bg-[#0D7377] text-white shadow-sm" 
                    : "text-[#8896b0] hover:text-[#0f1828]"
                )}
              >
                {view}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEWS */}
      {activeView === "Month" && (
        <div className="flex flex-col bg-white border-[1.5px] border-[#e8ecf2] rounded-[14px] shadow-sm overflow-hidden animate-fade-up opacity-0" style={{ animationDelay: "0.07s", animationFillMode: "forwards" }}>
          
          {/* Month Header */}
          <div className="flex items-center justify-between p-5 border-b-[1.5px] border-[#e8ecf2]">
            <h2 className="font-syne text-[20px] font-bold text-[#0f1828]">March 2026</h2>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#8896b0] hover:border-[#0D7377] hover:text-[#0D7377] transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#8896b0] hover:border-[#0D7377] hover:text-[#0D7377] transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 bg-[#f5f6fa] border-b-[1.5px] border-[#e8ecf2]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-center font-syne text-[12px] font-bold text-[#8896b0] uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* CSS Grid Calendar */}
          <div className="grid grid-cols-7 auto-rows-[130px] bg-[#e8ecf2] gap-[1px]">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="bg-white" />;
              }

              const isToday = day === todayDate;
              const dayEvents = filteredEvents.filter(e => e.date === day);

              return (
                <div 
                  key={day} 
                  className={cn(
                    "bg-white p-2 relative flex flex-col gap-1.5 transition-colors hover:bg-[#fafafa]",
                    isToday && "bg-[#f5fbfb]"
                  )}
                >
                  <div className="flex justify-end">
                    <span className={cn(
                      "font-syne text-[14px] font-bold w-7 h-7 flex items-center justify-center rounded-full z-10",
                      isToday ? "bg-[#0D7377] text-white shadow-sm" : "text-[#0f1828]"
                    )}>
                      {day}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 overflow-y-auto scrollbar-hide flex-1">
                    {dayEvents.map((evt) => (
                      <div key={evt.id} className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPopoverEventId(popoverEventId === evt.id ? null : evt.id);
                          }}
                          className={cn(
                            "w-full text-left truncate px-2 py-1.5 rounded-[6px] text-[11px] font-bold transition-all shadow-sm",
                            evt.bg, evt.color,
                            popoverEventId === evt.id ? "ring-2 ring-offset-1 ring-[#0D7377]" : "hover:brightness-95"
                          )}
                        >
                          {evt.name}
                        </button>

                        {/* POPOVER CARD */}
                        {popoverEventId === evt.id && (
                          <div 
                            className="absolute top-full left-0 mt-2 z-50 w-[240px] bg-white rounded-[10px] border-[1.5px] border-[#e8ecf2] shadow-[0_8px_30px_rgba(16,24,40,0.12)] p-4 flex flex-col gap-2 animate-fade-up"
                            style={{ animationDelay: "0s", animationFillMode: "forwards", animationDuration: "0.2s" }}
                            onClick={e => e.stopPropagation()}
                          >
                            <span className={cn("px-2 py-0.5 rounded-[20px] text-[9px] font-bold tracking-[0.5px] w-fit", evt.bg, evt.color)}>
                              {evt.category.toUpperCase()}
                            </span>
                            <h4 className="font-syne text-[15px] font-bold text-[#0f1828] leading-tight">{evt.name}</h4>
                            <p className="text-[12px] font-bold text-[#8896b0] mb-1">{evt.club}</p>
                            
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8896b0] mt-2">
                              <Clock className="w-3 h-3" /> {evt.time}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8896b0]">
                              <MapPin className="w-3 h-3" /> {evt.venue}
                            </div>

                            <button className="mt-2 w-full h-8 flex items-center justify-center bg-white border-[1.5px] border-[#0D7377] text-[#0D7377] text-[11px] font-bold rounded-[6px] hover:bg-[#e6f4f5] transition-colors">
                              View Details
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeView === "Agenda" && (
        <div className="flex flex-col gap-10">
          {sortedAgendaDates.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full min-h-[300px] rounded-[14px] border-[1.5px] border-dashed border-[#d1d9e6] bg-white p-10 gap-4 text-center animate-fade-up opacity-0" style={{ animationDelay: "0.07s", animationFillMode: "forwards" }}>
              <Calendar className="h-10 w-10 text-[#aab4c8]" strokeWidth={2} />
              <h3 className="font-syne text-2xl font-bold text-[#0f1828] mt-2">No events found</h3>
              <p className="text-[15px] font-medium text-[#8896b0]">No upcoming events match your filter criteria.</p>
            </div>
          ) : (
            sortedAgendaDates.map((date, idx) => {
              // Convert date number to day name (rough mock for March 2026: 1 is Sun)
              const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
              const dayName = days[date % 7];

              return (
                <div key={date} className="flex flex-col animate-fade-up opacity-0" style={{ animationDelay: `${0.07 + (idx * 0.07)}s`, animationFillMode: "forwards" }}>
                  
                  {/* Group Header */}
                  <h3 className="font-syne text-[14px] font-bold text-[#8896b0] tracking-wide mb-4 flex items-center gap-3">
                    {dayName} <span className="w-1.5 h-1.5 rounded-full bg-[#d1d9e6]" /> MARCH {date}, 2026
                  </h3>

                  {/* Group Events */}
                  <div className="flex flex-col gap-4">
                    {groupedAgendaEvents[date].map((evt) => (
                      <div 
                        key={evt.id} 
                        className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border-[1.5px] border-[#e8ecf2] p-5 rounded-[12px] shadow-sm hover:border-[#0D7377] hover:shadow-[0_8px_24px_rgba(13,115,119,0.12)] hover:-translate-y-[2px] transition-all duration-200 group"
                      >
                        <div className={cn("flex flex-row sm:flex-col items-center justify-center sm:w-16 sm:h-16 rounded-[10px] shrink-0 px-4 py-2 sm:px-0 sm:py-0 transition-colors", evt.bg, evt.color)}>
                          <span className="font-syne font-bold text-[18px] sm:text-[24px] leading-none sm:mb-0.5">{evt.date}</span>
                          <span className="text-[10px] sm:text-[11px] font-bold tracking-wider ml-2 sm:ml-0">{evt.month}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={cn("px-2 py-[2px] rounded-[20px] text-[9px] font-bold tracking-[0.5px]", evt.bg, evt.color)}>
                              {evt.category.toUpperCase()}
                            </span>
                            <span className="text-[12px] font-bold text-[#8896b0]">• {evt.club}</span>
                          </div>
                          
                          <h4 className="font-bold text-[#0f1828] text-[17px] truncate group-hover:text-[#0D7377] transition-colors mb-1.5">{evt.name}</h4>
                          
                          <div className="flex items-center gap-4">
                            <p className="text-[12.5px] font-medium text-[#8896b0] flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" /> {evt.time}
                            </p>
                            <p className="text-[12.5px] font-medium text-[#8896b0] flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" /> {evt.venue}
                            </p>
                          </div>
                        </div>

                        <button 
                          onClick={() => RSVP(evt.id)}
                          className="h-10 px-6 w-full sm:w-auto text-[13px] font-bold text-[#0D7377] bg-white border-[1.5px] border-[#0D7377] rounded-[8px] hover:bg-[#0D7377] hover:text-white transition-all shrink-0 mt-2 sm:mt-0"
                        >
                          RSVP Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Week View */}
      {activeView === "Week" && (
        <div className="flex flex-col bg-white border-[1.5px] border-[#e8ecf2] rounded-[14px] shadow-sm overflow-hidden animate-fade-up opacity-0" style={{ animationDelay: "0.07s", animationFillMode: "forwards" }}>
          
          {/* Week Header */}
          <div className="flex items-center justify-between p-5 border-b-[1.5px] border-[#e8ecf2]">
            <h2 className="font-syne text-[20px] font-bold text-[#0f1828]">March {weekStart} - {Math.min(weekStart + 6, daysInMonth)}, 2026</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setWeekStart(Math.max(1, weekStart - 7))}
                disabled={weekStart === 1}
                className="w-8 h-8 flex items-center justify-center rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#8896b0] hover:border-[#0D7377] hover:text-[#0D7377] disabled:opacity-50 disabled:hover:border-[#e8ecf2] disabled:hover:text-[#8896b0] transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setWeekStart(Math.min(29, weekStart + 7))}
                disabled={weekStart >= 29}
                className="w-8 h-8 flex items-center justify-center rounded-[8px] border-[1.5px] border-[#e8ecf2] text-[#8896b0] hover:border-[#0D7377] hover:text-[#0D7377] disabled:opacity-50 disabled:hover:border-[#e8ecf2] disabled:hover:text-[#8896b0] transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 bg-[#f5f6fa] border-b-[1.5px] border-[#e8ecf2]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
              const dateNum = weekStart + idx;
              const isValid = dateNum <= daysInMonth;
              const isToday = dateNum === todayDate;

              return (
                <div key={day} className={cn(
                  "py-3 flex flex-col items-center justify-center border-r-[1.5px] border-[#e8ecf2] last:border-0",
                  isToday && "bg-[#e6f4f5]"
                )}>
                  <span className={cn("font-syne text-[11px] font-bold uppercase tracking-wider mb-1", isToday ? "text-[#0D7377]" : "text-[#8896b0]")}>
                    {day}
                  </span>
                  {isValid && (
                    <span className={cn("font-syne text-[18px] font-bold w-8 h-8 flex items-center justify-center rounded-full", isToday ? "bg-[#0D7377] text-white" : "text-[#0f1828]")}>
                      {dateNum}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-7 min-h-[500px] bg-[#e8ecf2] gap-[1px]">
            {Array.from({ length: 7 }).map((_, idx) => {
              const dateNum = weekStart + idx;
              const isValid = dateNum <= daysInMonth;
              const isToday = dateNum === todayDate;
              const dayEvents = isValid ? filteredEvents.filter(e => e.date === dateNum) : [];

              return (
                <div key={idx} className={cn("bg-white p-2.5 flex flex-col gap-2 transition-colors hover:bg-[#fafafa]", isToday && "bg-[#f9fcfc]")}>
                  {dayEvents.map(evt => (
                    <div 
                      key={evt.id} 
                      className={cn(
                        "relative flex flex-col p-2.5 rounded-[8px] border-[1px] border-transparent hover:shadow-sm transition-all cursor-pointer group", 
                        evt.bg, evt.color,
                        "hover:border-current hover:-translate-y-[1px]"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                        <span className="text-[10px] font-bold tracking-wide uppercase opacity-80">{evt.time.split(' - ')[0]}</span>
                      </div>
                      <h4 className="font-bold text-[12px] leading-tight mb-1.5 line-clamp-2">{evt.name}</h4>
                      <p className="text-[10px] font-medium opacity-80 truncate flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        {evt.venue}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
