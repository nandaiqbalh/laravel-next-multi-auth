"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building2 } from "lucide-react";

const layananItems = [
  { code: "PIRT", label: "Sertifikasi PIRT" },
  { code: "NIB", label: "Nomor Induk Berusaha" },
  { code: "KURASI", label: "Kurasi Produk UMKM" },
  { code: "HALAL", label: "Sertifikasi Halal" },
  { code: "QRIS", label: "Aktivasi QRIS" },
  { code: "BBM", label: "Pengajuan Bahan Bakar Minyak" },
];

export default function LayananAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-6xl rounded-[2rem] border border-slate-200/80 bg-white/95 shadow-lg shadow-slate-900/10">
      <AccordionItem value="layanan">
        <AccordionTrigger className="px-6 py-5">
          <div className="flex w-full flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-600 text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">Dinas Perindustrian dan Koperasi UKM</p>
                <p className="mt-1 text-sm text-slate-600">Klik untuk membuka daftar layanan digital yang tersedia.</p>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6 pt-0">
          <div className="grid gap-4 sm:grid-cols-2">
            {layananItems.map((item) => (
              <div key={item.code} className="rounded-3xl border border-slate-200/80 bg-slate-50 p-5 shadow-sm shadow-slate-900/5">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="mt-2 text-xs text-slate-500">Kode layanan: {item.code}</p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
