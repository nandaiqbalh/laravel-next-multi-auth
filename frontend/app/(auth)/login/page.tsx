"use client";

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
 * Login page handles credentials authentication via NextAuth.
 */
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const nik = String(formData.get("nik") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", { nik, password, redirect: false });

    if (result?.error) {
      setError("Login gagal. Pastikan NIK dan password benar.");
      setLoading(false);
      return;
    }

    const session = await getSession();
    const dashboardHref = resolveDashboardHref(session?.user?.role);

    router.push(dashboardHref);
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle>Login Portal UMKM</CardTitle>
          <CardDescription className="text-primary-foreground/80">Masuk menggunakan NIK dan password.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nik">NIK</Label>
              <Input id="nik" name="nik" placeholder="Masukkan NIK" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Masukkan password" required />
            </div>

            {error ? <p className="text-destructive">{error}</p> : null}

            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground">
              {loading ? "Loading..." : "Masuk"}
            </Button>
          </form>

          <p className="mt-4 text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary underline">
              Daftar
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
