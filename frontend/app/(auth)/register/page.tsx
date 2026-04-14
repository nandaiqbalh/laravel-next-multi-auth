"use client";

import { registerAction } from "@/lib/actions/authActions";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await registerAction({ name, email, password });
      await signIn("credentials", { email, password, redirect: false });
      const session = await getSession();
      const dashboardHref = session?.user?.role === "admin" ? "/admin/dashboard" : "/dashboard";

      router.push(dashboardHref);
      router.refresh();
    } catch {
      setError("Register gagal. Coba ulangi beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <section className="card w-full p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--primary-dark)]">Auth Portal</p>
        <h1 className="mt-2 text-3xl font-bold">Register</h1>
        <p className="page-subtitle">Buat akun baru sebagai user.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input className="field" name="name" placeholder="Nama" required />
          <input className="field" name="email" type="email" placeholder="Email" required />
          <input className="field" name="password" type="password" placeholder="Password" required />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button className="btn-primary w-full rounded-xl px-4 py-3 font-semibold" disabled={loading} type="submit">
            {loading ? "Loading..." : "Daftar"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Sudah punya akun? <Link href="/login" className="font-semibold text-[var(--primary-dark)]">Login</Link>
        </p>
      </section>
    </main>
  );
}
