import Link from "next/link";
import { ShieldOff } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#101828] px-6 py-12 text-white">
      <div className="absolute left-0 top-0 z-30 h-[3px] w-full bg-[#EF4444]" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="pointer-events-none absolute -right-24 top-[-100px] h-[300px] w-[300px] rounded-full bg-[rgba(239,68,68,0.10)] blur-[120px]" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <Link
          href="/"
          className="animate-fade-up mb-14 inline-flex items-center gap-3"
          style={{ animationDelay: "0s" }}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-teal font-syne text-[18px] font-extrabold text-white">
            N
          </span>
          <span className="flex flex-col items-start text-left leading-none">
            <span className="font-syne text-[14px] font-bold tracking-[-0.02em] text-white">
              ClubHub
            </span>
            <span className="mt-1 text-[10px] font-medium text-[rgba(255,255,255,0.42)]">
              NSU Portal
            </span>
          </span>
        </Link>

        <div className="animate-fade-up" style={{ animationDelay: "0.08s" }}>
          <h1
            className="mb-6 bg-[linear-gradient(135deg,#EF4444_0%,#F87171_50%,rgba(239,68,68,0.4)_100%)] bg-clip-text font-syne text-[clamp(96px,18vw,160px)] font-extrabold leading-none tracking-[-0.04em] text-transparent"
            aria-label="403"
          >
            403
          </h1>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.16s" }}>
          <div className="mx-auto my-6 h-px w-[240px] bg-[rgba(239,68,68,0.25)]" />
          <h2 className="font-syne text-[24px] font-bold tracking-[-0.5px] text-white">
            Access denied.
          </h2>
          <p className="mx-auto mt-3 max-w-[360px] text-[14px] font-medium leading-6 text-[rgba(255,255,255,0.5)]">
            You don&apos;t have permission to view this page. This area is
            restricted to a different user role.
          </p>
        </div>

        <div
          className="animate-fade-up mt-8 w-full max-w-[360px] rounded-xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.06)] p-5"
          style={{ animationDelay: "0.22s" }}
        >
          <ShieldOff
            className="mx-auto mb-3 h-5 w-5 text-[#EF4444]"
            aria-hidden="true"
          />
          <p className="mx-auto max-w-[300px] text-[12px] font-medium leading-5 text-[rgba(255,255,255,0.5)]">
            If you believe this is a mistake, contact your NSU ClubHub
            administrator at admin@northsouth.edu
          </p>
        </div>

        <div
          className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.28s" }}
        >
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-md bg-teal px-6 font-syne text-[13px] font-bold text-white transition-colors duration-200 hover:bg-teal-dark"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md border border-[rgba(255,255,255,0.15)] px-6 font-syne text-[13px] font-bold text-white transition-colors duration-200 hover:bg-white/5"
          >
            Sign in with another account
          </Link>
        </div>
      </div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[10px] font-medium text-[rgba(255,255,255,0.2)]">
        © 2026 North South University · CSE299 Group 6
      </p>
    </main>
  );
}
