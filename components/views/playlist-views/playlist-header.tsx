import { useFormat } from '@/hooks/use-format';
import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/components/primitives/badge';
import { Button } from '@/components/primitives/button';

import { Track } from '@/lib/types/music';

interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  coverStyle?: React.CSSProperties;
  trackCount: number;
  duration: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  tracks: Track[];
  isOwner: boolean;
}

interface PlaylistHeaderProps {
  playlist: Playlist;
  onBack: () => void;
}

export function PlaylistHeader({ playlist, onBack }: PlaylistHeaderProps) {
  const { formatDuration, formatDate } = useFormat();
  const totalDuration = playlist.tracks.reduce((acc, track) => acc + track.duration, 0);

  return (
    <div className="relative">
      <div className="bg-gradient-to-b from-primary/20 to-background p-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a Playlists
        </Button>

        <div className="flex items-end gap-6">
          <div className="relative">
            {playlist.coverUrl ? (
              <img
                src={playlist.coverUrl}
                alt={playlist.name}
                className="w-48 h-48 rounded-lg shadow-xl object-cover"
              />
            ) : (
              <div
                className="w-48 h-48 rounded-lg shadow-xl flex items-center justify-center"
                style={playlist.coverStyle}
              >
                <div className="text-6xl font-bold text-primary/50">
                  {playlist.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Badge variant={playlist.isPublic ? 'default' : 'secondary'} className="mb-2">
              {playlist.isPublic ? 'Playlist Pública' : 'Playlist Privada'}
            </Badge>
            <h1 className="text-5xl font-bold mb-4 break-words">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-lg text-muted-foreground mb-4">{playlist.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{playlist.tracks.length} canciones</span>
              <span>•</span>
              <span>{formatDuration(totalDuration)}</span>
              <span>•</span>
              <span>Actualizada {formatDate(playlist.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
