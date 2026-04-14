import { UsersClient } from "@/components/features/admin/users/UsersClient";
import { getRolesAction } from "@/lib/actions/roleActions";
import { getUsersAction } from "@/lib/actions/userActions";

/**
 * Admin users page loads initial users and roles data on server.
 */
export default async function AdminUsersPage() {
  const [usersResponse, rolesResponse] = await Promise.all([getUsersAction(1, ""), getRolesAction(1, "")]);

  return <UsersClient initialData={usersResponse.data} roles={rolesResponse.data.items} />;
}
