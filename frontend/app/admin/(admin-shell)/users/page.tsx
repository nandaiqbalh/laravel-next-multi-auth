import { PageHeader } from "@/components/ui/page-header";
import { UsersClient } from "@/components/features/admin/users/UsersClient";
import { getRolesAction } from "@/lib/actions/roleActions";
import { getUsersAction } from "@/lib/actions/userActions";

export const metadata = {
  title: 'Manajemen Users',
  description: 'Kelola pengguna sistem dengan hak akses yang sesuai.',
};


/**
 * Admin users page loads initial users and roles data on server.
 */
export default async function AdminUsersPage() {
  const [usersResponse, rolesResponse] = await Promise.all([getUsersAction(1, ""), getRolesAction(1, "")]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Users Management"
        description="Kelola user, peran, dan akses dalam portal layanan digital."
      />
      <UsersClient initialData={usersResponse.data} roles={rolesResponse.data.items} />
    </div>
  );
}
