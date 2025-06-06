import { useFormat } from '@/hooks/useFormat';
import { Clock, Music, Plus, Search } from 'lucide-react';

import { Button } from '@/components/primitives/button';

import { Track } from '@/lib/types/music';

interface PlaylistTrackListProps {
  tracks: Track[];
  searchQuery: string;
  onClearSearch: () => void;
  onTrackClick: (track: Track) => void;
}

export function PlaylistTrackList({
  tracks,
  searchQuery,
  onClearSearch,
  onTrackClick,
}: PlaylistTrackListProps) {
  const { formatTime } = useFormat();

  console.log(tracks);

  if (tracks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
          <Plus className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Tu playlist está vacía</h2>
        <p className="text-muted-foreground mb-6">
          Añade canciones a tu playlist para empezar a disfrutar de tu música favorita.
        </p>
      </div>
    );
  }

  if (searchQuery && tracks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
          <Search className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">No se encontraron canciones</h2>
        <p className="text-muted-foreground mb-6">
          No hay canciones que coincidan con "{searchQuery}"
        </p>
        <Button variant="outline" onClick={onClearSearch}>
          Limpiar búsqueda
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 text-sm text-muted-foreground border-b">
        <div className="w-8">#</div>
        <div>Título</div>
        <div>Álbum</div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
        </div>
        <div className="w-8"></div>
      </div>

      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 hover:bg-muted/50 rounded-lg group cursor-pointer items-center justify-center"
          onClick={() => onTrackClick(track)}
        >
          <div className="w-8 text-muted-foreground">{index + 1}</div>
          <div className="flex items-center gap-3">
            {track.image ? (
              <img src={track.image} alt={track.name} className="w-10 h-10 rounded object-cover" />
            ) : (
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                <Music className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <div className="font-medium">{track.name}</div>
              <div className="text-sm text-muted-foreground">
                {track.artists?.map((a) => a.name).join(', ')}
              </div>
            </div>
          </div>
          <div className="text-muted-foreground">{track.album?.name}</div>
          <div className="text-muted-foreground">{formatTime(track.duration)}</div>
          <div className="w-8"></div>
        </div>
      ))}
    </div>
  );
}
