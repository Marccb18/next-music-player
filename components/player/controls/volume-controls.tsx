import { Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/primitives/button';
import { Slider } from '@/components/primitives/slider';

interface VolumeControlsProps {
  volume: number;
  setVolume: (volume: number) => void;
}

export function VolumeControls({ volume, setVolume }: VolumeControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setVolume(volume === 0 ? 1 : 0)}
        className="h-8 w-8"
      >
        {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      <Slider
        value={[volume]}
        max={1}
        step={0.1}
        className="w-20"
        onValueChange={(value) => setVolume(value[0])}
      />
    </div>
  );
}
