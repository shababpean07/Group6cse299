"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock, LogIn, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (user.role === "SUPER_ADMIN") {
        router.push("/super/dashboard");
      } else if (user.role === "CLUB_ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (role: string) => {
    setIsLoading(true);
    setError("");
    try {
      let userEmail = "";
      let userPassword = "";
      
      if (role === "superadmin") {
        userEmail = "admin@northsouth.edu";
        userPassword = "admin123";
      } else if (role === "clubadmin") {
        userEmail = "arif@northsouth.edu";
        userPassword = "clubadmin123";
      } else {
        userEmail = "student@northsouth.edu";
        userPassword = "student123";
      }
      
      setEmail(userEmail);
      setPassword(userPassword);
      
      await login(userEmail, userPassword);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (user.role === "SUPER_ADMIN") {
        router.push("/super/dashboard");
      } else if (user.role === "CLUB_ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Quick login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1828] via-[#0a141f] to-[#0f1828] px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0D7377] to-[#14FFEC] mb-4 shadow-lg shadow-[#0D7377]/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-syne text-3xl font-bold text-white mb-2">NSU ClubHub</h1>
          <p className="text-[#8896b0] text-sm">Welcome back! Sign in to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-[#0f1828] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8896b0]">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@northsouth.edu"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl border-[1.5px] border-[#e8ecf2] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_4px_rgba(13,115,119,0.12)] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-[#0f1828] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8896b0]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-12 pl-12 pr-12 rounded-xl border-[1.5px] border-[#e8ecf2] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_4px_rgba(13,115,119,0.12)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8896b0] hover:text-[#0f1828] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#e8ecf2] text-[#0D7377] focus:ring-[#0D7377]"
                />
                <span className="text-sm text-[#64748b]">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-[#0D7377] hover:text-[#0a5c60] font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[#0D7377] to-[#0a5c60] text-white font-syne font-bold rounded-xl hover:shadow-lg hover:shadow-[#0D7377]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e8ecf2]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#8896b0]">or quick login</span>
            </div>
          </div>

          {/* Quick Login Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => quickLogin("superadmin")}
              disabled={isLoading}
              className="py-2.5 px-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all flex flex-col items-center gap-1"
            >
              <span className="text-lg">👑</span>
              Super Admin
            </button>
            <button
              onClick={() => quickLogin("clubadmin")}
              disabled={isLoading}
              className="py-2.5 px-3 bg-gradient-to-r from-[#0D7377] to-[#14FFEC] text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-[#0D7377]/30 transition-all flex flex-col items-center gap-1"
            >
              <span className="text-lg">🏢</span>
              Club Admin
            </button>
            <button
              onClick={() => quickLogin("student")}
              disabled={isLoading}
              className="py-2.5 px-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex flex-col items-center gap-1"
            >
              <span className="text-lg">🎓</span>
              Student
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-[#64748b] text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#0D7377] font-semibold hover:text-[#0a5c60] transition-colors inline-flex items-center gap-1">
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </div>

        {/* Guest Link */}
        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-[#64748b] text-sm hover:text-white transition-colors inline-flex items-center gap-2">
            Continue as Guest
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}