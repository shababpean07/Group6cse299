"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, UserPlus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clubs", href: "/clubs", icon: Users },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Recruitment", href: "/recruitment", icon: UserPlus },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[228px] bg-sidebar-bg flex-col border-r border-sidebar-border h-full flex-shrink-0 z-20">
      {/* Logo Area */}
      <div className="h-[80px] px-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-teal flex items-center justify-center text-white font-syne font-bold text-lg">
          N
        </div>
        <div className="flex flex-col">
          <span className="text-white font-syne font-bold leading-tight">ClubHub</span>
          <span className="text-white/45 text-[10px] uppercase tracking-wider font-semibold">NSU Portal</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 relative overflow-hidden",
                isActive 
                  ? "bg-[rgba(13,115,119,0.18)] text-[#4ecdc4]" 
                  : "text-white/45 hover:text-white/70 hover:bg-white/5"
              )}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-teal rounded-r-full" />
              )}
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
          <Avatar className="w-9 h-9 border border-white/10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-teal text-white text-xs font-bold">AS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Alif Shahriar</span>
            <span className="text-xs text-white/45">Student</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
