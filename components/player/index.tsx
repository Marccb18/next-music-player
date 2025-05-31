'use client';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useMediaStore } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import { useEffect, useRef } from 'react';
import { PlayButton } from './controls/play-button';
import { ProgressBar } from './controls/progress-bar';
import { TimeDisplay } from './controls/time-display';
import { VolumeControl } from './controls/volume-control';
import type { MediaPlayerInstance } from '@vidstack/react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
}

export function AudioPlayer({ src, title, artist }: AudioPlayerProps) {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const mediaStore = useMediaStore(playerRef);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <MediaPlayer
        className="w-full "
        title={title}
        src={src}
        ref={playerRef}
      >
        <MediaProvider>
          <audio preload="none" src={src} />
        </MediaProvider>

        <div className="flex flex-col gap-2">
          {/* Información de la canción */}
          <div className="text-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{artist}</p>
          </div>

          {/* Controles personalizados */}
          <div className="flex items-center gap-4 px-4">
            <PlayButton />
            <ProgressBar />
            <TimeDisplay />
            <VolumeControl />
          </div>
        </div>
      </MediaPlayer>
    </div>
  );
}
