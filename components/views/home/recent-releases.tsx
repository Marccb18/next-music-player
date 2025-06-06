'use client';

import { useFormat } from '@/hooks/useFormat';
import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/primitives/button';
import { MusicCard } from '@/components/primitives/music-card';
import { ScrollArea, ScrollBar } from '@/components/primitives/scroll-area';
import { Skeleton } from '@/components/primitives/skeleton';

import { Album } from '@/lib/types/music';

interface RecentReleasesProps {
  isLoading: boolean;
  releases: Album[];
}

export function RecentReleases({ isLoading, releases }: RecentReleasesProps) {
  const { formatDate } = useFormat();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Lanzamientos recientes</h2>
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <a href="/albums">
            Ver todo
            <ChevronRight className="h-4 w-4" />
          </a>
        </Button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[240px] shrink-0 space-y-3">
                  <Skeleton className="aspect-square w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            : releases.map((release) => <MusicCard key={release.id} item={release} type="album" />)}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
