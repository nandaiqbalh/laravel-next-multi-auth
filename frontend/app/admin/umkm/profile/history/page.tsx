import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { AdminProfileHistoryClient } from "@/components/features/umkm/AdminProfileHistoryClient";
import { umkmService } from "@/features/umkm/services/umkmService";

export const metadata = {
  title: "Riwayat Perubahan Profil UMKM",
  description: "Kelola dan tinjau permintaan perubahan profil UMKM dari pengguna.",
};

export default async function AdminUmkmProfileHistoryPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  const history = await umkmService.getAdminProfileHistory(session.token);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Perubahan Profil UMKM"
        description="Tinjau permintaan perubahan profil usaha dan setujui atau tolak sesuai kebijakan."
      />
      <AdminProfileHistoryClient initialData={history} token={session.token} />
    </div>
  );
}
