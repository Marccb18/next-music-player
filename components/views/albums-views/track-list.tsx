'use client';

import { useFormat } from '@/hooks/useFormat';
import { Heart, ListPlus, MoreHorizontal, Play, Plus } from 'lucide-react';

import * as React from 'react';

import { AddToPlaylistDrawer } from '@/components/drawers/add-to-playlist';
import { Button } from '@/components/primitives/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/primitives/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';

import useAudioPlayer from '@/lib/client-only/stores/audioPlayerStore';
import { usePlaylistsStore } from '@/lib/client-only/stores/playlistsStore';
import { cn } from '@/lib/utils';

interface TrackListProps {
  tracks: any[];
}

export function TrackList({ tracks }: TrackListProps) {
  const { formatTime } = useFormat();
  const [hoveredTrack, setHoveredTrack] = React.useState<string | null>(null);
  const [likedTracks, setLikedTracks] = React.useState<Record<string, boolean>>(
    tracks.reduce((acc, track) => ({ ...acc, [track._id]: false }), {})
  );
  const [selectedTrack, setSelectedTrack] = React.useState<any | null>(null);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = React.useState(false);

  const { play, addToQueue } = useAudioPlayer();
  const { playlists, addSongToPlaylist } = usePlaylistsStore();

  const toggleLike = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    setLikedTracks((prev) => ({ ...prev, [trackId]: !prev[trackId] }));
  };

  const handlePlayNow = (track: any) => {
    play(track);
  };

  const handleAddToQueue = (track: any) => {
    addToQueue(track);
  };

  const handleAddToPlaylist = (track: any) => {
    setSelectedTrack(track);
    setIsAddToPlaylistOpen(true);
  };

  const onAddToPlaylist = async (playlistId: string) => {
    if (selectedTrack) {
      await addSongToPlaylist(playlists.find((p) => p.id === playlistId)!, selectedTrack.id);
      setIsAddToPlaylistOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-1 p-2">
        {tracks.map((track) => (
          <ContextMenu key={track.id}>
            <ContextMenuTrigger>
              <div
                className={cn(
                  'flex items-center justify-center gap-3 p-2 rounded-md hover:bg-muted/50 group transition-colors',
                  hoveredTrack === track.id && 'bg-muted/50'
                )}
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
              >
                <div className="relative h-10 w-10 rounded overflow-hidden">
                  <img
                    src={track.image || '/placeholder.svg?height=40&width=40'}
                    alt={track.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 opacity-0 hover:bg-transparent group-hover:opacity-100 transition-opacity"
                      onClick={() => handlePlayNow(track)}
                    >
                      <Play className="h-4 w-4 ml-0.5 text-white" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{track.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {track.artists.map((artist: any) => artist.name).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatTime(track.duration)}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={(e) => toggleLike(e, track._id)}
                  >
                    <Heart
                      className={cn(
                        'h-4 w-4',
                        likedTracks[track._id] && 'fill-red-500 text-red-500'
                      )}
                    />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePlayNow(track)}>
                        <Play className="h-4 w-4 mr-2" />
                        Reproducir ahora
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddToQueue(track)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Añadir a la cola
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleAddToPlaylist(track)}>
                        <ListPlus className="h-4 w-4 mr-2" />
                        Añadir a playlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => handlePlayNow(track)}>
                <Play className="h-4 w-4 mr-2" />
                Reproducir ahora
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleAddToQueue(track)}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir a la cola
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => handleAddToPlaylist(track)}>
                <ListPlus className="h-4 w-4 mr-2" />
                Añadir a playlist
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>

      <AddToPlaylistDrawer
        open={isAddToPlaylistOpen}
        onOpenChange={setIsAddToPlaylistOpen}
        playlists={playlists}
        onAddToPlaylist={onAddToPlaylist}
      />
    </>
  );
}
