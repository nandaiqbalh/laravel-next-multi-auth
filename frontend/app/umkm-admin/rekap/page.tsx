import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/features/umkm/components/StatCard";
import { umkmService } from "@/features/umkm/services/umkmService";

export const metadata = {
  title: 'Rekap Pengajuan UMKM',
  description: 'Lihat rekapitulasi status pengajuan UMKM.',
};

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
    <div className="space-y-6">
      <PageHeader title="Rekap UMKM" description="Rekap profil, claim, dan pengajuan layanan." />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Profil Verified" value={summary.profiles.verified} />
        <StatCard title="Claim Approved" value={summary.claims.approved} />
        <StatCard title="Submission Selesai" value={summary.submissions.selesai} />
      </section>
    </div>
  );
}
