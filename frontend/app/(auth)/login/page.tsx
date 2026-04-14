"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Login gagal. Pastikan email dan password benar.");
      setLoading(false);
      return;
    }

    const session = await getSession();
    const dashboardHref = session?.user?.role === "admin" ? "/admin/dashboard" : "/dashboard";

    router.push(dashboardHref);
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <section className="card w-full p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--primary-dark)]">Auth Portal</p>
        <h1 className="mt-2 text-3xl font-bold">Login</h1>
        <p className="page-subtitle">Masuk dengan akun yang sudah terdaftar.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input className="field" name="email" type="email" placeholder="Email" required />
          <input className="field" name="password" type="password" placeholder="Password" required />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button className="btn-primary w-full rounded-xl px-4 py-3 font-semibold" disabled={loading} type="submit">
            {loading ? "Loading..." : "Masuk"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Belum punya akun? <Link href="/register" className="font-semibold text-[var(--primary-dark)]">Daftar</Link>
        </p>
      </section>
    </main>
  );
}
