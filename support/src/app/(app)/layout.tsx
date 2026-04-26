import { Search, Bell } from "lucide-react";
import Link from "next/link";
import { NotificationPanel } from "@/components/NotificationPanel";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas text-text-primary">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN COLUMN */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-[58px] bg-surface border-b border-border flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center w-full max-w-[360px] relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3" />
            <input 
              type="text" 
              placeholder="Search clubs, events..." 
              className="w-full h-9 bg-canvas border border-border rounded-[8px] pl-9 pr-4 text-[13px] font-[500] text-text-primary placeholder:text-text-muted outline-none focus:border-teal focus:bg-surface transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationPanel>
              <button className="relative w-[32px] h-[32px] flex items-center justify-center text-text-secondary hover:text-teal hover:bg-teal-light rounded-[8px] transition-colors">
                <Bell className="w-[18px] h-[18px]" />
                {/* Pulsing red dot */}
                <span className="absolute top-[6px] right-[6px] w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
              </button>
            </NotificationPanel>
            <Link href="/settings" className="w-[32px] h-[32px] rounded-full bg-teal cursor-pointer shadow-sm flex items-center justify-center text-white font-syne font-[700] text-[11px]">
              AS
            </Link>
          </div>
        </header>

        {/* CANVAS */}
        <main className="flex-1 overflow-auto p-7 pb-24 md:pb-7 relative"
          style={{ background: "#f5f6fa",
                   backgroundImage: "radial-gradient(#d1d9e6 1px, transparent 1px)",
                   backgroundSize: "22px 22px" }}>
          <div className="max-w-[1200px] mx-auto h-full relative z-10">
            {children}
          </div>
        </main>
        
      </div>
      <MobileTabBar />
    </div>
  );
}
