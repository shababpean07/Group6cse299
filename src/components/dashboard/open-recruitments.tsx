import Link from "next/link";
import { cn } from "@/lib/utils";

const recruitments = [
  {
    id: 1,
    club: "NSU ACM SC",
    tag: "Engineering",
    tagColor: "text-[#0D7377]",
    tagBg: "bg-[rgba(13,115,119,0.12)]",
    members: "1.2k members",
    deadline: "Mar 10",
    daysLeft: 6,
  },
  {
    id: 2,
    club: "NSU Robotics Club",
    tag: "Engineering",
    tagColor: "text-[#0D7377]",
    tagBg: "bg-[rgba(13,115,119,0.12)]",
    members: "850 members",
    deadline: "Mar 15",
    daysLeft: 11,
  },
  {
    id: 3,
    club: "NSU Drama & Theatre",
    tag: "Arts",
    tagColor: "text-[#8b5cf6]",
    tagBg: "bg-[#f5f3ff]",
    members: "420 members",
    deadline: "Mar 20",
    daysLeft: 16,
  },
  {
    id: 4,
    club: "NSU Photography",
    tag: "Creative",
    tagColor: "text-[#ec4899]",
    tagBg: "bg-[#fdf2f8]",
    members: "630 members",
    deadline: "Mar 25",
    daysLeft: 21,
  },
  {
    id: 5,
    club: "NSU Debate Club",
    tag: "Public Speaking",
    tagColor: "text-[#f59e0b]",
    tagBg: "bg-[#fffbeb]",
    members: "510 members",
    deadline: "Mar 28",
    daysLeft: 24,
  },
];

export function OpenRecruitments() {
  return (
    <section className="space-y-4 w-full animate-fade-up" style={{ animationDelay: "0.21s" }}>
      <div className="flex items-center justify-between">
        <h2 className="font-syne text-[18px] font-[700] text-text-primary">Open Recruitments</h2>
        <Link
          href="/recruitment"
          className="text-[13px] font-[700] text-teal hover:text-teal-dark transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(186px,1fr))] gap-5">
        {recruitments.map((item, i) => {
          const initials = item.club
            .replace("NSU ", "")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2);

          const isUrgent = item.daysLeft < 14;
          const progressPercent = Math.max(10, 100 - (item.daysLeft * 3));

          return (
            <div
              key={item.id}
              className="group relative flex flex-col bg-surface rounded-[12px] border-[1.5px] border-border p-4 transition-all duration-200 ease-out hover:border-teal hover:shadow-[0_8px_24px_rgba(13,115,119,0.12)] hover:-translate-y-[2px]"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-teal-light text-teal font-syne font-[700] text-[15px]">
                  {initials}
                </div>
                <span
                  className={cn(
                    "px-2.5 py-[3px] rounded-[20px] text-[10px] font-[700] tracking-[0.5px]",
                    item.tagBg,
                    item.tagColor
                  )}
                >
                  {item.tag.toUpperCase()}
                </span>
              </div>

              <h3 className="font-[700] text-text-primary text-[14px] mb-1 line-clamp-1">{item.club}</h3>
              <p className="text-[12px] text-text-secondary font-[500] mb-5">{item.members}</p>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-text-primary">Ends {item.deadline}</span>
                  <span className={isUrgent ? "text-amber-500" : "text-text-secondary"}>
                    {item.daysLeft}d left
                  </span>
                </div>
                <div className="h-1.5 w-full bg-canvas rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isUrgent ? "bg-amber-500" : "bg-teal"
                    )}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Link 
                  href="/recruitment" 
                  className="px-5 flex items-center justify-center bg-teal hover:bg-teal-dark text-white text-[13px] font-bold h-8 rounded-[8px] transition-all duration-200 hover:scale-[1.02] shadow-sm"
                >
                  Apply
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
