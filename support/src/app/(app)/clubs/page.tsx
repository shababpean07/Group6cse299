"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClubCard, ClubCardProps } from "@/components/clubs/club-card";
import { ClubSkeleton } from "@/components/clubs/club-skeleton";
import { clubsApi } from "@/lib/api";

const FILTERS = ["All", "Academic", "Cultural", "Sports", "Tech", "Arts"];

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; hex: string }> = {
  Tech: { bg: "bg-[#e6f4f5]", border: "border-[#0D7377]", text: "text-[#0D7377]", hex: "#0D7377" },
  Arts: { bg: "bg-[#fdf2f8]", border: "border-[#ec4899]", text: "text-[#ec4899]", hex: "#ec4899" },
  Academic: { bg: "bg-[#eff6ff]", border: "border-[#3b82f6]", text: "text-[#3b82f6]", hex: "#3b82f6" },
  Sports: { bg: "bg-[#fffbeb]", border: "border-[#f59e0b]", text: "text-[#f59e0b]", hex: "#f59e0b" },
  Cultural: { bg: "bg-[#f5f3ff]", border: "border-[#8b5cf6]", text: "text-[#8b5cf6]", hex: "#8b5cf6" },
};

function transformClub(apiClub: any): ClubCardProps {
  return {
    id: apiClub.id,
    name: apiClub.name,
    category: apiClub.category,
    desc: apiClub.description || apiClub.name,
    members: apiClub._count?.members || 0,
    accent: CATEGORY_COLORS[apiClub.category] || { bg: "bg-[#f5f6fa]", border: "border-[#8896b0]", text: "text-[#8896b0]", hex: "#8896b0" },
  };
}

export default function ClubsDirectoryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [clubs, setClubs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clubsApi.getAll({ category: activeFilter === "All" ? undefined : activeFilter });
      setClubs(data);
    } catch (err) {
      console.error('Error fetching clubs:', err);
      // Fallback mock data
      const mockClubs = [
        { id: '1', name: 'ACM', description: 'Association for Computing Machinery', category: 'Tech', _count: { members: 45 } },
        { id: '2', name: 'Earth Club', description: 'Environmental awareness and sustainability', category: 'Cultural', _count: { members: 30 } },
        { id: '3', name: 'NSU Sports Club', description: 'Promoting physical fitness', category: 'Sports', _count: { members: 60 } },
        { id: '4', name: 'NSU Debate Club', description: 'Fostering critical thinking', category: 'Cultural', _count: { members: 25 } },
        { id: '5', name: 'NSU Moot Club', description: 'Legal debate competitions', category: 'Academic', _count: { members: 20 } },
        { id: '6', name: 'NSUSS', description: 'North South University Science Society', category: 'Academic', _count: { members: 35 } },
        { id: '7', name: 'NSU Communication Club', description: 'Enhancing communication skills', category: 'Cultural', _count: { members: 28 } },
      ];
      setClubs(mockClubs);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [activeFilter]);

  const filteredClubs = useMemo(() => {
    if (!searchQuery.trim()) {
      return clubs.map(transformClub);
    }
    return clubs
      .filter((club) =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (club.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(transformClub);
  }, [clubs, searchQuery]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-up opacity-0" style={{ animationDelay: "0s", animationFillMode: "forwards" }}>
        <div>
          <h1 className="font-syne text-[32px] font-bold text-[#0f1828] leading-tight mb-2">Club Directory</h1>
          <p className="text-[15px] font-medium text-[#8896b0]">
            Discover {clubs.length} registered clubs at NSU
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
