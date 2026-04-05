"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1828] via-[#0a141f] to-[#0f1828] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-syne text-3xl font-bold text-white mb-2">NSU ClubHub</h1>
          <p className="text-[#8896b0] text-sm">Sign in to manage your club</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-[#fee2e2] text-[#EF4444] text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#0f1828] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@northsouth.edu"
                required
                className="w-full h-11 px-4 rounded-lg border-[1.5px] border-[#e8ecf2] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_4px_rgba(13,115,119,0.12)] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1828] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-11 px-4 pr-12 rounded-lg border-[1.5px] border-[#e8ecf2] text-[#0f1828] placeholder:text-[#aab4c8] outline-none focus:border-[#0D7377] focus:shadow-[0_0_0_4px_rgba(13,115,119,0.12)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8896b0] hover:text-[#0f1828]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#0D7377] text-white font-syne font-bold rounded-lg hover:bg-[#0a5c60] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#8896b0] text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#0D7377] font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-[#8896b0] text-sm hover:text-white transition-colors">
            Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}
