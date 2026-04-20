import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <Card>
      <CardHeader>
        <CardTitle>Data UMKM</CardTitle>
        <CardDescription>Data master profil UMKM sesuai format final schema.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Data</TableHead>
              <TableHead>Nama Pengusaha</TableHead>
              <TableHead>Nama Usaha</TableHead>
              <TableHead>NIK</TableHead>
              <TableHead>Status Verifikasi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((item) => (
              <TableRow key={item.id_data_badan_usaha}>
                <TableCell>{item.id_data_badan_usaha}</TableCell>
                <TableCell>{item.nama_pengusaha}</TableCell>
                <TableCell>{item.nama_usaha}</TableCell>
                <TableCell>{item.nik_pengusaha}</TableCell>
                <TableCell>
                  {item.is_verified ? <Badge>Verified</Badge> : <Badge variant="secondary">Pending</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
