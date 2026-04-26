"use client";

import Link from "next/link";
import {
  Bell,
  Calendar,
  CheckCircle2,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export type ToastVariant =
  | "approved"
  | "rejected"
  | "new-submission"
  | "application-update"
  | "new-event";

type ToastInput = {
  variant: ToastVariant;
  title: string;
  body: string;
  linkLabel?: string;
  linkHref?: string;
};

type ToastRecord = ToastInput & {
  id: string;
};

type ToastVisual = {
  accent: string;
  iconClass: string;
  iconWrapClass: string;
  progressClass: string;
  linkClass: string;
};

const TOAST_DURATION_MS = 5000;
const EXIT_DURATION_MS = 250;

const toastStore = {
  toasts: [] as ToastRecord[],
  listeners: new Set<() => void>(),
};

function emitChange() {
  toastStore.listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  toastStore.listeners.add(listener);
  return () => {
    toastStore.listeners.delete(listener);
  };
}

function getToasts() {
  return toastStore.toasts;
}

function pushToast(input: ToastInput) {
  const newToast: ToastRecord = {
    ...input,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  };

  toastStore.toasts = [newToast, ...toastStore.toasts].slice(0, 3);
  emitChange();
}

function removeToast(id: string) {
  toastStore.toasts = toastStore.toasts.filter((toast) => toast.id !== id);
  emitChange();
}

function useToastStore() {
  const [toasts, setToasts] = useState<ToastRecord[]>(() => getToasts());

  useEffect(() => {
    return subscribe(() => {
      setToasts(getToasts());
    });
  }, []);

  return toasts;
}

function getToastVisual(variant: ToastVariant): ToastVisual {
  const byVariant: Record<ToastVariant, ToastVisual> = {
    approved: {
      accent: "#22c55e",
      iconClass: "text-[#22c55e]",
      iconWrapClass: "bg-[#dcfce7]",
      progressClass: "bg-[#22c55e]",
      linkClass: "text-teal hover:text-teal-dark",
    },
    rejected: {
      accent: "#EF4444",
      iconClass: "text-[#EF4444]",
      iconWrapClass: "bg-[#fee2e2]",
      progressClass: "bg-[#EF4444]",
      linkClass: "text-[#EF4444] hover:text-[#dc2626]",
    },
    "new-submission": {
      accent: "#F59E0B",
      iconClass: "text-[#F59E0B]",
      iconWrapClass: "bg-[#FEF3C7]",
      progressClass: "bg-[#F59E0B]",
      linkClass: "text-teal hover:text-teal-dark",
    },
    "application-update": {
      accent: "#0D7377",
      iconClass: "text-teal",
      iconWrapClass: "bg-teal-light",
      progressClass: "bg-teal",
      linkClass: "text-teal hover:text-teal-dark",
    },
    "new-event": {
      accent: "#0D7377",
      iconClass: "text-teal",
      iconWrapClass: "bg-teal-light",
      progressClass: "bg-teal",
      linkClass: "text-teal hover:text-teal-dark",
    },
  };

  return byVariant[variant];
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const iconClass = "h-5 w-5";

  if (variant === "approved") return <CheckCircle2 className={iconClass} />;
  if (variant === "rejected") return <XCircle className={iconClass} />;
  if (variant === "new-submission") return <Bell className={iconClass} />;
  if (variant === "application-update") return <UserCheck className={iconClass} />;
  return <Calendar className={iconClass} />;
}

function ToastItem({ toast }: { toast: ToastRecord }) {
  const [exiting, setExiting] = useState(false);
  const visual = getToastVisual(toast.variant);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setExiting(true);
    }, TOAST_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!exiting) return;

    const timer = window.setTimeout(() => {
      removeToast(toast.id);
    }, EXIT_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [exiting, toast.id]);

  return (
    <article
      className={`relative w-[360px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-xl border-[1.5px] border-border bg-surface p-4 pr-10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] ${
        exiting ? "animate-toast-out" : "animate-toast-in"
      }`}
      role="status"
      aria-live="polite"
    >
      <span
        className="absolute inset-y-0 left-0 w-1 rounded-r"
        style={{ backgroundColor: visual.accent }}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => setExiting(true)}
        className="absolute right-3 top-3 rounded text-text-muted transition-colors duration-150 hover:text-text-primary"
        aria-label="Dismiss notification"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${visual.iconWrapClass} ${visual.iconClass}`}
          aria-hidden="true"
        >
          <ToastIcon variant={toast.variant} />
        </span>

        <div className="min-w-0">
          <h3 className="font-syne text-[13px] font-bold text-text-primary">
            {toast.title}
          </h3>
          <p className="mt-1 text-[12px] font-medium leading-[1.45] text-text-secondary">
            {toast.body}
          </p>

          {toast.linkLabel && toast.linkHref ? (
            <Link
              href={toast.linkHref}
              className={`mt-2 inline-flex text-[12px] font-semibold transition-colors duration-150 ${visual.linkClass}`}
            >
              {toast.linkLabel}
            </Link>
          ) : null}
        </div>
      </div>

      {!exiting ? (
        <span
          className={`absolute bottom-0 left-0 h-1 origin-left animate-toast-progress ${visual.progressClass}`}
          style={{ animationDuration: `${TOAST_DURATION_MS}ms` }}
          aria-hidden="true"
        />
      ) : null}
    </article>
  );
}

export function useToast() {
  return {
    showToast: (payload: ToastInput) => pushToast(payload),
  };
}

export function ToastContainer() {
  const [mounted, setMounted] = useState(false);
  const toasts = useToastStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleToasts = useMemo(() => toasts, [toasts]);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed right-5 top-5 z-[9999] flex w-[360px] max-w-[calc(100vw-2.5rem)] flex-col gap-2">
      {visibleToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>,
    document.body
  );
}
