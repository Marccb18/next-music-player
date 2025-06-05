'use client';

import { useFormat } from '@/hooks/use-format';
import {
  ArrowLeft,
  Download,
  Heart,
  ListMusic,
  MoreHorizontal,
  Music,
  Pause,
  Play,
  Search,
  Share,
  Shuffle,
} from 'lucide-react';

import * as React from 'react';

import { Badge } from '@/components/primitives/badge';
import { Button } from '@/components/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';
import { EmptyState } from '@/components/primitives/empty-state';
import { Input } from '@/components/primitives/input';
import { TrackList } from '@/components/views/albums-views/track-list';

import useAudioPlayer from '@/lib/client-only/stores/audioPlayerStore';
import type { Album, Track } from '@/lib/types/music';
import { cn } from '@/lib/utils';

interface AlbumDetailViewProps {
  album: Album;
  onBack: () => void;
}

export function AlbumDetailView({ album, onBack }: AlbumDetailViewProps) {
  const { formatDuration, formatDate } = useFormat();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLiked, setIsLiked] = React.useState(false);
  const { reproduceAlbum, reproduceShuffleAlbum, queue, play, pause, isPlaying } = useAudioPlayer();
  const filteredTracks = React.useMemo(() => {
    return album.tracks.filter(
      (track) =>
        track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artists.some((artist: { id: string; name: string }) =>
          artist.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [album.tracks, searchQuery]);

  const totalDuration = album.tracks.reduce((acc, track) => acc + track.duration, 0);

  return (
    <div className="flex-1">
      <div className="relative">
        <div className="relative h-[600px]">
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {album.cover ? (
              <img
                src={album.cover}
                alt={album.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10" />
            )}
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/5 to-transparent" />
          <div className="absolute bottom-16 left-0 p-6 w-full">
            <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2 text-white">
              <ArrowLeft className="h-4 w-4" />
              Volver a Álbumes
            </Button>

            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="relative">
                {album.cover ? (
                  <img
                    src={album.cover}
                    alt={album.name}
                    className="w-48 h-48 rounded-lg shadow-xl object-cover"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-lg shadow-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <Music className="h-16 w-16 text-primary/40" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Badge variant="outline" className="mb-2 bg-white/10 border-white/20 text-white">
                  {album.type === 'album' ? 'Álbum' : album.type === 'single' ? 'Single' : 'EP'}
                </Badge>
                <h1 className="text-5xl font-bold mb-4 break-words text-white">{album.name}</h1>
                <div className="flex items-center gap-2 mb-4 text-white/80">
                  {album.artists.map((artist, index) => (
                    <React.Fragment key={artist.id}>
                      <span className="font-medium">{artist.name}</span>
                      {index < album.artists.length - 1 && <span>,</span>}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span>{formatDate(album.releaseDate)}</span>
                  <span>•</span>
                  <span>{album.totalTracks} canciones</span>
                  <span>•</span>
                  <span>{formatDuration(totalDuration)}</span>
                  {album.genres.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{album.genres.join(', ')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="rounded-full h-14 w-14"
              onClick={() => {
                if (queue === album.tracks && isPlaying) {
                  pause();
                } else {
                  reproduceAlbum(album.tracks);
                }
              }}
            >
              {isPlaying && queue === album.tracks ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => reproduceShuffleAlbum(album.tracks)}
            >
              <Shuffle className="h-4 w-4" />
              Aleatorio
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setIsLiked(!isLiked)}
              className={cn(isLiked && 'text-red-500')}
            >
              <Heart className={cn('h-5 w-5', isLiked && 'fill-red-500')} />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="lg">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ListMusic className="h-4 w-4 mr-2" />
                Añadir a playlist
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Descargar álbum
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Compartir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="px-6 py-4">
        {album.tracks.length > 0 && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en este álbum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        )}
        {album.tracks.length === 0 ? (
          <EmptyState
            icon={<Music className="h-12 w-12 text-muted-foreground" />}
            title="No hay canciones disponibles"
            description="Este álbum no tiene canciones disponibles en este momento."
            actionLabel="Explorar otros álbumes"
            onAction={onBack}
          />
        ) : filteredTracks.length === 0 ? (
          <EmptyState
            icon={<Search className="h-12 w-12 text-muted-foreground" />}
            title="No se encontraron canciones"
            description={`No hay canciones que coincidan con "${searchQuery}"`}
            actionLabel="Limpiar búsqueda"
            onAction={() => setSearchQuery('')}
          />
        ) : (
          <TrackList tracks={filteredTracks} />
        )}
      </div>
    </div>
  );
}
