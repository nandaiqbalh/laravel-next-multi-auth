import { PageHeader } from "@/components/ui/page-header";
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
  const profile = await umkmService.getMyProfile(context.token);

  return (
    <PortalShell role="UMKM_USER" userName={context.user.name} userEmail={context.user.email}>
      <div className="space-y-4">
        <PageHeader
          title="Profil Usaha"
          description="Lengkapi seluruh data profil usaha untuk mengakses fitur pengajuan layanan digital."
        />
        <UmkmProfileForm initialProfile={profile} />
      </div>
    </PortalShell>
  );
}
