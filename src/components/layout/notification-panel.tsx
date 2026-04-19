"use client";

import { useEffect, useState } from "react";
import { Bell, Calendar, AlertTriangle, CheckCircle2, Megaphone, X } from "lucide-react";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "bell",
    icon: Bell,
    text: "Your application to NSU Robotics Club → Interview Scheduled",
    time: "2h ago",
    unread: true,
    color: "#7C5CFC",
    bg: "#f0eeff",
  },
  {
    id: 2,
    type: "calendar",
    icon: Calendar,
    text: "Photography Society posted: Spring Showcase · Mar 22",
    time: "5h ago",
    unread: true,
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  {
    id: 3,
    type: "alert",
    icon: AlertTriangle,
    text: "Debate Club recruitment closes in 4 days",
    time: "1d ago",
    unread: false,
    color: "#EF4444",
    bg: "#fee2e2",
  },
  {
    id: 4,
    type: "success",
    icon: CheckCircle2,
    text: "Your RSVP for Tech Fest 2026 was confirmed",
    time: "2d ago",
    unread: false,
    color: "#22c55e",
    bg: "#dcfce7",
  },
  {
    id: 5,
    type: "announcement",
    icon: Megaphone,
    text: "Spring Fest 2026 registrations are now open",
    time: "3d ago",
    unread: false,
    color: "#7C5CFC",
    bg: "#f0eeff",
  },
];

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsRendered(false), 300); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
      {/* OVERLAY */}
      <div 
        className={`absolute inset-0 bg-[#0f1828]/60 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />
      
      {/* PANEL */}
      <div 
        className={`absolute right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white border-l border-[#efeff5] shadow-[-20px_0_60px_rgba(0,0,0,0.12)] flex flex-col transition-transform duration-300 ease-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* HEADER ROW */}
        <div className="h-[58px] flex items-center justify-between px-5 border-b border-[#efeff5] shrink-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <h2 className="font-syne font-[700] text-[16px] text-[#0f1828]">Notifications</h2>
            {unreadCount > 0 && (
              <div className="bg-[#f0eeff] text-[#7C5CFC] px-[8px] py-[2px] rounded-[6px] text-[11px] font-[700]">
                {unreadCount} new
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-[12px] font-[600] text-[#8896b0] hover:text-[#0f1828] transition-colors"
              >
                Mark all read
              </button>
            )}
            <button 
              onClick={onClose}
              className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] text-[#8896b0] hover:bg-[#f4f4f8] hover:text-[#0f1828] transition-colors -mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SCROLL LIST */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col">
          {notifications.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <div className="w-[42px] h-[42px] rounded-full bg-[#f7f7fc] flex items-center justify-center mb-3">
                <Bell className="w-[20px] h-[20px] text-[#c4c7cf]" />
              </div>
              <p className="text-[14px] font-[500] text-[#8896b0]">You're all caught up!</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`flex items-start gap-3 p-[14px_16px] border-b border-[#efeff5] hover:bg-[#fafafc] transition-colors cursor-pointer group`}
                  onClick={() => {
                    if (notif.unread) {
                      setNotifications(notifications.map(n => n.id === notif.id ? { ...n, unread: false } : n));
                    }
                  }}
                >
                  {/* Left: 36px icon circle */}
                  <div 
                    className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: notif.bg, color: notif.color }}
                  >
                    <notif.icon className="w-[16px] h-[16px]" />
                  </div>

                  {/* Center: Text & Timestamp */}
                  <div className="flex-1 flex flex-col pt-0.5">
                    <span className={`text-[13.5px] leading-snug tracking-tight text-[#0f1828] ${notif.unread ? 'font-[600]' : 'font-[400]'}`}>
                      {notif.text}
                    </span>
                    <span className="text-[11px] font-[500] text-[#8896b0] mt-1.5">
                      {notif.time}
                    </span>
                  </div>

                  {/* Right: Unread Dot */}
                  <div className="w-[14px] flex justify-end shrink-0 pt-2">
                    {notif.unread && (
                      <div className="w-[7px] h-[7px] rounded-full bg-[#7C5CFC]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DARK CARD AT BOTTOM */}
        <div className="p-[20px] border-t border-[#efeff5] bg-white shrink-0">
          <div className="bg-[#0f1828] rounded-[14px] p-[16px] flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-[13px] font-[700] text-white">
                {unreadCount} unread
              </span>
              <span className="text-[11px] font-[500] text-white/50 mt-0.5">
                Last updated just now
              </span>
            </div>
            {notifications.length > 0 && (
              <button 
                onClick={clearAll}
                className="bg-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.12)] text-white text-[12px] font-[700] px-4 py-2 rounded-[8px] transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
