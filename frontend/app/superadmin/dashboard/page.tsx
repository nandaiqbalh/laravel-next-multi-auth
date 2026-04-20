import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/features/umkm/components/StatCard";
import { umkmService } from "@/features/umkm/services/umkmService";

/**
 * Superadmin dashboard page.
 */
export default async function SuperadminDashboardPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  const [roles, users] = await Promise.all([
    umkmService.getSuperadminRoles(session.token),
    umkmService.getSuperadminUsers(session.token),
  ]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Superadmin</CardTitle>
          <CardDescription>Kelola role, user, dan audit trail aplikasi.</CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <StatCard title="Total Roles" value={roles.meta.total} />
        <StatCard title="Total Users" value={users.meta.total} />
      </section>
    </div>
  );
}
