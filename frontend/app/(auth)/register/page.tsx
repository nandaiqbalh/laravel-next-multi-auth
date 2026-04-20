"use client";

import { registerAction } from "@/lib/actions/authActions";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { AuthLayout } from "@/components/auth/auth-layout";

/** Resolve dashboard route by role. */
function resolveDashboardHref(role?: string): string {
  if (role === "SUPERADMIN") return "/superadmin/dashboard";
  if (role === "UMKM_ADMIN") return "/admin/umkm/dashboard";
  return "/dashboard";
}

const FEATURES = [
  { text: "Ajukan berbagai macam permohonan digital" },
  { text: "Pantau status permohonan secara langsung" },
  { text: "Dukung digitalisasi dan penataan data di Kab. Kulon Progo" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(event.currentTarget);
    const nik = String(fd.get("nik") ?? "");
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");

    try {
      await registerAction({ nik, name, email, password });
      await signIn("credentials", { nik, password, redirect: false });
      const session = await getSession();
      router.push(resolveDashboardHref(session?.user?.role));
      router.refresh();
    } catch {
      setError("Pendaftaran gagal. Coba ulangi beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      badge="Registrasi Akun"
      heading="Buat Akun Portal Layanan Digital"
      description="Daftarkan akun baru untuk mulai mengelola profil dan mengakses layanan digital."
      features={FEATURES}
    >
      {/* Card header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-sky-700 to-cyan-700 px-8 py-6 text-white">
        <h2 className="text-lg font-bold tracking-tight">Registrasi Pengguna</h2>
        <p className="mt-0.5 text-sm text-white/80">Daftarkan akun dengan NIK, email, dan password.</p>
      </div>

      {/* Form */}
      <div className="flex flex-1 flex-col px-8 py-8">
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="nik" label="NIK">
              <Input
                id="nik"
                name="nik"
                placeholder="16 digit NIK"
                autoComplete="off"
                required
              />
            </FormField>

            <FormField id="name" label="Nama Lengkap">
              <Input
                id="name"
                name="name"
                placeholder="Nama sesuai KTP"
                autoComplete="name"
                required
              />
            </FormField>
          </div>

          <FormField id="email" label="Email">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="contoh@email.com"
              autoComplete="email"
              required
            />
          </FormField>

          <FormField id="password" label="Password">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
              required
            />
          </FormField>

          {error && <ErrorBanner message={error} />}

          <Button
            type="submit"
            disabled={loading}
            className="h-10 w-full text-sm font-semibold"
          >
            {loading ? <Spinner /> : "Daftar Sekarang"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-sky-700 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

