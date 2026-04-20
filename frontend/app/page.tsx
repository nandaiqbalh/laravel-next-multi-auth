import { auth } from "@/auth";
import Link from "next/link";

/**
 * Home page renders product landing and does not auto-redirect.
 */
export default async function HomePage() {
  const session = await auth();
  const dashboardHref =
    session?.user.role === "SUPERADMIN"
      ? "/superadmin/dashboard"
      : session?.user.role === "UMKM_ADMIN"
        ? "/admin/umkm/dashboard"
        : "/dashboard";

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-8 lg:px-10">
          <div>
            <p className="text-base font-bold text-sky-800">Fullstack Starter</p>
          </div>

          <div className="flex items-center gap-2">
            {session ? (
              <Link
                href={dashboardHref}
                className="rounded-lg bg-sky-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-sky-700"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-sky-800">
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-sky-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-700 px-4 py-20 text-white sm:px-6 sm:py-28">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative w-full px-2 text-center sm:px-6">
          <p className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
            Laravel API + Next.js Frontend
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Multi-Auth Starter
            <br />
            Siap Pakai untuk Project Produksi
          </h1>
          <p className="mt-5 text-base text-sky-100 sm:text-lg">
            Template fullstack modern dengan auth role-based, dashboard admin/user, CRUD management,
            dan integrasi Laravel + NextAuth.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={session ? dashboardHref : "/register"}
              className="rounded-xl bg-white px-7 py-3 text-sm font-bold !text-sky-900 hover:bg-sky-50 sm:text-base"
            >
              {session ? "Buka Dashboard" : "Mulai Sekarang"}
            </Link>
            <Link
              href={session ? "/login" : "/login"}
              className="rounded-xl border border-white/30 bg-white/10 px-7 py-3 text-sm font-medium text-white hover:bg-white/20 sm:text-base"
            >
              {session ? "Masuk Akun Lain" : "Login"}
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <p className="text-sm font-semibold">Multi Role Ready</p>
              <p className="mt-1 text-xs text-sky-100">Admin dan user dengan akses terpisah.</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <p className="text-sm font-semibold">CRUD Foundation</p>
              <p className="mt-1 text-xs text-sky-100">Users, roles, modal form, search, dan pagination.</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <p className="text-sm font-semibold">API Production Pattern</p>
              <p className="mt-1 text-xs text-sky-100">Arsitektur repository-service-action yang rapi.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid w-full grid-cols-1 gap-4 px-4 py-10 sm:grid-cols-3 sm:px-8 lg:px-10">
        <article className="card p-5">
          <h2 className="text-lg font-bold">Role-based Access</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Routing dan dashboard terpisah untuk admin dan user.</p>
        </article>
        <article className="card p-5">
          <h2 className="text-lg font-bold">Reusable UI</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Komponen tabel, pagination, modal, dan confirm dialog siap pakai.</p>
        </article>
        <article className="card p-5">
          <h2 className="text-lg font-bold">DX Friendly</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Struktur codebase bersih untuk pengembangan cepat dan scalable.</p>
        </article>
      </section>

      <section className="px-4 pb-12 sm:px-8 lg:px-10">
        <div className="card bg-gradient-to-r from-sky-50 via-white to-cyan-50 p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-gray-900">Siap dipakai sebagai fondasi project baru</h3>
          <p className="mt-2 text-sm text-gray-600">
            Mulai dari auth flow, dashboard shell, reusable UI, sampai integrasi API backend sudah siap.
            Tinggal lanjutkan fitur bisnis utama.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href={session ? dashboardHref : "/register"} className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold">
              {session ? "Lanjut ke Dashboard" : "Daftar Sekarang"}
            </Link>
            <Link href="/login" className="rounded-lg border border-[var(--border)] bg-white px-5 py-2.5 text-sm font-semibold text-gray-700">
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
