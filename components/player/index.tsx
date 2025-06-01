'use client';

import {
  Heart,
  MoreHorizontal,
  Music,
  Music2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { useEffect } from 'react';

import { Button } from '@/components/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';
import { Slider } from '@/components/primitives/slider';

import useAudioPlayer from '@/lib/services/audio-player';
import { cn } from '@/lib/utils';

import { QueueSheet } from './controls/queue-sheet';

interface AudioPlayerProps {
  className?: string;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function AudioPlayer({ className }: AudioPlayerProps) {
  const {
    currentSong,
    isPlaying,
    volume,
    repeatMode,
    isShuffled,
    progress,
    duration,
    play,
    pause,
    resume,
    next,
    previous,
    setVolume,
    setRepeatMode,
    toggleShuffle,
    seek,
  } = useAudioPlayer();

  // Inicializar la cola con algunas canciones de prueba
  useEffect(() => {
    const initialQueue = [
      {
        id: '68339536d009874ae756522f',
        title: 'TURBO // Epifanía',
        spotifyId: '04UsuCGu6llkgOldCUCgZo',
        artist: 'CRUZ CAFUNÉ',
        album: 'Me Muevo con Dios',
        image: 'https://i.scdn.co/image/ab67616d0000b2734102f96ba4b1df4dfe8bc35f',
        duration: 0,
        url: 'https://next-music-player.s3.eu-west-3.amazonaws.com/tracks/7yvmtCjHcBe9DqIVl7AwQT/CRUZ CAFUNÉ - TURBO __ Epifanía [1Gug_Ezff0M].mp3',
        trackNumber: 1,
        discNumber: 1,
      },
      {
        id: 'asdfasdfasdf123',
        title: 'Dios #1 ft. MIKY WOODZ (Visualizer)',
        spotifyId: '5xP4rmVm5frtwOPwbmZNQw',
        artist: 'CRUZ CAFUNÉ',
        album: 'Me Muevo con Dios',
        image: 'https://i.scdn.co/image/ab67616d0000b2734102f96ba4b1df4dfe8bc35f',
        duration: 0,
        url: 'https://next-music-player.s3.eu-west-3.amazonaws.com/tracks/7yvmtCjHcBe9DqIVl7AwQT/CRUZ+CAFUN%C3%89+-+Fabiola+(Visualizer)+%5BtpX36GCFrPw%5D.mp3',
        trackNumber: 2,
        discNumber: 1,
      },
    ];

    useAudioPlayer.getState().setQueue(initialQueue);
    useAudioPlayer.getState().play(initialQueue[0]);
  }, []);

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b',
        className
      )}
    >
      {/* Información de la canción */}
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div className="relative">
          {currentSong?.image ? (
            <>
              <img
                src={currentSong.image}
                alt={`${currentSong.title} cover`}
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
          <h3 className="font-medium text-sm truncate">{currentSong?.title || 'Unknown Title'}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {currentSong?.artist || 'Unknown Artist'}
          </p>
        </div>
      </div>

      {/* Controles centrales */}
      <div className="flex flex-col items-center space-y-2 flex-1 max-w-md mx-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleShuffle}
            className={cn('h-8 w-8', isShuffled && 'text-primary')}
          >
            <Shuffle className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" className="h-8 w-8" onClick={previous}>
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => (isPlaying ? pause() : resume())}
            size="sm"
            className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
            )}
          </Button>

          <Button variant="ghost" size="sm" className="h-8 w-8" onClick={next}>
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
              const currentIndex = modes.indexOf(repeatMode);
              setRepeatMode(modes[(currentIndex + 1) % modes.length]);
            }}
            className={cn('h-8 w-8', repeatMode !== 'off' && 'text-primary')}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        {/* Barra de progreso */}
        <div className="flex items-center space-x-2 w-full">
          <span className="text-xs text-muted-foreground tabular-nums">{formatTime(progress)}</span>
          <Slider
            value={[progress]}
            max={duration}
            step={0.1}
            className="flex-1"
            onValueChange={(value) => seek(value[0])}
          />
          <span className="text-xs text-muted-foreground tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controles de volumen y opciones */}
      <div className="flex items-center space-x-2 flex-1 justify-end">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVolume(volume === 0 ? 1 : 0)}
            className="h-8 w-8"
          >
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={[volume]}
            max={1}
            step={0.1}
            className="w-20"
            onValueChange={(value) => setVolume(value[0])}
          />
        </div>
        <QueueSheet />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Añadir a playlist</DropdownMenuItem>
            <DropdownMenuItem>Ver álbum</DropdownMenuItem>
            <DropdownMenuItem>Compartir</DropdownMenuItem>
            <DropdownMenuItem>Mostrar letra</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
