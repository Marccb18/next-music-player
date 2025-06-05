import { Music2 } from 'lucide-react';

import { Track } from '@/lib/types/music';

interface SongInfoProps {
  currentSong: Track | null;
}

export function SongInfo({ currentSong }: SongInfoProps) {
  return (
    <div className="flex items-center space-x-3 min-w-0 flex-1">
      <div className="relative">
        {currentSong?.image ? (
          <>
            <img
              src={currentSong.image}
              alt={`${currentSong.name} cover`}
              className="w-12 h-12 rounded-lg object-cover shadow-sm"
            />
            <div className="absolute inset-0 bg-black/20 rounded-lg" />
          </>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100 shadow-sm flex items-center justify-center">
            <Music2 className="h-4 w-4 text-black" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-sm truncate">{currentSong?.name || 'Unknown Title'}</h3>
        <p className="text-xs text-muted-foreground truncate">
          {currentSong?.artists?.[0]?.name || 'Unknown Artist'}
        </p>
      </div>
    </div>
  );
}
