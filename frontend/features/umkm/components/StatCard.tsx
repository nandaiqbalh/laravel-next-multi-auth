import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * StatCard renders compact dashboard metric card.
 * @param title Metric title text.
 * @param value Metric value text/number.
 * @param description Optional helper caption.
 * @returns JSX element.
 *
 * Usage:
 * <StatCard title="Total" value={100} description="Data UMKM" />
 */
export function StatCard({ title, value, description }: { title: string; value: string | number; description?: string }) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      {description ? (
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}
