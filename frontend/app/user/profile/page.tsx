import { auth } from "@/auth";

/**
 * User profile page shows current session profile data.
 */
export default async function UserProfilePage() {
  const session = await auth();

  return (
    <section className="card p-6">
      <h1 className="page-title">Profile</h1>
      <div className="mt-4 grid gap-2 text-sm">
        <p>
          <span className="font-semibold">Name:</span> {session?.user.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {session?.user.email}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {session?.user.role}
        </p>
      </div>
    </section>
  );
}
