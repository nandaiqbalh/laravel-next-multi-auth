import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Shared dashboard entry route for authenticated users.
 */
export default async function DashboardEntryPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "admin") {
    redirect("/admin/dashboard");
  }

  redirect("/user/dashboard");
}
