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

interface PlayerOptionsProps {
  currentSong: Track | null;
  onAddToPlaylist: () => void;
}

export function PlayerOptions({
  currentSong,
  onAddToPlaylist,
}: PlayerOptionsProps) {
  const router = useRouter();

  const handleViewAlbum = () => {
    if (!currentSong?.album?.id) return;
    router.push(`/albums/${currentSong.album.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={onAddToPlaylist}
          className="flex gap-1 items-center"
        >
          <Library className="h-4 w-4" />
          Añadir a playlist
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-1 items-center"
          onClick={handleViewAlbum}
        >
          <DiscAlbum className="h-4 w-4" />
          Ver álbum
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
