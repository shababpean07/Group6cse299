import { StatsRow } from "@/components/dashboard/stats-row";
import { AnnouncementBanner } from "@/components/dashboard/announcement-banner";
import { OpenRecruitments } from "@/components/dashboard/open-recruitments";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { FollowedClubs } from "@/components/dashboard/followed-clubs";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto pb-10">
      <StatsRow />
      <AnnouncementBanner />
      <OpenRecruitments />
      <div className="flex flex-col lg:flex-row gap-8 items-stretch w-full">
        <FollowedClubs />
        <UpcomingEvents />
      </div>
    </div>
  );
}
