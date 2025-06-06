import { Play } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import useAudioPlayer from '@/lib/client-only/stores/audioPlayerStore';
import { Album, Track } from '@/lib/types/music';

interface MusicCardProps {
  item: Album | Track;
  type: 'album' | 'track';
}

export function MusicCard({ item, type }: MusicCardProps) {
  const { reproduceAlbum, play, clearQueue, pause } = useAudioPlayer();

  const handlePlay = () => {
    if (type === 'album') {
      reproduceAlbum((item as Album).tracks);
    } else {
      pause();
      clearQueue();
      play(item as Track);
    }
  };

  const getImage = () => {
    if (type === 'album') {
      return (item as Album).cover;
    }
    return (item as Track).image;
  };

  const getName = () => {
    return item.name;
  };

  const getArtists = () => {
    return item.artists.map((artist) => artist.name).join(', ');
  };

  return (
    <div className="w-[160px] shrink-0 space-y-3 group">
      <div className="relative aspect-square overflow-hidden rounded-md">
        <img
          src={getImage() || '/placeholder.svg?height=160&width=160'}
          alt={getName()}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <Button
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handlePlay}
          >
            <Play className="h-5 w-5 ml-0.5" />
          </Button>
        </div>
      </div>
      <div>
        <h3 className="font-medium truncate">{getName()}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {getArtists()}
        </p>
      </div>
    </div>
  );
} 