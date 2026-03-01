import { Briefcase, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const stats = [
  {
    value: "5",
    label: "Open Recruitments",
    subtext: "Apply before they close",
    icon: Briefcase,
    color: "text-teal",
    bg: "bg-teal-light",
    iconColor: "text-teal",
    href: "/recruitment"
  },
  {
    value: "3",
    label: "Upcoming Events",
    subtext: "In the next 7 days",
    icon: Calendar,
    color: "text-purple-600",
    bg: "bg-purple-100",
    iconColor: "text-purple-600",
    href: "/events"
  },
  {
    value: "0",
    label: "Clubs Followed",
    subtext: "Browse to get started",
    icon: Users,
    color: "text-amber-500",
    bg: "bg-amber-100",
    iconColor: "text-amber-500",
    href: "/clubs"
  }
];

export function StatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-up" style={{ animationDelay: "0.07s" }}>
      {stats.map((stat, i) => (
        <Link href={stat.href} key={i} className="bg-surface rounded-[12px] border-[1.5px] border-border p-5 flex items-start gap-4 hover:border-teal hover:shadow-[0_8px_24px_rgba(13,115,119,0.12)] hover:-translate-y-[2px] transition-all duration-200 ease-out cursor-pointer">
          <div className={cn("w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0", stat.bg)}>
            <stat.icon className={cn("w-6 h-6", stat.iconColor)} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className={cn("font-syne text-[28px] font-[700] leading-none", stat.color)}>{stat.value}</span>
            </div>
            <span className="text-[13px] font-[700] text-text-primary mt-1">{stat.label}</span>
            <span className="text-[12px] font-[500] text-text-secondary mt-0.5">{stat.subtext}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
