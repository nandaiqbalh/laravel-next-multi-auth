"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building2 } from "lucide-react";
import { perangkatDaerahRepository } from "@/lib/repositories/perangkatDaerahRepository";
import { serviceManagementRepository } from "@/lib/repositories/serviceManagementRepository";
import { ManagedService, PerangkatDaerah } from "@/lib/types";

export default function LayananAccordion() {
  const [perangkatDaerahs, setPerangkatDaerahs] = useState<PerangkatDaerah[]>([]);
  const [servicesBySlug, setServicesBySlug] = useState<Record<string, ManagedService[]>>({});

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

  if (!perangkatDaerahs.length) {
    return (
      <div className="w-full max-w-6xl rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 text-sm text-slate-500 shadow-lg shadow-slate-900/10">
        Data layanan belum tersedia.
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full max-w-6xl rounded-[2rem] border border-slate-200/80 bg-white/95 p-2 shadow-lg shadow-slate-900/10">
      {perangkatDaerahs.map((perangkat) => {
        const layananItems = servicesBySlug[perangkat.slug] ?? [];

        return (
          <AccordionItem key={perangkat.id} value={perangkat.slug}>
            <AccordionTrigger className="px-6 py-5">
              <div className="flex w-full flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-600 text-white">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{perangkat.name}</p>
                    <p className="mt-1 text-sm text-slate-600">Klik untuk membuka daftar layanan digital yang tersedia.</p>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                {layananItems.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200/80 bg-slate-50 p-5 shadow-sm shadow-slate-900/5">
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-2 text-xs text-slate-500">Kode layanan: {item.code}</p>
                    <Link href={`/layanan/${perangkat.slug}/${item.id}`} className="mt-4 inline-flex text-xs font-semibold text-sky-700 hover:text-sky-900">
                      Buka layanan
                    </Link>
                  </div>
                ))}
                {!layananItems.length ? (
                  <p className="text-sm text-slate-500">Belum ada layanan aktif pada perangkat daerah ini.</p>
                ) : null}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
