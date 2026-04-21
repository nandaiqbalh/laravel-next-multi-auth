import { RolesClient } from "@/components/features/admin/roles/RolesClient";
import { getRolesAction } from "@/lib/actions/roleActions";

export const metadata = {
  title: 'Manajemen Roles',
  description: 'Kelola peran dan hak akses pengguna.',
};


/**
 * Admin roles page loads initial role data on server.
 */
export default async function AdminRolesPage() {
  const response = await getRolesAction(1, "");

  return <RolesClient initialData={response.data} />;
}
