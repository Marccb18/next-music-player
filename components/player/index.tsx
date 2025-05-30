'use client';

import {
  MediaPlayer,
  MediaProvider,
  useMediaPlayer,
  useMediaRemote,
} from '@vidstack/react';

import { useState } from 'react';
import { Button } from '../primitives/button';
import { usePlayerStore } from '@/lib/client-only/stores/playerStore';

// Sample tracks data
const tracks = [
  {
    id: 1,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    cover: '/placeholder.svg?height=60&width=60',
    src: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
  },
  {
    id: 2,
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    cover: '/placeholder.svg?height=60&width=60',
    src: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
  },
  {
    id: 3,
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    album: 'Starboy',
    cover: '/placeholder.svg?height=60&width=60',
    src: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
  },
];

function PlayerControls({ setCurrentTrackIndex }: { setCurrentTrackIndex: (index: number) => void }) {
  const player = useMediaPlayer();
  const playerRef = useMediaRemote();
  const { setPlayerRef } = usePlayerStore();
  setPlayerRef(playerRef);
  return (
    <div className="flex gap-2">
      <Button onClick={() => player?.play()}>Play</Button>
      <Button onClick={() => player?.pause()}>Pause</Button>
      <Button onClick={() => setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)}>Next</Button>
    </div>
  );
}

export default function Player() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500/80 dark:bg-gray-950/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <MediaPlayer
          className="flex items-center justify-between w-full h-16"
          src={currentTrack.src}
          load="eager"
          title={currentTrack.title}
          aria-label={currentTrack.title}
          artist={currentTrack.artist}
          preload='auto'
          streamType='on-demand'
          viewType='audio'
          onAudioTrackChange={(track) => {
            console.log(track);
          }}
          logLevel='debug'
        >
          <MediaProvider>
            <audio />
          </MediaProvider>
          <PlayerControls setCurrentTrackIndex={setCurrentTrackIndex} />
        </MediaPlayer>
      </div>
    </div>
  );
}