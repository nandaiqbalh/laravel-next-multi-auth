import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { AdminDataUmkmClient } from "@/components/features/umkm/AdminDataUmkmClient";
import { umkmService } from "@/features/umkm/services/umkmService";

export const metadata = {
  title: 'Data Pelaku Usaha',
  description: 'Lihat dan kelola data pelaku usaha yang terdaftar.',
};

/**
 * Admin business data listing page.
 */
export default async function AdminDataBusinessPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  const data = await umkmService.getAdminUmkmData(session.token);

  return (
    <div className="space-y-6">
      <PageHeader title="Data Pelaku Usaha" description="Data master profil usaha sesuai format final schema." />
      <AdminDataUmkmClient initialData={data} token={session.token} />
    </div>
  );
}
