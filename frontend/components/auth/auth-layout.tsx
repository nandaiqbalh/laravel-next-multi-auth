"use client";

import type { ReactNode } from "react";

interface AuthFeature {
  text: string;
}

interface AuthLayoutProps {
  /** Badge label shown at the top of the left panel */
  badge: string;
  /** Main heading in the left panel */
  heading: string;
  /** Supporting description in the left panel */
  description: string;
  /** Bullet point features shown in the left panel */
  features: AuthFeature[];
  /** The form card rendered on the right */
  children: ReactNode;
}

/**
 * Shared two-column layout for auth pages (login / register).
 *
 * - Left: decorative info panel (hidden on mobile, shown lg+)
 * - Right: form card
 *
 * Usage:
 * ```tsx
 * <AuthLayout badge="Portal Digital" heading="Masuk ke Portal" ...>
 *   <LoginForm />
 * </AuthLayout>
 * ```
 */
export function AuthLayout({ badge, heading, description, features, children }: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 md:px-8">
      {/* Ambient background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-400/15 blur-[80px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-[80px]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl items-stretch gap-0 overflow-hidden rounded-2xl shadow-xl shadow-sky-900/10 lg:shadow-2xl lg:shadow-sky-900/15">
        {/* ── Left panel (desktop only) ─────────────────────────────── */}
        <aside className="hidden w-[46%] shrink-0 flex-col justify-between bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-700 p-10 text-white lg:flex">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
              {badge}
            </span>
            <h1 className="mt-6 text-[1.75rem] font-bold leading-snug tracking-tight">{heading}</h1>
            <p className="mt-3 text-sm leading-relaxed text-sky-200">{description}</p>

            <ul className="mt-8 space-y-3">
              {features.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm text-sky-100">
                  <CheckIcon className="mt-0.5 shrink-0 text-cyan-300" />
                  {f.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom decorative mark */}
          <div aria-hidden className="mt-10 flex items-center gap-2 opacity-30">
            <span className="h-px w-8 bg-white" />
            <span className="h-px flex-1 bg-white/40" />
          </div>
        </aside>

        {/* ── Right panel (form) ────────────────────────────────────── */}
        <div className="flex w-full flex-col bg-white lg:w-[54%]">
          {children}
        </div>
      </div>
    </main>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={`h-4 w-4 ${className ?? ""}`}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
        clipRule="evenodd"
      />
    </svg>
  );
}