import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/features/umkm/components/StatCard";
import { umkmService } from "@/features/umkm/services/umkmService";

/**
 * Admin UMKM dashboard page.
 */
export default async function AdminUmkmDashboardPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  const summary = await umkmService.getAdminDashboard(session.token);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Admin UMKM</CardTitle>
          <CardDescription>Ringkasan validasi profile, claim, dan pengajuan layanan.</CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Profil" value={summary.profiles.total} description={`Verified: ${summary.profiles.verified}`} />
        <StatCard title="Claim Pending" value={summary.claims.pending} description={`Approved: ${summary.claims.approved}`} />
        <StatCard title="Pengajuan Selesai" value={summary.submissions.selesai} description={`Dalam Proses: ${summary.submissions.dalam_proses}`} />
      </section>
    </div>
  );
}
