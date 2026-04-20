import { PageHeader } from "@/components/ui/page-header";
import { RolesClient } from "@/components/features/admin/roles/RolesClient";
import { getRolesAction } from "@/lib/actions/roleActions";

export const metadata = {
  title: 'Manajemen Roles Superadmin',
  description: 'Kelola peran pada level superadmin.',
};


/**
 * Superadmin roles page with full CRUD operations.
 */
export default async function SuperadminRolesPage() {
  const response = await getRolesAction(1, "");

  return (
    <div className="space-y-4">
      <PageHeader
        title="Roles Management"
        description="Kelola role dan akses pengguna dalam portal layanan digital."
      />
      <RolesClient initialData={response.data} />
    </div>
  );
}
