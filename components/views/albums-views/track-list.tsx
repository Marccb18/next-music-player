'use client';

import * as React from 'react';
import { Clock, Heart, MoreHorizontal, Play } from 'lucide-react';

import { Button } from '@/components/primitives/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/primitives/dropdown-menu';
import { cn } from '@/lib/utils';
import { useFormat } from '@/hooks/use-format';

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

  const toggleLike = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    setLikedTracks((prev) => ({ ...prev, [trackId]: !prev[trackId] }));
  };

  return (
    <div className="space-y-1 p-2">
      {tracks.map((track) => (
        <div
          key={track._id}
          className={cn(
            'flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 group transition-colors',
            hoveredTrack === track._id && 'bg-muted/50'
          )}
          onMouseEnter={() => setHoveredTrack(track._id)}
          onMouseLeave={() => setHoveredTrack(null)}
        >
          <div className="relative h-10 w-10 rounded overflow-hidden">
            <img
              src={track.album?.cover || "/placeholder.svg?height=40&width=40"}
              alt={track.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play className="h-4 w-4 ml-0.5" />
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
            <span className="text-xs text-muted-foreground">{formatTime(track.duration)}</span>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => toggleLike(e, track._id)}>
              <Heart className={cn("h-4 w-4", likedTracks[track._id] && "fill-red-500 text-red-500")} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
