'use client';

import { ChevronRight, Music, Play } from 'lucide-react';

import Link from 'next/link';

import { Button } from '@/components/primitives/button';
import { ScrollArea, ScrollBar } from '@/components/primitives/scroll-area';
import { Skeleton } from '@/components/primitives/skeleton';
import { PlaylistCard } from '@/components/views/playlist-views/playlist-card';

import type { Playlist } from '@/lib/types/playlist';

interface FeaturedPlaylistsProps {
  isLoading: boolean;
  playlists: Playlist[];
}

export function FeaturedPlaylists({ isLoading, playlists }: FeaturedPlaylistsProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Playlists destacadas</h2>
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link href="/playlists">
            Ver todo
            <ChevronRight className="h-4 w-4" />
          </Link>
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
            : playlists.map((playlist) => (
                <div key={playlist.id}>
                  <PlaylistCard playlist={playlist} onEdit={() => {}} onDelete={() => {}} />
                </div>
              ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
