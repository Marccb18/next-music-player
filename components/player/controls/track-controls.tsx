'use client';

import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';

import { Button } from '@/components/primitives/button';

import useAudioPlayer from '@/lib/client-only/stores/audioPlayerStore';

export function TrackControls() {
  const { isPlaying, next, previous, pause, resume } = useAudioPlayer();

  return (
    <div className="flex items-center gap-2">
      <Button onClick={previous} variant="ghost" size="icon" className="rounded-full">
        <SkipBack className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => (isPlaying ? pause() : resume())}
        variant="ghost"
        size="icon"
        className="rounded-full"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </Button>

      <Button onClick={next} variant="ghost" size="icon" className="rounded-full">
        <SkipForward className="w-5 h-5" />
      </Button>
    </div>
  );
}
