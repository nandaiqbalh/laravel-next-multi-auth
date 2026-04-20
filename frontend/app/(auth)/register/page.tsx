"use client";

import { registerAction } from "@/lib/actions/authActions";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Resolve default dashboard route based on role.
 * @param role Role name from session.
 * @returns Dashboard path.
 *
 * Usage:
 * const href = resolveDashboardHref(session?.user?.role);
 */
function resolveDashboardHref(role?: string): string {
  if (role === "SUPERADMIN") {
    return "/superadmin/dashboard";
  }

  if (role === "UMKM_ADMIN") {
    return "/admin/umkm/dashboard";
  }

  return "/dashboard";
}

/**
 * Register page handles account creation then auto login.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const nik = String(formData.get("nik") ?? "");
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await registerAction({ nik, name, email, password });
      await signIn("credentials", { nik, password, redirect: false });
      const session = await getSession();
      const dashboardHref = resolveDashboardHref(session?.user?.role);

      router.push(dashboardHref);
      router.refresh();
    } catch {
      setError("Register gagal. Coba ulangi beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-green-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

      <Card className="relative w-full max-w-md border-white/70 bg-white/95 backdrop-blur-sm">
        <CardHeader className="rounded-b-2xl bg-gradient-to-br from-green-800 via-green-700 to-emerald-700 text-primary-foreground">
          <CardTitle>Registrasi UMKM User</CardTitle>
          <CardDescription className="text-primary-foreground/85">Daftarkan akun dengan NIK, email, dan password.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nik">NIK</Label>
              <Input id="nik" name="nik" placeholder="Masukkan NIK" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="name" placeholder="Nama lengkap" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="contoh@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Minimal 6 karakter" required />
            </div>

            {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Loading..." : "Daftar"}
            </Button>
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-primary underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
