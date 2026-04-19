"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Lock, Eye, EyeOff, LogOut } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type Tab = "profile" | "password" | "notifications"

export default function SettingsPage() {
  const { logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("profile")
  
  // Profile State
  const [showToast, setShowToast] = useState(false)
  
  // Password State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const passwordsMatch = newPassword === confirmPassword || confirmPassword === ""
  
  // Simple password strength check
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0 // none
    if (pwd.length < 6) return 1 // weak
    if (pwd.length < 10 || !/\d/.test(pwd)) return 2 // fair
    return 3 // strong
  }
  
  const strength = getPasswordStrength(newPassword)
  const getStrengthLabel = () => {
    if (strength === 1) return { text: "Weak", color: "text-[var(--red)]" }
    if (strength === 2) return { text: "Fair", color: "text-[var(--amber)]" }
    if (strength === 3) return { text: "Strong", color: "text-[var(--green)]" }
    return { text: "", color: "" }
  }

  const handleSaveProfile = () => {
    setShowToast(false)
    setTimeout(() => {
      setShowToast(true)
    }, 50)
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "password", label: "Change Password" },
    { id: "notifications", label: "Notifications" },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-[24px] max-w-[1000px] mx-auto min-h-[calc(100vh-110px)] relative">
      
      {/* LEFT NAV / TOP TABS on mobile */}
      <div className="w-full md:w-[200px] shrink-0">
        <div className="bg-white rounded-[16px] p-[16px] md:p-[20px] flex flex-row md:flex-col gap-[8px] border border-[var(--border)] overflow-x-auto scrollbar-hide">
          <h2 className="hidden md:block font-syne text-[16px] font-[700] text-[var(--dark)] mb-[8px] px-[12px]">
            Settings
          </h2>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center px-[12px] py-[8px] text-[14px] whitespace-nowrap transition-colors text-left",
                activeTab === tab.id
                  ? "bg-[var(--purple-light)] text-[var(--purple)] font-[700] rounded-[9px]"
                  : "text-[var(--text-2)] font-[500] hover:bg-[#f4f4f8] rounded-[9px] hover:text-[var(--dark)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 bg-white border border-[var(--border)] rounded-[16px] p-[24px] md:p-[32px] overflow-hidden">
        
        {/* PROFILE SECTION */}
        {activeTab === "profile" && (
          <div className="animate-fade-up max-w-[500px]">
            <div className="flex flex-col items-start gap-[12px] mb-[32px]">
              <div className="w-[56px] h-[56px] rounded-full bg-gradient-to-tr from-[#7C5CFC] to-[#bca6ff] flex items-center justify-center text-white font-[700] text-[20px] shadow-sm">
                RA
              </div>
              <button className="text-[13px] font-[600] text-[var(--text-2)] hover:text-[var(--dark)] transition-colors px-[12px] py-[6px] rounded-[8px] hover:bg-[#f4f4f8] -ml-[12px]">
                Change Photo
              </button>
            </div>

            <div className="flex flex-col gap-[14px] mb-[32px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-[600] text-[var(--text-1)]">Display Name</label>
                <input 
                  type="text" 
                  defaultValue="Alex R." 
                  className="h-[40px] px-[14px] bg-white border border-[var(--border)] rounded-[10px] text-[14px] font-[500] text-[var(--text-1)] focus:outline-none focus:border-[var(--purple)] focus:ring-1 focus:ring-[var(--purple)] transition-shadow"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-[600] text-[var(--text-1)]">NSU Email</label>
                <div className="relative flex items-center">
                  <input 
                    type="email" 
                    defaultValue="alex.r@northsouth.edu" 
                    readOnly
                    className="w-full h-[40px] pl-[14px] pr-[36px] bg-[#fafafc] border border-[var(--border)] rounded-[10px] text-[14px] font-[500] text-[var(--text-2)] focus:outline-none cursor-not-allowed"
                  />
                  <Lock size={14} className="absolute right-[14px] text-[var(--text-3)]" />
                </div>
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-[600] text-[var(--text-1)]">Year of Study</label>
                <select className="h-[40px] px-[14px] bg-white border border-[var(--border)] rounded-[10px] text-[14px] font-[500] text-[var(--text-1)] focus:outline-none focus:border-[var(--purple)] focus:ring-1 focus:ring-[var(--purple)] transition-shadow appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239298a4%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-[position:right_10px_center] bg-no-repeat pr-[32px]">
                  <option>Freshman</option>
                  <option>Sophomore</option>
                  <option>Junior</option>
                  <option>Senior</option>
                </select>
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-[600] text-[var(--text-1)]">Department</label>
                <input 
                  type="text" 
                  defaultValue="Computer Science" 
                  className="h-[40px] px-[14px] bg-white border border-[var(--border)] rounded-[10px] text-[14px] font-[500] text-[var(--text-1)] focus:outline-none focus:border-[var(--purple)] focus:ring-1 focus:ring-[var(--purple)] transition-shadow"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-[16px]">
              <button 
                onClick={() => {
                  logout()
                  router.push("/")
                }}
                className="flex items-center gap-[6px] text-[var(--red)] text-[13px] font-[700] hover:bg-[#fee2e2] px-[12px] py-[8px] rounded-[8px] transition-colors"
              >
                <LogOut size={16} />
                Log Out
              </button>
              <button 
                onClick={handleSaveProfile}
                className="bg-[var(--dark)] text-white text-[13px] font-[700] px-[20px] h-[38px] rounded-[10px] hover:bg-[#2a2a3e] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* CHANGE PASSWORD SECTION */}
        {activeTab === "password" && (
          <div className="animate-fade-up max-w-[400px]">
            <div className="flex flex-col gap-[16px] mb-[32px]">
              
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-[600] text-[var(--text-1)]">Current Password</label>
                <div className="relative flex items-center">
                  <input 
                    type={showCurrentPassword ? "text" : "password"}
                    className="w-full h-[40px] pl-[14px] pr-[36px] bg-white border border-[var(--border)] rounded-[10px] text-[14px] font-[500] text-[var(--text-1)] focus:outline-none focus:border-[var(--purple)] focus:ring-1 focus:ring-[var(--purple)] transition-shadow"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-[12px] text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="w-full h-[1px] bg-[var(--border)] my-[4px]" />

              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-[600] text-[var(--text-1)]">New Password</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-[40px] px-[14px] bg-white border border-[var(--border)] rounded-[10px] text-[14px] font-[500] text-[var(--text-1)] focus:outline-none focus:border-[var(--purple)] focus:ring-1 focus:ring-[var(--purple)] transition-shadow"
                />
                
                {/* Strength Meter */}
                {newPassword && (
                  <div className="flex flex-col gap-[6px] mt-[4px]">
                    <div className="flex gap-[4px] h-[4px]">
                      <div className={cn("flex-1 rounded-full transition-colors duration-300", strength >= 1 ? "bg-[var(--red)]" : "bg-[var(--border)]")} />
                      <div className={cn("flex-1 rounded-full transition-colors duration-300", strength >= 2 ? "bg-[var(--amber)]" : "bg-[var(--border)]")} />
                      <div className={cn("flex-1 rounded-full transition-colors duration-300", strength >= 3 ? "bg-[var(--green)]" : "bg-[var(--border)]")} />
                    </div>
                    <span className={cn("text-[11px] font-[700]", getStrengthLabel().color)}>
                      {getStrengthLabel().text}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-[600] text-[var(--text-1)]">Confirm New Password</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    "w-full h-[40px] px-[14px] bg-white border rounded-[10px] text-[14px] font-[500] text-[var(--text-1)] focus:outline-none focus:ring-1 transition-shadow",
                    !passwordsMatch 
                      ? "border-[var(--red)] focus:border-[var(--red)] focus:ring-[var(--red)]" 
                      : "border-[var(--border)] focus:border-[var(--purple)] focus:ring-[var(--purple)]"
                  )}
                />
                {!passwordsMatch && (
                  <span className="text-[11px] font-[500] text-[var(--red)] mt-[2px]">
                    Passwords do not match
                  </span>
                )}
              </div>

            </div>

            <div className="flex justify-end">
              <button 
                disabled={!passwordsMatch || !newPassword}
                className="bg-[var(--dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-[700] px-[20px] h-[38px] rounded-[10px] hover:bg-[#2a2a3e] transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS SECTION */}
        {activeTab === "notifications" && (
          <div className="animate-fade-up max-w-[500px]">
            
            <div className="flex flex-col gap-[28px] mb-[32px]">
              {/* Applications Group */}
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[2px] text-[var(--text-3)] font-[700] mb-[12px]">
                  Applications
                </span>
                <div className="flex flex-col gap-[16px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-[500] text-[var(--text-1)]">Interview Scheduled updates</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-[500] text-[var(--text-1)]">Application Status changes</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-[var(--border)]" />

              {/* Events Group */}
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[2px] text-[var(--text-3)] font-[700] mb-[12px]">
                  Events
                </span>
                <div className="flex flex-col gap-[16px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-[500] text-[var(--text-1)]">Event Reminders (24h before)</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-[500] text-[var(--text-1)]">New Club Events</span>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-[var(--border)]" />

              {/* General Group */}
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[2px] text-[var(--text-3)] font-[700] mb-[12px]">
                  General
                </span>
                <div className="flex flex-col gap-[16px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-[500] text-[var(--text-1)]">New Announcements</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-[500] text-[var(--text-1)]">Recruitment Opens</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end">
              <button 
                className="bg-[var(--dark)] text-white text-[13px] font-[700] px-[20px] h-[38px] rounded-[10px] hover:bg-[#2a2a3e] transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

      </div>

      {/* SUCCESS TOAST */}
      <div 
        className={cn(
          "fixed bottom-[26px] right-[26px] bg-[var(--dark)] text-white px-[20px] py-[16px] rounded-[14px] shadow-[0_20px_40px_rgba(0,0,0,0.12)] z-50 flex flex-col gap-[12px] min-w-[240px] transition-all duration-300 ease-out",
          showToast ? "translate-y-0 opacity-100" : "translate-y-[20px] opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-[600]">Profile updated ✓</span>
        </div>
        <div className="w-full h-[4px] bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
          {showToast && (
            <div className="h-full bg-[var(--purple)] rounded-full animate-progress" />
          )}
        </div>
      </div>

    </div>
  )
}
