import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { AuditTrailClient } from "@/components/features/audit-trail/AuditTrailClient";
import { umkmService } from "@/features/umkm/services/umkmService";

export const metadata = {
  title: 'Audit Trail Superadmin',
  description: 'Lihat catatan audit dan aktivitas sistem superadmin.',
};


/**
 * Superadmin audit trail page.
 */
export default async function SuperadminAuditTrailPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  const audits = await umkmService.getSuperadminAuditTrail(session.token);

  return (
    <div className="space-y-4">
      <PageHeader title="Audit Trail" description="Audit global lintas entity sistem." />
      <AuditTrailClient initialData={audits} token={session.token} scope="superadmin" />
    </div>
  );
}
