import { cn } from "@/lib/utils";

export function ClubSkeleton({ delay }: { delay: string }) {
  return (
    <div
      className="group relative flex flex-col bg-white rounded-[12px] border-[1.5px] border-[#e8ecf2] overflow-hidden animate-fade-up opacity-0 h-[280px]"
      style={{ animationDelay: delay }}
    >
      {/* Banner Skeleton */}
      <div className="h-[100px] w-full shrink-0 bg-[#f5f6fa] relative overflow-hidden">
         <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      <div className="px-4 pb-4 flex flex-col flex-1 relative bg-white">
        {/* Avatar Skeleton */}
        <div className="absolute -top-6 left-4 flex h-12 w-12 rounded-[10px] border-[2px] border-white bg-[#f5f6fa] overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        {/* Badge Skeleton */}
        <div className="flex justify-end mt-3 mb-2">
            <div className="h-[22px] w-16 rounded-[20px] bg-[#f5f6fa] relative overflow-hidden">
                 <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
        </div>

        {/* Name Skeleton */}
        <div className="h-[18px] w-3/4 rounded bg-[#f5f6fa] mb-2 mt-4 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        {/* Desc Skeleton */}
        <div className="h-[14px] w-full rounded bg-[#f5f6fa] mb-6 relative overflow-hidden">
             <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        {/* Footer Row Skeleton */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="h-[24px] w-14 rounded-[6px] bg-[#f5f6fa] relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
          <div className="h-[30px] w-20 rounded-[8px] bg-[#f5f6fa] relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
