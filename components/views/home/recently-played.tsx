'use client';

import { ChevronRight, Play } from 'lucide-react';

import * as React from 'react';

import { Button } from '@/components/primitives/button';
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
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <a href="/tracks">
            Ver todo
            <ChevronRight className="h-4 w-4" />
          </a>
        </Button>
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
            : tracks.map((track) => (
                <div key={track.id} className="w-[160px] shrink-0 space-y-3 group">
                  <div className="relative aspect-square overflow-hidden rounded-md">
                    <img
                      src={track.image || '/placeholder.svg?height=160&width=160'}
                      alt={track.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Button
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <Play className="h-5 w-5 ml-0.5" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium truncate">{track.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artists.map((artist) => artist.name).join(', ')}
                    </p>
                  </div>
                </div>
              ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
