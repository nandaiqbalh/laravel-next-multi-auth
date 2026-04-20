import { RolesClient } from "@/components/features/admin/roles/RolesClient";
import { getRolesAction } from "@/lib/actions/roleActions";

/**
 * Superadmin roles page with full CRUD operations.
 */
export default async function SuperadminRolesPage() {
  const response = await getRolesAction(1, "");

  return <RolesClient initialData={response.data} />;
}
