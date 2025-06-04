import { Clock, Edit3, Globe, Lock, MoreHorizontal, Music, Play, Trash2 } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { Badge } from '@/components/primitives/badge';
import { Button } from '@/components/primitives/button';
import { Card, CardContent, CardHeader } from '@/components/primitives/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';

import { Playlist } from '@/lib/types/playlist';

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit: (playlist: Playlist) => void;
  onDelete: (playlist: Playlist) => void;
}

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export function PlaylistCard({ playlist, onEdit, onDelete }: PlaylistCardProps) {
  const router = useRouter();

  const handlePlaylistClick = () => {
    router.push(`/library/playlist/${playlist.id}`);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="p-0">
        <div
          className="relative aspect-square overflow-hidden rounded-t-lg cursor-pointer"
          onClick={handlePlaylistClick}
        >
          {playlist.covers.length > 0 && playlist.covers[0]?.startsWith('linear-gradient') ? (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: playlist.covers[0] }}
            >
              <Music className="h-16 w-16 text-primary/40" />
            </div>
          ) : playlist.covers.length > 0 ? (
            <img
              src={playlist.covers[0] || '/placeholder.svg'}
              alt={playlist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Music className="h-16 w-16 text-primary/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button size="sm" className="rounded-full h-12 w-12 shadow-lg">
              <Play className="h-5 w-5 ml-0.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3
            className="font-semibold text-lg truncate cursor-pointer"
            onClick={handlePlaylistClick}
          >
            {playlist.name}
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlaylistClick();
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                Reproducir
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(playlist);
                }}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(playlist);
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {playlist.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{playlist.description}</p>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Music className="h-3 w-3" />
              {playlist.totalSongs}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(playlist.totalDuration)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {playlist.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            <Badge variant={playlist.isPublic ? 'default' : 'secondary'} className="text-xs">
              {playlist.isPublic ? 'Pública' : 'Privada'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
