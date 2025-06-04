'use client';

import {
  DiscAlbum,
  Heart,
  Library,
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
import React from 'react';

import { AddToPlaylistDrawer } from '@/components/drawers/add-to-playlist';
import { Button } from '@/components/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';
import { Slider } from '@/components/primitives/slider';

import { usePlaylistsStore } from '@/lib/client-only/stores/playlistsStore';
import useAudioPlayer from '@/lib/client-only/stores/audioPlayerStore';
import { cn } from '@/lib/utils';
import { getTracks } from '@/lib/server-only/tracks/tracks.service';

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

  useEffect(() => {
    const loadInitialQueue = async () => {
      const initialQueue = await getTracks();
      useAudioPlayer.getState().setQueue(initialQueue);
      useAudioPlayer.getState().play(initialQueue[0]);
    };

    loadInitialQueue();
  }, []);

  // Añadir estado para controlar el drawer
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = React.useState(false);

  // Función para manejar la adición a playlist
  const handleAddToPlaylist = async (playlistId: string) => {
    if (!currentSong) return;

    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;

    try {
      await usePlaylistsStore.getState().addSongToPlaylist(playlist, currentSong.id);
      setIsAddToPlaylistOpen(false);
    } catch (error) {
      console.error('Error al añadir canción a la playlist:', error);
    }
  };

  const { playlists } = usePlaylistsStore();

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
            <DropdownMenuItem
              onClick={() => setIsAddToPlaylistOpen(true)}
              className="flex gap-1 items-center"
            >
              <Library className="h-4 w-4" />
              Añadir a playlist
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-1 items-center">
              <DiscAlbum className="h-4 w-4" />
              Ver álbum
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Añadir el Drawer */}
        <AddToPlaylistDrawer
          open={isAddToPlaylistOpen}
          onOpenChange={setIsAddToPlaylistOpen}
          playlists={playlists}
          onAddToPlaylist={handleAddToPlaylist}
        />
      </div>
    </div>
  );
}
