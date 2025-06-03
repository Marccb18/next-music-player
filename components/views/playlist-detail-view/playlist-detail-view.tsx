'use client';

import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Edit3,
  Heart,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Share,
  Shuffle,
  Trash2,
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
import { Input } from '@/components/primitives/input';

import { getPlaylistDetails } from '@/lib/server-only/playlists/playlists.service';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  name: string;
  duration: number;
  image?: string;
  album?: { name: string; cover?: string };
  artists?: { name: string }[];
  isLiked?: boolean;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  coverStyle?: React.CSSProperties;
  trackCount: number;
  duration: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  tracks: Track[];
  isOwner: boolean;
}

interface PlaylistDetailViewProps {
  playlist: Playlist;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PlaylistDetailView({
  playlist,
  onBack,
  onEdit,
  onDelete,
}: PlaylistDetailViewProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const filteredTracks = playlist.tracks.filter((track) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (track.name?.toLowerCase() || '').includes(searchLower) ||
      (
        track.artists
          ?.map((a) => a.name)
          .join(', ')
          .toLowerCase() || ''
      ).includes(searchLower) ||
      (track.album?.name?.toLowerCase() || '').includes(searchLower)
    );
  });

  const totalDuration = playlist.tracks.reduce((acc, track) => acc + track.duration, 0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="flex-1">
      {/* Header con información de la playlist */}
      <div className="relative">
        <div className="bg-gradient-to-b from-primary/20 to-background p-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Playlists
          </Button>

          <div className="flex items-end gap-6">
            <div className="relative">
              {playlist.coverUrl ? (
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-48 h-48 rounded-lg shadow-xl object-cover"
                />
              ) : (
                <div
                  className="w-48 h-48 rounded-lg shadow-xl flex items-center justify-center"
                  style={playlist.coverStyle}
                >
                  <div className="text-6xl font-bold text-primary/50">
                    {playlist.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Badge variant={playlist.isPublic ? 'default' : 'secondary'} className="mb-2">
                {playlist.isPublic ? 'Playlist Pública' : 'Playlist Privada'}
              </Badge>
              <h1 className="text-5xl font-bold mb-4 break-words">{playlist.name}</h1>
              {playlist.description && (
                <p className="text-lg text-muted-foreground mb-4">{playlist.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{playlist.tracks.length} canciones</span>
                <span>•</span>
                <span>{formatDuration(totalDuration)}</span>
                <span>•</span>
                <span>Actualizada {playlist.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de la playlist */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="rounded-full h-14 w-14"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={playlist.tracks.length === 0}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              disabled={playlist.tracks.length === 0}
            >
              <Shuffle className="h-4 w-4" />
              Aleatorio
            </Button>
            <Button variant="ghost" size="lg">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="lg">
              <Share className="h-5 w-5" />
            </Button>
          </div>

          {playlist.isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="lg">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar detalles
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir canciones
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar playlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Lista de canciones */}
      <div className="px-6 py-4">
        {playlist.tracks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Tu playlist está vacía</h2>
            <p className="text-muted-foreground mb-6">
              {playlist.isOwner
                ? 'Añade canciones a tu playlist para empezar a disfrutar de tu música favorita.'
                : 'Esta playlist aún no tiene canciones.'}
            </p>
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No se encontraron canciones</h2>
            <p className="text-muted-foreground mb-6">
              No hay canciones que coincidan con "{searchQuery}"
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Limpiar búsqueda
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Header de la tabla */}
            <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 text-sm text-muted-foreground border-b">
              <div className="w-6">#</div>
              <div>Título</div>
              <div>Álbum</div>
              <div className="w-6"></div>
              <div className="w-12 text-right">
                <Clock className="h-4 w-4 ml-auto" />
              </div>
            </div>

            {/* Lista de canciones */}
            {filteredTracks.map((track, index) => (
              <div
                key={track.id}
                className="group grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 rounded-md hover:bg-muted/50 cursor-pointer"
              >
                <div className="w-6 flex items-center justify-center text-sm text-muted-foreground group-hover:hidden">
                  {index + 1}
                </div>
                <div className="w-6 hidden group-hover:flex items-center justify-center">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Play className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={track.image || '/placeholder.svg'}
                    alt={track.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{track.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artists?.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground truncate">{track.album?.name}</p>
                </div>

                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'h-6 w-6 p-0 opacity-0 group-hover:opacity-100',
                      track.isLiked && 'opacity-100'
                    )}
                  >
                    <Heart
                      className={cn('h-4 w-4', track.isLiked && 'fill-red-500 text-red-500')}
                    />
                  </Button>
                </div>

                <div className="flex items-center justify-end">
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {formatTime(track.duration)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
