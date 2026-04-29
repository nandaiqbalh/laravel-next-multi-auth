"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building2, ChevronDown, ArrowRight } from "lucide-react";
import { perangkatDaerahRepository } from "@/lib/repositories/perangkatDaerahRepository";
import { serviceManagementRepository } from "@/lib/repositories/serviceManagementRepository";
import { ManagedService, PerangkatDaerah } from "@/lib/types";

export default function LayananAccordion() {
  const [perangkatDaerahs, setPerangkatDaerahs] = useState<PerangkatDaerah[]>([]);
  const [servicesBySlug, setServicesBySlug] = useState<Record<string, ManagedService[]>>({});
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const perangkatResponse = await perangkatDaerahRepository.listPublic();
        const perangkatItems = perangkatResponse.data;
        setPerangkatDaerahs(perangkatItems);

        const serviceEntries = await Promise.all(
          perangkatItems.map(async (item) => {
            const servicesResponse = await serviceManagementRepository.listPublicBySlug(item.slug);
            return [item.slug, servicesResponse.data] as const;
          }),
        );

        setServicesBySlug(Object.fromEntries(serviceEntries));
      } catch {
        setPerangkatDaerahs([]);
        setServicesBySlug({});
      }
    }

    load();
  }, []);

  const toggle = (slug: string) => {
    setOpenSlug((prev) => (prev === slug ? null : slug));
  };

  if (!perangkatDaerahs.length) {
    return (
      <div className="w-full max-w-3xl rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-slate-400">
        Data layanan belum tersedia.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white">
      {perangkatDaerahs.map((perangkat) => {
        const layananItems = servicesBySlug[perangkat.slug] ?? [];
        const isOpen = openSlug === perangkat.slug;

        return (
          <div key={perangkat.id}>
            {/* Trigger */}
            <button
              onClick={() => toggle(perangkat.slug)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50">
                  <Building2 className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{perangkat.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {layananItems.length
                      ? `${layananItems.length} layanan tersedia`
                      : "Belum ada layanan"}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Content */}
            {isOpen && (
              <div className="border-t border-gray-100 bg-slate-50 px-5 py-4">
                {layananItems.length ? (
                  <>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {layananItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-100 bg-white px-4 py-3"
                        >
                          <p className="text-sm font-medium text-slate-800">{item.name}</p>
                          <p className="mt-0.5 text-xs text-slate-400">Kode: {item.code}</p>
                        </div>
                      ))}
                    </div>

                    {/* Single CTA per accordion */}
                    <div className="mt-4 flex justify-end">
                      <Link
                        href={`/layanan/${perangkat.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700  !text-white"
                      >
                        Lihat Semua Layanan
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className="py-2 text-sm text-slate-400">
                    Belum ada layanan aktif pada perangkat daerah ini.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}