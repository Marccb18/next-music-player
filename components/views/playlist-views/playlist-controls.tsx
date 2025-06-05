import { Edit3, Heart, MoreHorizontal, Pause, Play, Share, Shuffle, Trash2 } from 'lucide-react';

import { Button } from '@/components/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';

import { Track } from '@/lib/types/music';

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  isOwner: boolean;
}

interface PlaylistControlsProps {
  playlist: Playlist;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onShuffle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PlaylistControls({
  playlist,
  isPlaying,
  onPlay,
  onPause,
  onShuffle,
  onEdit,
  onDelete,
}: PlaylistControlsProps) {
  return (
    <div className="px-6 py-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            className="rounded-full h-14 w-14"
            onClick={isPlaying ? onPause : onPlay}
            disabled={playlist.tracks.length === 0}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={onShuffle}
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
  );
}
