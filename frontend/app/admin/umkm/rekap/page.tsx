import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/features/umkm/components/StatCard";
import { umkmService } from "@/features/umkm/services/umkmService";

/**
 * Rekap page for UMKM admin.
 */
export default async function AdminRekapPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  const summary = await umkmService.getAdminRekap(session.token);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Rekap UMKM</CardTitle>
          <CardDescription>Rekap profil, claim, dan pengajuan layanan.</CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Profil Verified" value={summary.profiles.verified} />
        <StatCard title="Claim Approved" value={summary.claims.approved} />
        <StatCard title="Submission Selesai" value={summary.submissions.selesai} />
      </section>
    </div>
  );
}
