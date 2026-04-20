// components/common/FormField.tsx

import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: ReactNode;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
}

export function FormField({ id, label, children, className, labelClassName }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className={cn("text-sm font-medium text-slate-700", labelClassName)}>
        {label}
      </Label>
      {children}
    </div>
  );
}