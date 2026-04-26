"use client"

import React, { useState } from "react"
import { Bell, Calendar, AlertTriangle, CheckCircle, Megaphone } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type NotificationType = "bell" | "calendar" | "warning" | "success" | "announcement"

interface Notification {
  id: number
  type: NotificationType
  title: string
  time: string
  unread: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "bell",
    title: "Your application to NSU Robotics Club → Interview Scheduled",
    time: "2h ago",
    unread: true,
  },
  {
    id: 2,
    type: "calendar",
    title: "Photography Society posted: Spring Showcase · Mar 22",
    time: "5h ago",
    unread: true,
  },
  {
    id: 3,
    type: "warning",
    title: "Debate Club recruitment closes in 4 days",
    time: "1d ago",
    unread: false,
  },
  {
    id: 4,
    type: "success",
    title: "Your RSVP for Tech Fest 2026 was confirmed",
    time: "2d ago",
    unread: false,
  },
  {
    id: 5,
    type: "announcement",
    title: "Spring Fest 2026 registrations are now open",
    time: "3d ago",
    unread: false,
  },
]

const getIconForType = (type: NotificationType) => {
  switch (type) {
    case "bell":
      return <Bell size={18} className="text-[var(--purple)]" />
    case "calendar":
      return <Calendar size={18} className="text-[var(--amber)]" />
    case "warning":
      return <AlertTriangle size={18} className="text-[var(--red)]" />
    case "success":
      return <CheckCircle size={18} className="text-[var(--green)]" />
    case "announcement":
      return <Megaphone size={18} className="text-[var(--purple)]" />
    default:
      return <Bell size={18} className="text-[var(--purple)]" />
  }
}

const getBgForType = (type: NotificationType) => {
  switch (type) {
    case "bell":
    case "announcement":
      return "bg-[var(--purple-light)]"
    case "calendar":
      return "bg-[rgba(245,158,11,0.15)]" // Light amber
    case "warning":
      return "bg-[rgba(239,68,68,0.15)]" // Light red
    case "success":
      return "bg-[rgba(34,197,94,0.15)]" // Light green
    default:
      return "bg-[var(--purple-light)]"
  }
}

export function NotificationPanel({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[400px] p-0 flex flex-col bg-white border-l border-[var(--border)] focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* HEADER ROW */}
          <SheetHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-[var(--border)] shrink-0 space-y-0 text-left">
            <div className="flex items-center gap-3">
              <SheetTitle className="font-outfit text-[16px] font-[700] text-[var(--dark)] tracking-tight">
                Notifications
              </SheetTitle>
              {unreadCount > 0 && (
                <span className="bg-[var(--purple-light)] text-[var(--purple)] text-[11px] font-[700] px-[8px] py-[3px] rounded-[6px]">
                  {unreadCount} new
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-[13px] font-[500] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors pr-6 sm:pr-0"
              >
                Mark all read
              </button>
            )}
          </SheetHeader>

          {/* SCROLL LIST */}
          <div className="flex-1 overflow-y-auto bg-white">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="flex flex-col items-center justify-center w-full py-[40px] px-[20px] rounded-[14px] border-[1.5px] border-dashed border-[#e0e0ec] bg-white">
                  <Bell size={28} className="text-[var(--text-3)] mb-4" />
                  <h3 className="font-[700] text-[15px] text-[var(--dark)] mb-1">
                    You&apos;re all caught up!
                  </h3>
                  <p className="text-[13px] text-[var(--text-2)] mb-4">
                    Check back later for new updates and alerts.
                  </p>
                  <button
                    onClick={() => setNotifications(MOCK_NOTIFICATIONS)}
                    className="px-4 py-2 text-[13px] font-[700] border border-[var(--purple)] text-[var(--purple)] bg-white rounded-[8px] hover:bg-[var(--purple)] hover:text-white transition-colors"
                  >
                    Reload Mock Data
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-start gap-[12px] px-[16px] py-[14px] border-b border-[var(--border)] hover:bg-[#fafafc] transition-colors group cursor-pointer"
                  >
                    {/* Left: 36px icon circle */}
                    <div
                      className={`w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 ${getBgForType(
                        notif.type
                      )}`}
                    >
                      {getIconForType(notif.type)}
                    </div>

                    {/* Center: Notification text */}
                    <div className="flex-1 min-w-0 flex flex-col pt-[1px] pr-2">
                      <p
                        className={`text-[13.5px] leading-[1.35] text-[var(--text-1)] mb-[4px] ${
                          notif.unread ? "font-[600]" : "font-[400]"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-[var(--text-2)] font-[400]">
                        {notif.time}
                      </p>
                    </div>

                    {/* Right: Unread dot */}
                    <div className="w-[8px] flex justify-center pt-[8px] shrink-0">
                      {notif.unread && (
                        <div className="w-[7px] h-[7px] bg-[var(--purple)] rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DARK CARD at panel bottom (always visible) */}
          <div className="p-[26px] bg-white mt-auto shrink-0 border-t border-[var(--border)]">
            <div className="bg-[var(--dark)] rounded-[16px] p-[18px] px-[20px] flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-white text-[13.5px] font-[600] mb-[2px]">
                  {unreadCount} unread <span className="opacity-50 font-[400]">· Last updated just now</span>
                </p>
              </div>
              <button
                onClick={clearAll}
                className="text-[13px] font-[500] text-white/70 hover:text-white transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
