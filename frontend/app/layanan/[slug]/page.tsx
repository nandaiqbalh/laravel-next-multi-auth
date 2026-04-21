import Link from "next/link";
import { notFound } from "next/navigation";
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
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Portal Layanan</p>
        <h1 className="text-3xl font-bold text-slate-900">{perangkatDaerahName}</h1>
        <p className="text-slate-600">Pilih layanan aktif untuk melihat formulir pengajuan yang disesuaikan.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {response.data.map((service) => (
          <article key={service.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.15em] text-sky-700">{service.code}</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">{service.name}</h2>
            <p className="mt-2 text-sm text-slate-600">Layanan aktif untuk pengajuan pengguna.</p>
            <Link
              href={`/layanan/${slug}/${service.id}`}
              className="mt-4 inline-flex rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Lihat Detail
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
