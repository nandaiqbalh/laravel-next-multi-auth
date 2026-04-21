import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Input primitive for consistent text field styling.
 *
 * Usage:
 * <Input name="email" type="email" />
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-input bg-[var(--surface-soft)] px-3 py-2 text-base shadow-none transition-[color,box-shadow,border-color,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/35 focus-visible:bg-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-white disabled:opacity-100 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 bg-white",
        className
      )}
      {...props}
    />
  )
}

export { Input }
