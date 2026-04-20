import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { StatCard } from "@/features/umkm/components/StatCard";
import { umkmService } from "@/features/umkm/services/umkmService";

export const metadata = {
  title: 'Dashboard Admin UMKM',
  description: 'Ringkasan validasi profil, klaim, dan pengajuan UMKM.',
};


/**
 * Admin UMKM dashboard page.
 */
export default async function AdminUmkmDashboardPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  let summary;

  try {
    summary = await umkmService.getAdminDashboard(session.token);
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unauthenticated")) {
      redirect("/login");
    }

    throw error;
  }

  return (
    <div className="space-y-4">
      <section>
        <h1 className="page-title">Dashboard Admin UMKM</h1>
        <p className="page-subtitle">Ringkasan validasi profile, claim, dan pengajuan layanan.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Profil" value={summary.profiles.total} description={`Verified: ${summary.profiles.verified}`} />
        <StatCard title="Claim Pending" value={summary.claims.pending} description={`Approved: ${summary.claims.approved}`} />
        <StatCard title="Pengajuan Selesai" value={summary.submissions.selesai} description={`Dalam Proses: ${summary.submissions.dalam_proses}`} />
      </section>
    </div>
  );
}
