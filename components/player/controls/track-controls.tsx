'use client';

import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';

import { Button } from '@/components/primitives/button';

import useAudioPlayer from '@/lib/client-only/stores/audioPlayerStore';
import { cn } from '@/lib/utils';

interface PlayerControlsProps {
  isPlaying: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
}

export function PlayerControls({
  isPlaying,
  isShuffled,
  repeatMode,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onShuffle}
        className={cn('h-8 w-8', isShuffled && 'text-primary')}
      >
        <Shuffle className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="sm" className="h-8 w-8" onClick={onPrevious}>
        <SkipBack className="h-4 w-4" />
      </Button>

      <Button
        onClick={onPlayPause}
        size="sm"
        className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
        )}
      </Button>

      <Button variant="ghost" size="sm" className="h-8 w-8" onClick={onNext}>
        <SkipForward className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onRepeat}
        className={cn('h-8 w-8', repeatMode !== 'off' && 'text-primary')}
      >
        <Repeat className="h-4 w-4" />
      </Button>
    </div>
  );
}
