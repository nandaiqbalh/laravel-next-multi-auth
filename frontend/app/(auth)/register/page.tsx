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
    <main className="relative mx-auto grid min-h-screen w-full max-w-[1120px] items-center gap-6 overflow-hidden px-4 py-8 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

      <section className="relative hidden rounded-2xl border border-sky-100/80 bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-600 p-8 text-white shadow-[0_20px_48px_rgba(17,77,140,0.22)] lg:block">
        <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
          Registrasi Akun
        </p>
        <h1 className="mt-5 text-4xl font-bold leading-tight">Buat Akun Portal UMKM</h1>
        <p className="mt-4 max-w-md text-sm text-sky-100">
          Daftarkan akun baru untuk memulai pengelolaan profil UMKM dan akses layanan digital secara terintegrasi.
        </p>
        <div className="mt-8 space-y-3 text-sm text-sky-100">
          <p>• Pendaftaran cepat menggunakan NIK dan email aktif</p>
          <p>• Dashboard sesuai role setelah login</p>
          <p>• Struktur data siap lanjut ke fitur bisnis</p>
        </div>
      </section>

      <Card className="relative w-full border-white/70 bg-white/95 backdrop-blur-sm">
        <CardHeader className="border-b border-[var(--border)] bg-gradient-to-r from-sky-700 to-cyan-700 text-primary-foreground">
          <CardTitle className="text-xl font-bold">Registrasi UMKM User</CardTitle>
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

            {error ? <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

            <Button type="submit" disabled={loading} className="h-10 w-full text-sm font-semibold">
              {loading ? "Loading..." : "Daftar"}
            </Button>
          </form>

          <p className="mt-5 text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
