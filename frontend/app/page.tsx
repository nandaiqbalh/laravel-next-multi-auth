import { auth } from "@/auth";
import Link from "next/link";
import LayananAccordion from "./LayananAccordion";
import { resolveRoleHomePath } from "@/features/umkm/utils/roleRouting";

export const metadata = {
  title: 'Portal Layanan Digital Kabupaten Kulon Progo',
  description: 'Akses layanan digital Pemerintah Kabupaten Kulon Progo untuk perizinan dan dukungan usaha.',
};

/**
 * Home page renders product landing and does not auto-redirect.
 */
export default async function HomePage() {
  const session = await auth();
  const dashboardHref = resolveRoleHomePath(session?.user.roleSlug, session?.user.role);

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-8 lg:px-10">
          <div>
            <p className="text-base font-bold text-sky-800">Portal Layanan Digital</p>
          </div>

          <div className="flex items-center gap-2">
            {session ? (
              <Link
                href={dashboardHref}
                className="rounded-lg bg-sky-600 px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-sky-700 !text-white"
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
                  className="rounded-lg bg-sky-600 px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-sky-700 !text-white"
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
            Pemerintah Kabupaten Kulon Progo
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Portal Layanan Digital
            <br />
            Kabupaten Kulon Progo
          </h1>
          <p className="mt-5 text-base text-sky-100 sm:text-lg">
            Akses layanan publik, perizinan, dukungan usaha, dan program pemberdayaan ekonomi secara digital.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={session ? dashboardHref : "/register"}
              className="rounded-xl bg-white px-7 py-3 text-sm font-bold !text-sky-900 hover:bg-sky-50 sm:text-base"
            >
              {session ? "Buka Dashboard" : "Mulai Sekarang"}
            </Link>
            <Link
              href="#layanan"
              className="rounded-xl border border-white/30 bg-white/10 px-7 py-3 text-sm font-medium text-white hover:bg-white/20 sm:text-base"
            >
              Lihat Layanan
            </Link>
          </div>

          
        </div>
      </section>

      <section id="layanan" className="px-4 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">Layanan yang Tersedia</p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Layanan Tersedia Pemerintah Daerah</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Pilih layanan digital yang tersedia untuk dukungan usaha, sertifikasi, dan peningkatan kapasitas pelaku usaha di Kabupaten Kulon Progo.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <LayananAccordion />
        </div>
      </section>
    </main>
  );
}
