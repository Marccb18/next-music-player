'use client';

import { useMediaStore } from '@vidstack/react';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function TimeDisplay() {
  const { currentTime, duration } = useMediaStore();

  return (
    <div className="text-sm text-gray-600 dark:text-gray-400">
      {formatTime(currentTime)} / {formatTime(duration)}
    </div>
  );
}
