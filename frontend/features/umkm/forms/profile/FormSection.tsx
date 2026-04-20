import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Thematic grouping for form fields inside a card wrapper.
 *
 * @example
 * <FormSection title="Identitas Pengusaha" description="Data dasar pemilik usaha.">
 *   ...fields
 * </FormSection>
 */
export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Card className="rounded-3xl border-border bg-white shadow-sm">
      <CardContent className="space-y-4 p-5 sm:p-6">
        <div className="space-y-0.5">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}