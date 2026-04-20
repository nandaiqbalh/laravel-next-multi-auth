import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <Card>
      <CardHeader>
        <CardTitle>Audit Trail</CardTitle>
        <CardDescription>Audit global lintas entity sistem.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>Aksi</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audits.items.map((audit) => (
              <TableRow key={audit.id}>
                <TableCell>{new Date(audit.created_at).toLocaleString("id-ID")}</TableCell>
                <TableCell>{audit.action}</TableCell>
                <TableCell>{audit.entity_type}</TableCell>
                <TableCell>{audit.entity_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
