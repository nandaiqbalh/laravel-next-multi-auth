import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { PortalShell } from "@/features/umkm/components/PortalShell";
import { SubmissionTable } from "@/features/umkm/components/SubmissionTable";
import { SubmissionForm } from "@/features/umkm/forms/SubmissionForm";
import { umkmService } from "@/features/umkm/services/umkmService";
import { requireRole } from "@/features/umkm/utils/guards";

export const metadata = {
  title: 'Pengajuan Layanan',
  description: 'Ajukan layanan digital dan lihat riwayat pengajuan.',
};


/**
 * Submission page for user role.
 */
export default async function UserSubmissionPage() {
  const context = await requireRole(["UMKM_USER"]);

  const [services, submissions] = await Promise.all([
    umkmService.getServices(context.token),
    umkmService.getMySubmissions(context.token),
  ]);

  return (
    <PortalShell role="UMKM_USER" userName={context.user.name} userEmail={context.user.email}>
      <div className="space-y-4">
        <PageHeader
          title="Pengajuan Layanan"
          description="Ajukan layanan dengan melampirkan URL dokumen Google Drive."
        />

        <SubmissionForm services={services} />

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Pengajuan</CardTitle>
          </CardHeader>
          <CardContent>
            <SubmissionTable submissions={submissions.items} />
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
