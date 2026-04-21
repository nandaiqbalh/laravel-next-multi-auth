import { PageHeader } from "@/components/ui/page-header";
import { PerangkatDaerahClient } from "@/components/features/admin/perangkat-daerah/PerangkatDaerahClient";
import { getPerangkatDaerahAction } from "@/lib/actions/perangkatDaerahActions";

export const metadata = {
  title: "Manajemen Perangkat Daerah",
  description: "Kelola data perangkat daerah sebagai pemilik layanan.",
};

export default async function SuperadminPerangkatDaerahPage() {
  let initialData: Awaited<ReturnType<typeof getPerangkatDaerahAction>>["data"] | null = null;
  let loadError = "";

  try {
    const response = await getPerangkatDaerahAction(1, "");
    initialData = response.data;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Gagal memuat data perangkat daerah.";
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Perangkat Daerah"
        description="Kelola master perangkat daerah untuk pengelompokan dan kepemilikan layanan publik."
      />
      {initialData ? (
        <PerangkatDaerahClient initialData={initialData} />
      ) : (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError || "Gagal memuat data perangkat daerah."}
        </div>
      )}
    </div>
  );
}
