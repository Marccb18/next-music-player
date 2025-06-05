'use client';

import { useFormat } from '@/hooks/useFormat';
import { Heart, MoreHorizontal, Music, Play } from 'lucide-react';

import * as React from 'react';

import { AddToPlaylistDrawer } from '@/components/drawers/add-to-playlist';
import { Button } from '@/components/primitives/button';
import { Card, CardContent, CardHeader } from '@/components/primitives/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';

import useAudioPlayer from '@/lib/client-only/stores/audioPlayerStore';
import { usePlaylistsStore } from '@/lib/client-only/stores/playlistsStore';
import type { Album } from '@/lib/types/music';
import { cn } from '@/lib/utils';

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
}

export function AlbumCard({ album, onClick }: AlbumCardProps) {
  const { formatYear } = useFormat();
  const [isLiked, setIsLiked] = React.useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = React.useState(false);
  const { playlists, addSongToPlaylist } = usePlaylistsStore();
  const { reproduceAlbum } = useAudioPlayer();

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    console.log('Album tracks:', album.tracks);
    console.log('Playlist ID:', playlistId);

    if (album.tracks && album.tracks.length > 0) {
      const trackIds = album.tracks.map((track) => (typeof track === 'string' ? track : track.id));
      console.log('Track IDs to add:', trackIds);

      const selectedPlaylist = playlists.find((p) => p.id === playlistId);
      console.log('Selected playlist:', selectedPlaylist);

      if (selectedPlaylist) {
        addSongToPlaylist(selectedPlaylist, trackIds)
          .then(() => {
            console.log('Canciones añadidas exitosamente');
          })
          .catch((error) => {
            console.error('Error al añadir canciones:', error);
          });
      } else {
        console.error('No se encontró la playlist seleccionada');
      }
    } else {
      console.log('No hay canciones en el álbum para añadir');
    }
    setIsAddToPlaylistOpen(false);
  };

  return (
    <>
      <Card
        className="group cursor-pointer hover:shadow-lg transition-all duration-200"
        onClick={onClick}
      >
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            {album.cover ? (
              <img
                src={album.cover}
                alt={album.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Music className="h-16 w-16 text-primary/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="sm"
                className="rounded-full h-12 w-12 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  reproduceAlbum(
                    album.tracks.map((track) => (typeof track === 'string' ? track : track.id))
                  );
                }}
              >
                <Play className="h-5 w-5 ml-0.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg truncate cursor-pointer hover:underline">
              {album.name}
            </h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => setIsAddToPlaylistOpen(true)}>
                  Añadir a playlist
                </DropdownMenuItem>
                <DropdownMenuItem>Ver artista</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-sm text-muted-foreground mb-3 truncate">
            {album.artists.map((artist) => artist.name).join(', ')}
          </p>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>{album.releaseDate ? formatYear(album.releaseDate) : 'Fecha desconocida'}</span>
              <span>{album.totalTracks} canciones</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 w-8 p-0',
                isLiked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
              onClick={handleLikeToggle}
            >
              <Heart className={cn('h-4 w-4', isLiked && 'fill-red-500 text-red-500')} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddToPlaylistDrawer
        open={isAddToPlaylistOpen}
        onOpenChange={setIsAddToPlaylistOpen}
        playlists={playlists}
        onAddToPlaylist={handleAddToPlaylist}
      />
    </>
  );
}
