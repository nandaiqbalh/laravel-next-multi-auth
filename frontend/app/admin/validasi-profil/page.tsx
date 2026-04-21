import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { AdminClaimValidationClient } from "@/components/features/umkm/AdminClaimValidationClient";
import { umkmService } from "@/features/umkm/services/umkmService";
import { isPerinkopAdminRole, resolveRoleHomePath } from "@/features/umkm/utils/roleRouting";

export const metadata = {
  title: 'Validasi Profil Pelaku Usaha',
  description: 'Proses approve/reject claim sebelum user mengajukan layanan.',
};

/**
 * Admin profile validation page.
 */
export default async function AdminValidasiProfilPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  if (!isPerinkopAdminRole(session.user.roleSlug, session.user.role)) {
    redirect(resolveRoleHomePath(session.user.roleSlug, session.user.role));
  }

  const data = await umkmService.getAdminClaims(session.token);

  return (
    <div className="space-y-6">
      <PageHeader title="Validasi Profil Pelaku Usaha" description="Proses approve/reject claim sebelum user mengajukan layanan." />
      <AdminClaimValidationClient initialData={data} token={session.token} />
    </div>
  );
}
