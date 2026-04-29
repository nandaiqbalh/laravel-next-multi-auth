import { PageHeader } from "@/components/ui/page-header";
import { PortalShell } from "@/features/umkm/components/PortalShell";
import { SubmissionForm } from "@/features/umkm/forms/SubmissionForm";
import { requireRole } from "@/features/umkm/utils/guards";

export const metadata = {
  title: "Ajukan Layanan",
  description: "Formulir pengajuan layanan dinamis berdasarkan perangkat daerah dan layanan yang dipilih.",
};

type UserSubmissionCreatePageProps = {
  searchParams?: {
    opd_slug?: string | string[];
    service?: string | string[];
  };
};

export default async function UserSubmissionCreatePage({ searchParams }: UserSubmissionCreatePageProps) {
  const queryParams = new URLSearchParams();
  if (searchParams?.opd_slug) {
    const opdSlug = Array.isArray(searchParams.opd_slug)
      ? searchParams.opd_slug[0]
      : searchParams.opd_slug;
    if (opdSlug) {
      queryParams.set("opd_slug", opdSlug);
    }
  }
  if (searchParams?.service) {
    const service = Array.isArray(searchParams.service)
      ? searchParams.service[0]
      : searchParams.service;
    if (service) {
      queryParams.set("service", service);
    }
  }
  const callbackUrl = queryParams.toString()
    ? `/user/pengajuan/create?${queryParams.toString()}`
    : "/user/pengajuan/create";
  const context = await requireRole(["UMKM_USER"], callbackUrl);

  return (
    <PortalShell role="UMKM_USER" userName={context.user.name} userEmail={context.user.email}>
      <div className="space-y-4">
        <PageHeader
          title="Ajukan Layanan"
          description="Pilih perangkat daerah, pilih layanan, lalu lengkapi form pengajuan."
        />

        <SubmissionForm />
      </div>
    </PortalShell>
  );
}
