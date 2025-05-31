'use client';

import { useMediaStore } from '@vidstack/react';
import { useMediaRemote } from '@vidstack/react';
import { Pause, Play } from 'lucide-react';

import { Button } from '@/components/primitives/button';

export function PlayButton() {
  const { playing } = useMediaStore();
  const remote = useMediaRemote();

  return (
    <Button
      onClick={() => remote.togglePaused()}
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label={playing ? 'Pausar' : 'Reproducir'}
    >
      {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
    </Button>
  );
}
