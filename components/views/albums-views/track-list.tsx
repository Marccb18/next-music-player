'use client';

import { useFormat } from '@/hooks/use-format';
import { Clock, Heart, MoreHorizontal, Play } from 'lucide-react';
import { Library } from 'lucide-react';

import * as React from 'react';

import { AddToPlaylistDrawer } from '@/components/drawers/add-to-playlist';
import { Button } from '@/components/primitives/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/primitives/context-menu';

import { usePlaylistsStore } from '@/lib/client-only/stores/playlistsStore';
import type { Track } from '@/lib/types/music';
import { cn } from '@/lib/utils';

interface TrackListProps {
  tracks: Track[];
}

export function TrackList({ tracks }: TrackListProps) {
  const { formatTime } = useFormat();
  const [hoveredTrack, setHoveredTrack] = React.useState<string | null>(null);
  const [likedTracks, setLikedTracks] = React.useState<Record<string, boolean>>(
    tracks.reduce((acc, track) => ({ ...acc, [track.id]: false }), {})
  );
  const [selectedTrack, setSelectedTrack] = React.useState<Track | null>(null);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = React.useState(false);
  const { playlists, addSongToPlaylist } = usePlaylistsStore();

  const handleLikeToggle = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedTracks((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));
  };

  const handleAddToPlaylist = (playlistId: string) => {
    if (selectedTrack) {
      addSongToPlaylist(playlists.find((p) => p.id === playlistId)!, selectedTrack.id);
      setIsAddToPlaylistOpen(false);
    }
  };

  return (
    <div className="space-y-1">
      {/* Header de la tabla */}
      <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 text-sm text-muted-foreground border-b">
        <div className="w-6">#</div>
        <div>Título</div>
        <div className="w-6"></div>
        <div className="w-12 text-right">
          <Clock className="h-4 w-4 ml-auto" />
        </div>
      </div>

      {/* Lista de canciones */}
      {tracks.map((track) => (
        <ContextMenu key={track.id}>
          <ContextMenuTrigger>
            <div
              className="group grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 rounded-md hover:bg-muted/50 cursor-pointer"
              onMouseEnter={() => setHoveredTrack(track.id)}
              onMouseLeave={() => setHoveredTrack(null)}
            >
              <div className="w-6 flex items-center justify-center text-sm text-muted-foreground">
                {hoveredTrack === track.id ? (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Play className="h-3 w-3" />
                  </Button>
                ) : (
                  track.trackNumber
                )}
              </div>

              <div className="flex items-center min-w-0">
                <div className="min-w-0">
                  <p className="font-medium truncate">{track.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {track.artists.map((artist) => artist.name).join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-6 w-6 p-0',
                    likedTracks[track.id] ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  )}
                  onClick={(e) => handleLikeToggle(track.id, e)}
                >
                  <Heart
                    className={cn('h-4 w-4', likedTracks[track.id] && 'fill-red-500 text-red-500')}
                  />
                </Button>
              </div>

              <div className="flex items-center justify-end">
                <span className="text-sm text-muted-foreground tabular-nums">
                  {formatTime(track.duration)}
                </span>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => {
                setSelectedTrack(track);
                setIsAddToPlaylistOpen(true);
              }}
            >
              <Library className="h-4 w-4 mr-2" />
              Añadir a playlist
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}

      <AddToPlaylistDrawer
        open={isAddToPlaylistOpen}
        onOpenChange={setIsAddToPlaylistOpen}
        playlists={playlists}
        onAddToPlaylist={handleAddToPlaylist}
      />
    </div>
  );
}
