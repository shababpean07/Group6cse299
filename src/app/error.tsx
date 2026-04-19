"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#101828] px-6 py-12 text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="pointer-events-none absolute -right-24 top-[-120px] h-[360px] w-[360px] rounded-full bg-[rgba(245,158,11,0.12)] blur-[130px]" />

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
            className="mb-6 bg-[linear-gradient(135deg,#F59E0B_0%,#FCD34D_50%,rgba(245,158,11,0.4)_100%)] bg-clip-text font-syne text-[clamp(96px,18vw,160px)] font-extrabold leading-none tracking-[-0.04em] text-transparent"
            aria-label="500"
          >
            500
          </h1>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.16s" }}>
          <div className="mx-auto my-6 h-px w-[240px] bg-[rgba(245,158,11,0.25)]" />
          <h2 className="font-syne text-[24px] font-bold tracking-[-0.5px] text-white">
            Something went wrong.
          </h2>
          <p className="mx-auto mt-3 max-w-[360px] text-[14px] font-medium leading-6 text-[rgba(255,255,255,0.5)]">
            The NSU ClubHub server encountered an unexpected error. This has
            been logged automatically. Please try again in a moment.
          </p>
        </div>

        <div
          className="animate-fade-up-scale mt-8 w-full max-w-[360px] rounded-xl border border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.06)] p-5"
          style={{ animationDelay: "0.24s" }}
        >
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex w-full items-center justify-between gap-3 py-1.5 text-left text-teal-light transition-colors duration-200 hover:text-white"
          >
            <span className="flex items-center gap-2.5 text-[14px] font-medium">
              <span aria-hidden="true">🔄</span>
              Retry this page
            </span>
            <span aria-hidden="true" className="text-[18px] leading-none text-[rgba(255,255,255,0.45)]">
              ›
            </span>
          </button>

          <div className="my-2 h-px w-full bg-[rgba(245,158,11,0.2)]" />

          <Link
            href="/dashboard"
            className="flex w-full items-center justify-between gap-3 py-1.5 text-teal-light transition-colors duration-200 hover:text-white"
          >
            <span className="flex items-center gap-2.5 text-[14px] font-medium">
              <span aria-hidden="true">🏠</span>
              Return to Dashboard
            </span>
            <span aria-hidden="true" className="text-[18px] leading-none text-[rgba(255,255,255,0.45)]">
              ›
            </span>
          </Link>

          <div className="my-2 h-px w-full bg-[rgba(245,158,11,0.2)]" />

          <a
            href="mailto:support@northsouth.edu"
            className="flex w-full items-center justify-between gap-3 py-1.5 text-[rgba(255,255,255,0.6)] transition-colors duration-200 hover:text-white"
          >
            <span className="flex items-center gap-2.5 text-[14px] font-medium">
              <span aria-hidden="true">📧</span>
              Report the issue
            </span>
            <span aria-hidden="true" className="text-[18px] leading-none text-[rgba(255,255,255,0.45)]">
              ›
            </span>
          </a>
        </div>
      </div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[10px] font-medium text-[rgba(255,255,255,0.2)]">
        © 2026 North South University · CSE299 Group 6
      </p>
    </main>
  );
}
