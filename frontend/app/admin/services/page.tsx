import { PageHeader } from "@/components/ui/page-header";
import { ServicesClient } from "@/components/features/umkm-admin/services/ServicesClient";
import { getPublicPerangkatDaerahAction } from "@/lib/actions/perangkatDaerahActions";
import { getManagedServicesAction } from "@/lib/actions/serviceManagementActions";

export const metadata = {
  title: "Manajemen Layanan",
  description: "Kelola layanan per perangkat daerah dan status aktif layanan.",
};

export default async function AdminServicesPage() {
  const [servicesResponse, perangkatResponse] = await Promise.all([
    getManagedServicesAction(1, ""),
    getPublicPerangkatDaerahAction(),
  ]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Layanan"
        description="Kelola layanan yang akan ditampilkan pada halaman publik dan pengajuan pengguna."
      />
      <ServicesClient initialData={servicesResponse.data} perangkatDaerahOptions={perangkatResponse.data} />
    </div>
  );
}
