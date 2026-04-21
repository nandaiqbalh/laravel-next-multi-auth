"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { SubmissionTable } from "./SubmissionTable";
import type { SubmissionItem } from "@/features/umkm/types/umkm";

export function SubmissionHistoryPanel({ submissions }: { submissions: SubmissionItem[] }) {
  const [selectedPerangkatDaerahId, setSelectedPerangkatDaerahId] = useState<number | null>(null);

  const perangkatOptions = useMemo(() => {
    const map = new Map<number, string>();

    submissions.forEach((submission) => {
      const id = submission.service?.perangkat_daerah_id;
      if (!id) {
        return;
      }

      if (!map.has(id)) {
        map.set(id, submission.service?.perangkat_daerah?.name ?? `PD #${id}`);
      }
    });

    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    if (selectedPerangkatDaerahId === null) {
      return submissions;
    }

    return submissions.filter(
      (item) => item.service?.perangkat_daerah_id === selectedPerangkatDaerahId,
    );
  }, [selectedPerangkatDaerahId, submissions]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle>Riwayat Pengajuan</CardTitle>
              <p className="text-sm text-slate-500">Filter riwayat berdasarkan perangkat daerah.</p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/user/pengajuan/create">
                <Button>Ajukan</Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-2">
              <Label htmlFor="filter_perangkat_daerah">Filter Perangkat Daerah</Label>
              <Select
                value={selectedPerangkatDaerahId !== null ? String(selectedPerangkatDaerahId) : ""}
                onValueChange={(value) => setSelectedPerangkatDaerahId(value ? Number(value) : null)}
              >
                <SelectTrigger id="filter_perangkat_daerah" className="w-full">
                  <SelectValue placeholder="Semua perangkat daerah" />
                </SelectTrigger>
                <SelectContent>
                  {perangkatOptions.map((option) => (
                    <SelectItem key={option.id} value={String(option.id)}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <SubmissionTable submissions={filteredSubmissions} />
        </CardContent>
      </Card>
    </div>
  );
}
