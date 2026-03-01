"use client";

import { useState, useEffect } from "react";
import { Search, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClubCard } from "@/components/clubs/club-card";
import { ClubSkeleton } from "@/components/clubs/club-skeleton";
import { CLUBS_DATA } from "@/lib/data/clubs";

const FILTERS = ["All", "Academic", "Cultural", "Sports", "Tech", "Arts"];

export default function ClubsDirectoryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate network request for data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // 800ms fake loading
    return () => clearTimeout(timer);
  }, [activeFilter, searchQuery]);

  // Derived state for filtered clubs
  const filteredClubs = CLUBS_DATA.filter((club) => {
    const matchesFilter = activeFilter === "All" || club.category === activeFilter;
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          club.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-up opacity-0" style={{ animationDelay: "0s", animationFillMode: "forwards" }}>
        <div>
          <h1 className="font-syne text-[32px] font-bold text-[#0f1828] leading-tight mb-2">Club Directory</h1>
          <p className="text-[15px] font-medium text-[#8896b0]">
            Discover {CLUBS_DATA.length} registered clubs at NSU
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-4">
          {/* Search Bar (400px max) */}
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aab4c8]" />
            <input
              type="text"
              placeholder="Search clubs by name or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-9 pr-10 rounded-lg bg-white border-[1.5px] border-[#e8ecf2] text-sm font-medium text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] transition-all focus:shadow-[0_0_0_4px_rgba(13,115,119,0.12)]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aab4c8] hover:text-[#0f1828] transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 max-w-[100vw]">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
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
      </div>

      {/* DIVIDER */}
      <div className="h-[1.5px] w-full bg-[#e8ecf2] animate-fade-up opacity-0" style={{ animationDelay: "0.07s", animationFillMode: "forwards" }} />

      {/* CONTENT GRID */}
      <div className="w-full">
        {isLoading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {[...Array(6)].map((_, i) => (
              <ClubSkeleton key={i} delay={`${0.14 + (i * 0.05)}s`} />
            ))}
          </div>
        ) : filteredClubs.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {filteredClubs.map((club, i) => (
              <ClubCard key={club.id} club={club} delay={`${0.14 + (i * 0.05)}s`} />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center w-full min-h-[400px] rounded-[14px] border-[1.5px] border-dashed border-[#d1d9e6] bg-white p-10 gap-5 text-center animate-fade-up opacity-0" style={{ animationDelay: "0.14s", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-[#f5f6fa] mb-2">
              <Search className="h-10 w-10 text-[#aab4c8]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-syne text-2xl font-bold text-[#0f1828] mb-2">
                No clubs found
              </h3>
              <p className="text-[15px] font-medium text-[#8896b0] max-w-[320px] mx-auto leading-relaxed">
                We couldn't find any clubs matching your current search or filter criteria.
              </p>
            </div>
            <button 
              onClick={() => {
                setActiveFilter("All");
                setSearchQuery("");
              }}
              className="inline-flex items-center justify-center rounded-[8px] border-[2px] border-[#0D7377] bg-white px-6 h-11 text-sm font-bold text-[#0D7377] transition-all hover:bg-[#e6f4f5] hover:-translate-y-[2px]"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
