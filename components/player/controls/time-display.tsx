'use client';

import useAudioPlayer from '@/lib/services/audio-player';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function TimeDisplay() {
  const { progress, duration } = useAudioPlayer();

  return (
    <div className="text-sm text-gray-600 dark:text-gray-400">
      {formatTime(progress)} / {formatTime(duration)}
    </div>
  );
}
