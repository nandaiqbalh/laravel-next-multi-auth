import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { serviceManagementRepository } from "@/lib/repositories/serviceManagementRepository";

type PublicLayananBySlugPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublicLayananBySlugPage({ params }: PublicLayananBySlugPageProps) {
  const { slug } = await params;
  const response = await serviceManagementRepository.listPublicBySlug(slug);

  if (!response.data.length) {
    notFound();
  }

  const perangkatDaerahName = response.data[0]?.perangkat_daerah?.name ?? slug;

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero strip — konsisten dengan landing page */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-700 px-4 py-16 text-white sm:px-8 sm:py-20 lg:px-10">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
            Portal Layanan Digital
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {perangkatDaerahName}
          </h1>
          <p className="mt-3 max-w-xl text-base text-sky-100">
            Pilih layanan aktif di bawah ini untuk memulai pengajuan secara digital.
          </p>
        </div>
      </section>

      {/* Layanan list */}
      <section className="px-4 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
            Layanan Tersedia
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {response.data.length} Layanan Aktif
          </h2>

          <div className="mt-6 divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white">
            {response.data.map((service) => (
              <article
                key={service.id}
                className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-slate-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50">
                  <FileText className="h-5 w-5 text-sky-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-500">
                    {service.code}
                  </p>
                  <p className="mt-0.5 text-base font-semibold text-slate-800">
                    {service.name}
                  </p>
                </div>

                <Link
                  href={`/user/pengajuan/create?opd_slug=${encodeURIComponent(
                    slug,
                  )}&service=${encodeURIComponent(service.slug ?? service.code)}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold !text-white hover:bg-sky-700 hover:text-white"
                >
                  Ajukan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}