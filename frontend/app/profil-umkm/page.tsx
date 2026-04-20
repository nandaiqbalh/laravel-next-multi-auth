import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PortalShell } from "@/features/umkm/components/PortalShell";
import { UmkmProfileForm } from "@/features/umkm/forms/UmkmProfileForm";
import { umkmService } from "@/features/umkm/services/umkmService";
import { requireRole } from "@/features/umkm/utils/guards";

/**
 * Profil UMKM page for UMKM_USER role.
 */
export default async function ProfilUmkmPage() {
  const context = await requireRole(["UMKM_USER"]);
  const profile = await umkmService.getMyProfile(context.token);

  return (
    <PortalShell role="UMKM_USER" userName={context.user.name} userEmail={context.user.email}>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profil UMKM</CardTitle>
            <CardDescription>Lengkapi seluruh data profil UMKM sesuai format final database.</CardDescription>
          </CardHeader>
        </Card>
        <UmkmProfileForm initialProfile={profile} />
      </div>
    </PortalShell>
  );
}
