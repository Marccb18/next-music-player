import { ListMusic, Play } from 'lucide-react';

import Image from 'next/image';

import { Button } from '@/components/primitives/button';
import { ScrollArea } from '@/components/primitives/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/primitives/sheet';

import useAudioPlayer from '@/lib/client-only/stores/audioPlayerStore';
import { cn } from '@/lib/utils';

export function QueueSheet() {
  const { queue, currentSong, play } = useAudioPlayer();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <ListMusic className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[600px]">
        <SheetHeader className="mb-4">
          <SheetTitle>Cola de reproducción</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className=" flex flex-col gap-2">
            {queue.map((song) => (
              <Button
                key={song.id}
                variant="ghost"
                className={cn(
                  'w-full justify-start grid grid-cols-[auto_1fr_auto] gap-4 p-2 px-3 h-auto hover:bg-accent',
                  currentSong?.id === song.id ? 'bg-gray-100' : 'bg-gray-50'
                )}
                onClick={() => {
                  play(song);
                }}
              >
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                  <Image src={song.image || ''} alt={song.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                  <span className="font-medium line-clamp-1 text-ellipsis overflow-hidden w-full">
                    {song.name}
                  </span>
                  <span className="text-sm text-muted-foreground line-clamp-1 text-ellipsis overflow-hidden w-full">
                    {song.artists?.[0]?.name}
                  </span>
                </div>
                {currentSong?.id === song.id && (
                  <div className="flex-shrink-0 ml-2">
                    <Play className="h-4 w-4 text-primary" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
