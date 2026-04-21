import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ServicesClient } from "@/components/features/umkm-admin/services/ServicesClient";
import { getManagedServicesAction } from "@/lib/actions/serviceManagementActions";

export const metadata = {
  title: "Manajemen Layanan",
  description: "Kelola layanan per perangkat daerah dan status aktif layanan.",
};

export default async function AdminServicesPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  const currentPerangkatDaerahId = session.user.rolePerangkatDaerahId ?? undefined;

  const servicesResponse = await getManagedServicesAction(1, "", currentPerangkatDaerahId);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Layanan"
        description="Kelola layanan yang akan ditampilkan pada halaman publik dan pengajuan pengguna."
      />
      <ServicesClient
        initialData={servicesResponse.data}
        currentPerangkatDaerahId={currentPerangkatDaerahId}
        currentPerangkatDaerahName={session.user.rolePerangkatDaerahName ?? undefined}
      />
    </div>
  );
}
