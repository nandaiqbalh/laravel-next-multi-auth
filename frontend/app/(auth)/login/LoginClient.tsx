"use client";

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
import { resolveRoleHomePath } from "@/features/umkm/utils/roleRouting";

const FEATURES = [
  { text: "Ajukan berbagai macam permohonan digital" },
  { text: "Pantau status permohonan secara langsung" },
  { text: "Dukung digitalisasi dan penataan data di Kab. Kulon Progo" },
];

export default function LoginClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(event.currentTarget);
    const nik = String(fd.get("nik") ?? "");
    const password = String(fd.get("password") ?? "");

    const result = await signIn("credentials", { nik, password, redirect: false });

    if (result?.error) {
      setError("NIK atau password salah. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    const session = await getSession();
    const targetHref = resolveRoleHomePath(session?.user?.roleSlug, session?.user?.role);

    try {
      router.push(targetHref);
      router.refresh();
    } catch {
      window.location.assign(targetHref);
    }

    setLoading(false);
  }

  return (
    <AuthLayout
      badge="Portal Layanan Digital"
      heading="Masuk ke Portal Layanan Digital"
      description="Kelola profil usaha, pengajuan layanan, dan proses verifikasi dalam satu dashboard."
      features={FEATURES}
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-sky-700 to-cyan-700 px-8 py-6 text-white">
        <h2 className="text-lg font-bold tracking-tight">Login Portal Layanan Digital</h2>
        <p className="mt-0.5 text-sm text-white/80">Masuk menggunakan NIK dan password.</p>
      </div>

      <div className="flex flex-1 flex-col px-8 py-8">
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <FormField id="nik" label="NIK">
            <Input
              id="nik"
              name="nik"
              placeholder="Masukkan 16 digit NIK"
              autoComplete="username"
              required
            />
          </FormField>

          <FormField id="password" label="Password">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Masukkan password"
              autoComplete="current-password"
              required
            />
          </FormField>

          {error && <ErrorBanner message={error} />}

          <Button type="submit" disabled={loading} className="h-10 w-full text-sm font-semibold">
            {loading ? <Spinner /> : "Masuk"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun?{' '}
          <Link href="/register" className="font-semibold text-sky-700 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
