import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { AdminSubmissionValidationClient } from "@/components/features/umkm/AdminSubmissionValidationClient";
import { umkmService } from "@/features/umkm/services/umkmService";

export const metadata = {
  title: 'Daftar Pengajuan Layanan',
  description: 'Kelola status pengajuan layanan.',
};


/**
 * Admin submission list page separated into a dedicated client page.
 */
export default async function AdminPengajuanPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  const data = await umkmService.getAdminSubmissions(session.token);

  return (
    <div className="space-y-6">
      <PageHeader title="Daftar Pengajuan" description="Kelola status pengajuan layanan." />
      <AdminSubmissionValidationClient initialData={data} token={session.token} />
    </div>
  );
}
