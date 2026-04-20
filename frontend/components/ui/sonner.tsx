"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

/**
 * Toast icon mapping
 */
const TOAST_ICONS: ToasterProps["icons"] = {
  success: <CircleCheckIcon className="size-4" />,
  info: <InfoIcon className="size-4" />,
  warning: <TriangleAlertIcon className="size-4" />,
  error: <OctagonXIcon className="size-4" />,
  loading: <Loader2Icon className="size-4 animate-spin" />,
}

/**
 * Toast styles using accent background + solid border
 */
const TOAST_STYLES: React.CSSProperties = {
  "--normal-bg": "var(--surface)",
  "--normal-text": "var(--foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "var(--radius)",

  /* SUCCESS */
  "--success-bg": "color-mix(in srgb, var(--primary) 12%, white)",
  "--success-text": "var(--primary-dark)",
  "--success-border": "var(--primary)",

  /* INFO */
  "--info-bg": "color-mix(in srgb, var(--secondary) 20%, white)",
  "--info-text": "var(--secondary-foreground)",
  "--info-border": "var(--secondary-foreground)",

  /* WARNING */
  "--warning-bg": "color-mix(in srgb, var(--accent) 20%, white)",
  "--warning-text": "var(--accent-foreground)",
  "--warning-border": "var(--accent-foreground)",

  /* ERROR */
  "--error-bg": "color-mix(in srgb, var(--destructive) 15%, white)",
  "--error-text": "var(--destructive)",
  "--error-border": "var(--destructive)",
}

/**
 * Global Toaster Component
 *
 * Uses soft background + solid border style
 */
export function Toaster(props: ToasterProps) {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={TOAST_ICONS}
      style={TOAST_STYLES}
      toastOptions={{
        duration: 5000,
        classNames: {
          toast:
            "cn-toast border-l-4 shadow-sm", 
        },
      }}
      {...props}
    />
  )
}