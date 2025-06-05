'use client';

import { useEffect } from 'react';
import React from 'react';

import { AddToPlaylistDrawer } from '@/components/drawers/add-to-playlist';
import { Slider } from '@/components/primitives/slider';

import useAudioPlayer from '@/lib/client-only/stores/audioPlayerStore';
import { usePlaylistsStore } from '@/lib/client-only/stores/playlistsStore';
import { getTracks } from '@/lib/server-only/tracks/tracks.service';
import { cn } from '@/lib/utils';

import { PlayerOptions } from './controls/player-options';
import { QueueSheet } from './controls/queue-sheet';
import { SongInfo } from './controls/song-info';
import { TimeDisplay } from './controls/time-display';
import { PlayerControls } from './controls/track-controls';
import { VolumeControls } from './controls/volume-controls';

interface AudioPlayerProps {
  className?: string;
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

  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = React.useState(false);
  const { playlists } = usePlaylistsStore();

  useEffect(() => {
    const loadInitialQueue = async () => {
      const initialQueue = await getTracks();
      useAudioPlayer.getState().setQueue(initialQueue);
      useAudioPlayer.getState().play(initialQueue[0]);
    };

    loadInitialQueue();
  }, []);

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

  useEffect(() => {
    console.log('currentSong', currentSong);
  }, [currentSong]);

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b',
        className
      )}
    >
      <SongInfo currentSong={currentSong} />

      <div className="flex flex-col items-center space-y-2 flex-1 max-w-md mx-8">
        <PlayerControls
          isPlaying={isPlaying}
          isShuffled={isShuffled}
          repeatMode={repeatMode}
          onPlayPause={() => (isPlaying ? pause() : resume())}
          onPrevious={previous}
          onNext={next}
          onShuffle={toggleShuffle}
          onRepeat={() => {
            const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
            const currentIndex = modes.indexOf(repeatMode);
            setRepeatMode(modes[(currentIndex + 1) % modes.length]);
          }}
        />

        <div className="flex items-center space-x-2 w-full">
          <TimeDisplay time={progress} />
          <Slider
            value={[progress]}
            max={duration}
            step={0.1}
            className="flex-1"
            onValueChange={(value) => seek(value[0])}
          />
          <TimeDisplay time={duration} />
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-1 justify-end">
        <VolumeControls volume={volume} setVolume={setVolume} />
        <QueueSheet />
        <PlayerOptions
          currentSong={currentSong}
          onAddToPlaylist={() => setIsAddToPlaylistOpen(true)}
          isAddToPlaylistOpen={isAddToPlaylistOpen}
          setIsAddToPlaylistOpen={setIsAddToPlaylistOpen}
        />

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
