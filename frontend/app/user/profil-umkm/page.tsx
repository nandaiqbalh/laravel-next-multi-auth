import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { PortalShell } from "@/features/umkm/components/PortalShell";
import { UmkmProfileForm } from "@/features/umkm/forms/UmkmProfileForm";
import { umkmService } from "@/features/umkm/services/umkmService";
import { requireRole } from "@/features/umkm/utils/guards";

export const metadata = {
  title: 'Profil Usaha',
  description: 'Kelola data profil usaha untuk pengajuan layanan digital.',
};


/**
 * Business profile page for user role.
 */
export default async function UserBusinessProfilePage() {
  const context = await requireRole(["UMKM_USER"]);
  const profile = await umkmService.getMyProfile(context.token)
    ?? await umkmService.getProfileByNik(context.token);
  const history = await umkmService.getMyProfileHistory(context.token);
  const latestHistory = history.items[0];

  const statusLabel = (status?: string) => {
    if (status === "approved") return "Disetujui";
    if (status === "rejected") return "Ditolak";
    if (status === "pending") return "Menunggu";
    return "Belum ada";
  };

  const statusVariant = (status?: string) => {
    if (status === "approved") return "default";
    if (status === "rejected") return "destructive";
    if (status === "pending") return "secondary";
    return "outline";
  };

  return (
    <PortalShell role="UMKM_USER" userName={context.user.name} userEmail={context.user.email}>
      <div className="space-y-4">
        <PageHeader
          title="Profil Usaha"
          description="Perubahan profil UMKM perlu disetujui admin sebelum diterapkan."
        />
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-800">Status Perubahan Terakhir</p>
              <p className="text-xs text-slate-500">Pantau persetujuan perubahan profil yang diajukan.</p>
            </div>
            <Badge variant={statusVariant(latestHistory?.status)}>{statusLabel(latestHistory?.status)}</Badge>
          </div>
          {latestHistory?.status === "rejected" && latestHistory.catatan_admin && (
            <p className="mt-3 text-sm text-slate-600">Catatan admin: {latestHistory.catatan_admin}</p>
          )}
          {latestHistory?.status === "pending" && (
            <p className="mt-3 text-sm text-slate-600">Permintaan perubahan sedang ditinjau admin.</p>
          )}
        </div>
        <UmkmProfileForm initialProfile={profile} />
      </div>
    </PortalShell>
  );
}
