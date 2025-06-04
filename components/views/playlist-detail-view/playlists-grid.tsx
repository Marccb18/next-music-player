import { Playlist } from '@/lib/types/playlist';

import { PlaylistCard } from './playlist-card';

interface PlaylistsGridProps {
  playlists: Playlist[];
  onEdit: (playlist: Playlist) => void;
  onDelete: (playlist: Playlist) => void;
}

export function PlaylistsGrid({ playlists, onEdit, onDelete }: PlaylistsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
