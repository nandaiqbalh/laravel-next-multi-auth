// components/common/ErrorBanner.tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ErrorBannerProps {
  message: ReactNode;
  className?: string;
}

export function ErrorBanner({ message, className }: ErrorBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="mt-px h-4 w-4 shrink-0"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </div>
  );
}