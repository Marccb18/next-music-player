'use client';

import { useMediaStore } from '@vidstack/react';
import { useMediaRemote } from '@vidstack/react';

import { Slider } from '@/components/primitives/slider';

export function ProgressBar() {
  const { currentTime, duration } = useMediaStore();
  const remote = useMediaRemote();

  const handleSeek = (value: number[]) => {
    remote.seek(value[0]);
  };

  return (
    <div className="flex-1">
      <Slider
        defaultValue={[currentTime]}
        max={duration}
        step={0.1}
        onValueChange={handleSeek}
        className="w-full"
      />
    </div>
  );
}
