import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { umkmService } from "@/features/umkm/services/umkmService";

export const metadata = {
  title: 'Users UMKM',
  description: 'Kelola akun pengguna UMKM dalam portal.',
};


/**
 * UMKM admin user listing page.
 */
export default async function AdminUserPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  const users = await umkmService.getAdminUsers(session.token);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data User</CardTitle>
        <CardDescription>Daftar user untuk kebutuhan validasi admin UMKM.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIK</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.items.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nik}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role?.name ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
