// components/common/SuccessBanner.tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SuccessBannerProps {
  message: ReactNode;
  className?: string;
}

export function SuccessBanner({ message, className }: SuccessBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700",
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="mt-px h-4 w-4 shrink-0"
        aria-hidden
      >
        <path d="M13.78 3.72a.75.75 0 0 0-1.06-1.06L6.5 8.94 3.28 5.72a.75.75 0 1 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l6-6Z" />
      </svg>
      {message}
    </div>
  );
}
