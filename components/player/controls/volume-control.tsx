'use client';

import { useMediaStore } from '@vidstack/react';
import { useMediaRemote } from '@vidstack/react';
import { Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/primitives/button';
import { Slider } from '@/components/primitives/slider';

export function VolumeControl() {
  const { volume, muted } = useMediaStore();
  const remote = useMediaRemote();

  const handleVolumeChange = (value: number[]) => {
    remote.changeVolume(value[0]);
  };

  const toggleMute = () => {
    remote.toggleMuted();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={toggleMute}
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label={muted ? 'Activar sonido' : 'Silenciar'}
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>
      <Slider
        defaultValue={[volume]}
        max={1}
        step={0.1}
        onValueChange={handleVolumeChange}
        className="w-24"
      />
    </div>
  );
}
