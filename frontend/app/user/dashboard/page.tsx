import { auth } from "@/auth";

/**
 * User dashboard page displays personalized greeting.
 */
export default async function UserDashboardPage() {
  const session = await auth();

  return (
    <section className="surface-panel p-6">
      <h1 className="page-title">User Dashboard</h1>
      <p className="mt-2 text-gray-700">Halo {session?.user.name}, Anda login sebagai user biasa.</p>
    </section>
  );
}
