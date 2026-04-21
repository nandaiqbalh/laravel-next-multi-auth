import { PageHeader } from "@/components/ui/page-header";
import { PortalShell } from "@/features/umkm/components/PortalShell";
import { SubmissionForm } from "@/features/umkm/forms/SubmissionForm";
import { requireRole } from "@/features/umkm/utils/guards";

export const metadata = {
  title: "Ajukan Layanan",
  description: "Formulir pengajuan layanan dinamis berdasarkan perangkat daerah dan layanan yang dipilih.",
};

export default async function UserSubmissionCreatePage() {
  const context = await requireRole(["UMKM_USER"]);

  return (
    <PortalShell role="UMKM_USER" userName={context.user.name} userEmail={context.user.email}>
      <div className="space-y-4">
        <PageHeader
          title="Ajukan Layanan"
          description="Pilih perangkat daerah, pilih layanan, lalu lengkapi form dinamis yang muncul."
        />

        <SubmissionForm />
      </div>
    </PortalShell>
  );
}
