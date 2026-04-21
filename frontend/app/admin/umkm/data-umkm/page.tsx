import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { AdminDataUmkmClient } from "@/components/features/umkm/AdminDataUmkmClient";
import { umkmService } from "@/features/umkm/services/umkmService";

export const metadata = {
  title: 'Data UMKM',
  description: 'Lihat dan kelola data UMKM yang terdaftar.',
};

/**
 * Admin UMKM data listing page.
 */
export default async function AdminDataUmkmPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  const data = await umkmService.getAdminUmkmData(session.token);

  return (
    <div className="space-y-6">
      <PageHeader title="Data UMKM" description="Data master profil UMKM sesuai format final schema." />
      <AdminDataUmkmClient initialData={data} token={session.token} />
    </div>
  );
}
