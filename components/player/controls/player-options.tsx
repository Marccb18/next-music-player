import { DiscAlbum, Library, MoreHorizontal } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';

import { Track } from '@/lib/types/music';
import { Playlist } from '@/lib/types/playlist';

interface PlayerOptionsProps {
  currentSong: Track | null;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string) => void;
  isAddToPlaylistOpen: boolean;
  setIsAddToPlaylistOpen: (open: boolean) => void;
}

export function PlayerOptions({
  currentSong,
  setIsAddToPlaylistOpen,
}: PlayerOptionsProps) {
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setIsAddToPlaylistOpen(true)}
            className="flex gap-1 items-center"
          >
            <Library className="h-4 w-4" />
            Añadir a playlist
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-1 items-center"
            onClick={() => {
              router.push(`/albums/${currentSong?.album?.id}`);
            }}
          >
            <DiscAlbum className="h-4 w-4" />
            Ver álbum
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
