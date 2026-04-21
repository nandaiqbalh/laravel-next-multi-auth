"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react"

// ─── Icon map ────────────────────────────────────────────────────────────────

const TOAST_ICONS: ToasterProps["icons"] = {
  success: <CircleCheckIcon className="size-4" />,
  info:    <InfoIcon className="size-4" />,
  warning: <TriangleAlertIcon className="size-4" />,
  error:   <OctagonXIcon className="size-4" />,
  loading: <Loader2Icon className="size-4 animate-spin" />,
  close:   <XIcon className="size-3" />,
}

// ─── CSS variable overrides ───────────────────────────────────────────────────

const TOAST_STYLES: React.CSSProperties = {
  // Base
  "--normal-bg":     "var(--background)",
  "--normal-text":   "var(--foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "var(--radius)",

  // Success
  "--success-bg":     "color-mix(in srgb, var(--primary) 8%, var(--background))",
  "--success-text":   "var(--primary)",
  "--success-border": "color-mix(in srgb, var(--primary) 30%, transparent)",

  // Info
  "--info-bg":     "color-mix(in srgb, var(--secondary) 15%, var(--background))",
  "--info-text":   "var(--secondary-foreground)",
  "--info-border": "color-mix(in srgb, var(--secondary-foreground) 25%, transparent)",

  // Warning
  "--warning-bg":     "color-mix(in srgb, var(--accent) 15%, var(--background))",
  "--warning-text":   "var(--accent-foreground)",
  "--warning-border": "color-mix(in srgb, var(--accent-foreground) 25%, transparent)",

  // Error
  "--error-bg":     "color-mix(in srgb, var(--destructive) 8%, var(--background))",
  "--error-text":   "var(--destructive)",
  "--error-border": "color-mix(in srgb, var(--destructive) 30%, transparent)",
} as React.CSSProperties

// ─── Component ───────────────────────────────────────────────────────────────

export function Toaster(props: ToasterProps) {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={TOAST_ICONS}
      style={TOAST_STYLES}
      closeButton
      toastOptions={{
        duration: 5000,
        classNames: {
          toast:
            "group/toast relative flex items-start gap-3 rounded-[var(--radius)] border border-l-[3px] bg-[var(--normal-bg)] px-4 py-3.5 shadow-sm backdrop-blur-sm transition-all",
          title:
            "text-sm font-medium leading-snug tracking-tight",
          description:
            "text-xs text-muted-foreground leading-relaxed mt-0.5",
          icon:
            "mt-0.5 shrink-0",
          closeButton:
            "absolute right-2 top-2 rounded-md p-1 opacity-0 ring-offset-background transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 group-hover/toast:opacity-60 hover:!opacity-100",
          actionButton:
            "mt-2 text-xs font-medium underline-offset-2 hover:underline",
          cancelButton:
            "mt-2 text-xs text-muted-foreground underline-offset-2 hover:underline",
          loader:
            "text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}