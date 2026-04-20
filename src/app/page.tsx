"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertTriangle, Calendar, Users, Target } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LandingLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(false);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple demo logic to show error state if email is "error"
    if (email.includes("error")) {
      setError(true);
      setIsLoading(false);
      return;
    }

    // On successful login, route by role
    // For demo purposes, default to student
    router.push("/dashboard");
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <main className="min-h-screen w-full bg-[#101828] relative overflow-hidden font-sans text-white selection:bg-[#0D7377] selection:text-white">
      {/* BACKGROUND ATMOSPHERE */}
      {/* Glow 1 */}
      <div 
        className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "rgba(13,115,119,0.22)", filter: "blur(80px)" }}
      />
      {/* Glow 2 */}
      <div 
        className="absolute bottom-[-100px] left-[20%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "rgba(13,115,119,0.13)", filter: "blur(80px)" }}
      />
      {/* Glow 3 */}
      <div 
        className="absolute top-[30%] right-[-50px] w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: "rgba(20,160,165,0.10)", filter: "blur(80px)" }}
      />
      
      {/* Dot grid overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ 
          backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)", 
          backgroundSize: "24px 24px" 
        }}
      />

      {/* Vertical divider line (hidden on mobile) */}
      <div 
        className="absolute hidden min-[900px]:block z-0 pointer-events-none"
        style={{
          left: "58%",
          top: 0,
          bottom: 0,
          width: "1px",
          background: "linear-gradient(to bottom, transparent, rgba(13,115,119,0.25), rgba(13,115,119,0.25), transparent)"
        }}
      />

      {/* NAVBAR */}
      <nav className="relative z-10 h-[66px] border-b border-[rgba(255,255,255,0.06)] px-6 min-[900px]:px-14 flex items-center justify-between animate-fade-down opacity-0" style={{ animationFillMode: "both" }}>
        {/* Left: Logo block */}
        <div className="flex items-center gap-3">
          <div className="w-[36px] h-[36px] rounded-[9px] bg-[#0D7377] flex items-center justify-center">
            <span className="font-syne font-[800] text-white text-xl">N</span>
          </div>
          <div className="flex flex-col">
            <span className="font-syne font-[700] text-white text-[14px] leading-tight">ClubHub</span>
            <span className="text-[10px] text-[rgba(255,255,255,0.35)] leading-tight">NSU Portal</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-[12.5px] text-[rgba(255,255,255,0.35)]">
            New student?
          </span>
          <Link 
            href="/auth/register" 
            className="h-9 px-4 rounded-[6px] border border-[#0D7377] text-[#0D7377] font-syne font-[700] text-[13px] bg-[rgba(13,115,119,0.12)] hover:bg-[rgba(13,115,119,0.25)] transition-colors flex items-center justify-center"
          >
            Create Account
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-7 min-[900px]:px-[56px] pt-[56px] pb-[72px] grid grid-cols-1 min-[900px]:grid-cols-[1fr_420px] gap-12 min-[900px]:gap-8 items-center min-h-[calc(100vh-66px)]">
        
        {/* LEFT COLUMN - Hero Copy */}
        <div className="flex flex-col pr-0 min-[900px]:pr-12">
          
          {/* Eyebrow Pill */}
          <div 
            className="w-fit mb-6 px-3 py-1.5 rounded-full flex items-center gap-2 border animate-fade-up opacity-0"
            style={{ 
              background: "rgba(13,115,119,0.2)", 
              borderColor: "rgba(13,115,119,0.45)",
              animationDelay: "0.1s",
              animationFillMode: "both" 
            }}
          >
            <div className="relative flex h-1.5 w-1.5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ecdc4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#4ecdc4]"></span>
            </div>
            <span className="font-syne font-[700] text-[10.5px] text-[#4ecdc4] tracking-[0.1em] uppercase">
              North South University
            </span>
          </div>

          {/* Hero Heading */}
          <h1 
            className="font-syne font-[800] text-[clamp(32px,5vw,52px)] text-white leading-[1.1] mb-5 animate-fade-up opacity-0"
            style={{ animationDelay: "0.18s", animationFillMode: "both" }}
          >
            Every club.<br />
            Every event.<br />
            <span className="text-[#4ecdc4]">One login.</span>
          </h1>

          {/* Hero Subtext */}
          <p 
            className="font-sans text-[15.5px] font-[400] text-[rgba(255,255,255,0.45)] max-w-[440px] leading-[1.7] mb-10 animate-fade-up opacity-0"
            style={{ animationDelay: "0.26s", animationFillMode: "both" }}
          >
            NSU ClubHub replaces scattered WhatsApp groups and missed deadlines
            with a single portal — built for students, club executives, and the administration.
          </p>

          {/* Feature Rows */}
          <div 
            className="flex flex-col gap-[14px] mb-12 animate-fade-up opacity-0"
            style={{ animationDelay: "0.34s", animationFillMode: "both" }}
          >
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-[36px] h-[36px] rounded-[9px] border border-[rgba(13,115,119,0.3)] bg-[rgba(13,115,119,0.18)] flex items-center justify-center text-[#4ecdc4]">
                <Users size={16} />
              </div>
              <div className="flex flex-col pt-0.5">
                <span className="font-syne font-[700] text-[13px] text-[rgba(255,255,255,0.85)] mb-0.5">Club Directory</span>
                <span className="text-[12px] text-[rgba(255,255,255,0.35)]">Browse all NSU clubs, their mandates, and active exec boards</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-[36px] h-[36px] rounded-[9px] border border-[rgba(13,115,119,0.3)] bg-[rgba(13,115,119,0.18)] flex items-center justify-center text-[#4ecdc4]">
                <Calendar size={16} />
              </div>
              <div className="flex flex-col pt-0.5">
                <span className="font-syne font-[700] text-[13px] text-[rgba(255,255,255,0.85)] mb-0.5">Master Event Calendar</span>
                <span className="text-[12px] text-[rgba(255,255,255,0.35)]">Every seminar, show, and workshop — conflict-free and filterable</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-[36px] h-[36px] rounded-[9px] border border-[rgba(13,115,119,0.3)] bg-[rgba(13,115,119,0.18)] flex items-center justify-center text-[#4ecdc4]">
                <Target size={16} />
              </div>
              <div className="flex flex-col pt-0.5">
                <span className="font-syne font-[700] text-[13px] text-[rgba(255,255,255,0.85)] mb-0.5">Recruitment Portal</span>
                <span className="text-[12px] text-[rgba(255,255,255,0.35)]">Apply, track status, and get notified — all in one place</span>
              </div>
            </div>
          </div>

          {/* Stat Strip */}
          <div 
            className="pt-8 mt-12 border-t border-[rgba(255,255,255,0.07)] flex items-center gap-[20px] min-[900px]:gap-[32px] animate-fade-up opacity-0"
            style={{ animationDelay: "0.42s", animationFillMode: "both" }}
          >
            <div className="flex flex-col">
              <span className="font-syne font-[800] text-[22px] text-[#4ecdc4]">40+</span>
              <span className="text-[11px] text-[rgba(255,255,255,0.3)] tracking-[0.04em] uppercase mt-0.5">Active Clubs</span>
            </div>
            <div className="flex flex-col">
              <span className="font-syne font-[800] text-[22px] text-[#4ecdc4]">1,200+</span>
              <span className="text-[11px] text-[rgba(255,255,255,0.3)] tracking-[0.04em] uppercase mt-0.5">Students</span>
            </div>
            <div className="flex flex-col">
              <span className="font-syne font-[800] text-[22px] text-[#4ecdc4]">0</span>
              <span className="text-[11px] text-[rgba(255,255,255,0.3)] tracking-[0.04em] uppercase mt-0.5">Missed Deadlines</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - Login Card */}
        <div className="relative animate-fade-up opacity-0" style={{ animationDelay: "0.22s", animationDuration: "0.6s", animationFillMode: "both" }}>
          
          {/* Floating Tag */}
          <div className="absolute top-[-13px] left-1/2 -translate-x-1/2 bg-[#0D7377] rounded-full px-[14px] py-[4px] z-10 shadow-md">
            <span className="font-syne font-[700] text-[10px] text-white uppercase tracking-[0.1em]">
              Sign In
            </span>
          </div>

          {/* White Card */}
          <div 
            className="bg-white rounded-[20px] pt-[38px] px-[34px] pb-[32px] w-full max-w-[420px] mx-auto relative z-0"
            style={{
              boxShadow: "0 0 0 1px rgba(13,115,119,0.12), 0 24px 64px rgba(0,0,0,0.45), 0 0 80px rgba(13,115,119,0.08)"
            }}
          >
            {/* Card Header */}
            <div className="mb-6">
              <h2 className="font-syne font-[800] text-[20px] text-[#0f1828] mb-1">Welcome</h2>
              <p className="font-sans text-[13px] text-[#8896b0]">Sign in to continue to ClubHub</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 bg-[#fef2f2] border border-[#fecaca] rounded-[8px] p-[10px] px-[13px] flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertTriangle className="w-[14px] h-[14px] text-[#dc2626] shrink-0 mt-[1px]" />
                <span className="font-sans text-[12px] text-[#dc2626] leading-snug">
                  Invalid email or password. Please try again.
                </span>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-[600] text-[11.5px] text-[#0f1828]">
                  NSU Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@northsouth.edu"
                  className={cn(
                    "w-full h-[43px] rounded-[8px] border-[1.5px] px-3 font-sans text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none transition-all",
                    error 
                      ? "border-[#dc2626] focus:border-[#dc2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]" 
                      : "border-[#e8ecf2] focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)]"
                  )}
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-sans font-[600] text-[11.5px] text-[#0f1828]">
                    Password
                  </label>
                  <span className="font-sans font-[600] text-[11.5px] text-[#8896b0] cursor-not-allowed">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full h-[43px] rounded-[8px] border-[1.5px] px-3 pr-10 font-sans text-[13px] text-[#0f1828] placeholder:text-[#aab4c8] outline-none transition-all",
                      error 
                        ? "border-[#dc2626] focus:border-[#dc2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]" 
                        : "border-[#e8ecf2] focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)]"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aab4c8] hover:text-[#0D7377] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={cn(
                  "mt-2 w-full h-[45px] bg-[#0D7377] rounded-[8px] flex items-center justify-center gap-2 text-white font-syne font-[700] text-[13.5px] transition-all",
                  (!isFormValid || isLoading) 
                    ? "opacity-55 cursor-not-allowed" 
                    : "hover:bg-[#0a5c60] hover:scale-[1.02] shadow-sm active:scale-[0.98]"
                )}
              >
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                    <span>Signing in…</span>
                  </>
                ) : (
                  <span>Sign In &rarr;</span>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <span className="font-sans text-[12.5px] text-[#8896b0]">
                New to NSU ClubHub?{" "}
                <Link href="/auth/register" className="text-[#0a5c60] font-[600] hover:underline">
                  Create an account
                </Link>
              </span>
            </div>

            {/* Demo Role Selector */}
            <div className="mt-6">
              {/* Divider with centered label */}
              <div className="relative flex items-center justify-center mb-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: "#e8ecf2" }} />
                </div>
                <span
                  className="relative bg-white px-[10px] font-sans font-[700] uppercase"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    color: "#aab4c8",
                  }}
                >
                  Demo Access
                </span>
              </div>

              {/* Helper text */}
              <p
                className="text-center font-sans mb-3"
                style={{ fontSize: "11.5px", color: "#aab4c8" }}
              >
                Skip login — choose a role to preview
              </p>

              {/* Role buttons grid */}
              <div className="grid grid-cols-3 gap-2">
                {/* Student */}
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="flex flex-col items-center gap-1.5 rounded-[8px] border-[1.5px] border-[#e8ecf2] bg-[#f5f6fa] py-[10px] px-[8px] cursor-pointer transition-all duration-150 ease-in-out hover:border-[#0D7377] hover:bg-[rgba(13,115,119,0.06)] group"
                >
                  <span style={{ fontSize: "20px", lineHeight: 1 }}>🎓</span>
                  <span className="font-syne font-[700] uppercase tracking-[0.08em] text-[#0f1828] group-hover:text-[#0D7377] transition-colors duration-150" style={{ fontSize: "10px" }}>
                    Student
                  </span>
                </button>

                {/* Club Admin */}
                <button
                  type="button"
                  onClick={() => router.push("/admin/dashboard")}
                  className="flex flex-col items-center gap-1.5 rounded-[8px] border-[1.5px] border-[#e8ecf2] bg-[#f5f6fa] py-[10px] px-[8px] cursor-pointer transition-all duration-150 ease-in-out hover:border-[#0D7377] hover:bg-[rgba(13,115,119,0.06)] group"
                >
                  <span style={{ fontSize: "20px", lineHeight: 1 }}>🏛️</span>
                  <span className="font-syne font-[700] uppercase tracking-[0.08em] text-[#0f1828] group-hover:text-[#0D7377] transition-colors duration-150" style={{ fontSize: "10px" }}>
                    Club Admin
                  </span>
                </button>

                {/* Super Admin */}
                <button
                  type="button"
                  onClick={() => router.push("/super/dashboard")}
                  className="flex flex-col items-center gap-1.5 rounded-[8px] border-[1.5px] border-[#e8ecf2] bg-[#f5f6fa] py-[10px] px-[8px] cursor-pointer transition-all duration-150 ease-in-out hover:border-[#0D7377] hover:bg-[rgba(13,115,119,0.06)] group"
                >
                  <span style={{ fontSize: "20px", lineHeight: 1 }}>⚡</span>
                  <span className="font-syne font-[700] uppercase tracking-[0.08em] text-[#0f1828] group-hover:text-[#0D7377] transition-colors duration-150" style={{ fontSize: "10px" }}>
                    Super Admin
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* FOOTER STRIP */}
      <footer className="absolute bottom-0 w-full h-[48px] border-t border-[rgba(255,255,255,0.05)] flex items-center justify-center z-10">
        <span className="font-sans text-[11px] text-[rgba(255,255,255,0.3)] tracking-[0.02em]">
          © {new Date().getFullYear()} North South University. All rights reserved.
        </span>
      </footer>

    </main>
  );
}