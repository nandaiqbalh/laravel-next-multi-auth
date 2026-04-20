import { ClaimUmkmForm } from "@/features/umkm/forms/ClaimUmkmForm";
import { PageHeader } from "@/components/ui/page-header";
import { PortalShell } from "@/features/umkm/components/PortalShell";
import { StatCard } from "@/features/umkm/components/StatCard";
import { umkmService } from "@/features/umkm/services/umkmService";
import { requireRole } from "@/features/umkm/utils/guards";

export const metadata = {
  title: 'Dashboard UMKM User',
  description: 'Ringkasan status profil, pengajuan, dan klaim untuk UMKM user.',
};


/**
 * Dashboard page for UMKM_USER role.
 */
export default async function UserUmkmDashboardPage() {
  const context = await requireRole(["UMKM_USER"]);

  const [profile, claim, submissions] = await Promise.all([
    umkmService.getMyProfile(context.token),
    umkmService.getLatestClaim(context.token),
    umkmService.getMySubmissions(context.token),
  ]);

  return (
    <PortalShell role="UMKM_USER" userName={context.user.name} userEmail={context.user.email}>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard UMKM User"
          description="Ringkasan status profil, claim, dan pengajuan layanan Anda."
        />

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Status Profil"
            value={profile ? (profile.is_verified ? "Terverifikasi" : "Belum Verifikasi") : "Belum Isi Profil"}
          />
          <StatCard title="Status Claim" value={claim?.status ?? "Belum Ajukan"} />
          <StatCard title="Total Pengajuan" value={submissions.meta.total} />
        </section>

        <ClaimUmkmForm latestClaim={claim} />
      </div>
    </PortalShell>
  );
}
