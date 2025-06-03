'use client';

import { Music } from 'lucide-react';

import * as React from 'react';

import { Button } from '@/components/primitives/button';
import { Card, CardContent, CardHeader } from '@/components/primitives/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/primitives/drawer';
import { ScrollArea } from '@/components/primitives/scroll-area';

interface Playlist {
  id: string;
  name: string;
  description?: string;
  covers: string[];
  isPublic: boolean;
  totalSongs: number;
}

interface AddToPlaylistDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string) => void;
}

export function AddToPlaylistDrawer({
  open,
  onOpenChange,
  playlists,
  onAddToPlaylist,
}: AddToPlaylistDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[500px]">
        <DrawerHeader>
          <DrawerTitle>Añadir a playlist</DrawerTitle>
          <DrawerDescription>Selecciona una playlist para añadir la canción</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="flex-1 px-4">
          <div className="flex gap-4 py-4">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer w-[250px] flex-shrink-0"
                onClick={() => onAddToPlaylist(playlist.id)}
              >
                <CardHeader className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    {playlist.covers.length > 0 &&
                    playlist.covers[0]?.startsWith('linear-gradient') ? (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: playlist.covers[0] }}
                      >
                        <Music className="h-8 w-8 text-primary/40" />
                      </div>
                    ) : playlist.covers.length > 0 ? (
                      <img
                        src={playlist.covers[0]}
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Music className="h-8 w-8 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <h3 className="font-semibold text-sm truncate">{playlist.name}</h3>
                  <p className="text-xs text-muted-foreground">{playlist.totalSongs} canciones</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
