'use client';

import * as React from 'react';

import { MusicCard } from '@/components/primitives/music-card';
import { ScrollArea, ScrollBar } from '@/components/primitives/scroll-area';
import { Skeleton } from '@/components/primitives/skeleton';

import type { Track } from '@/lib/types/music';

interface RecentlyPlayedProps {
  isLoading: boolean;
  tracks: Track[];
}

export function RecentlyPlayed({ isLoading, tracks }: RecentlyPlayedProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reproducidos recientemente</h2>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[160px] shrink-0 space-y-3">
                  <Skeleton className="aspect-square w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            : tracks.map((track) => <MusicCard key={track.id} item={track} type="track" />)}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
