import { auth } from "@/auth";

/**
 * Admin dashboard page displays role-specific quick summary.
 */
export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <section className="surface-panel p-6">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="mt-2 text-gray-700">Selamat datang, {session?.user.name}. Gunakan menu samping untuk kelola users dan roles.</p>
    </section>
  );
}
