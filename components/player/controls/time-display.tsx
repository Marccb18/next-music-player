'use client';

import useAudioPlayer from '@/lib/client-only/stores/audioPlayerStore';

interface TimeDisplayProps {
  time: number;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function TimeDisplay({ time }: TimeDisplayProps) {
  return <span className="text-xs text-muted-foreground tabular-nums">{formatTime(time)}</span>;
}
