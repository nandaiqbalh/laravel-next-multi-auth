import { UsersClient } from "@/components/features/admin/users/UsersClient";
import { getRolesAction } from "@/lib/actions/roleActions";
import { getUsersAction } from "@/lib/actions/userActions";

/**
 * Superadmin users page with full CRUD operations.
 */
export default async function SuperadminUsersPage() {
  const [usersResponse, rolesResponse] = await Promise.all([getUsersAction(1, ""), getRolesAction(1, "")]);

  return <UsersClient initialData={usersResponse.data} roles={rolesResponse.data.items} />;
}
