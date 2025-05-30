import { MediaRemoteControl } from '@vidstack/react';
import { create } from 'zustand';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
}

interface PlayerState {
  // Estado del reproductor
  isPlaying: boolean;
  currentTrack: Track | null
  queue: Track[];
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
  playerRef: MediaRemoteControl | null;

  // Acciones del reproductor
  setPlayerRef: (ref: MediaRemoteControl | null) => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seek: (time: number) => void;
  setTrack: (track: Track) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // Estado inicial
  isPlaying: false,
  currentTrack: null,
  queue: [],
  volume: 1,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  isShuffle: false,
  repeatMode: 'none',
  playerRef: null,

  // Acciones
  setPlayerRef: (ref) => set({ playerRef: ref }),

  play: () => {
    const { playerRef } = get();
    if (playerRef) {
      playerRef.play();
      set({ isPlaying: true });
    }
  },

  pause: () => {
    const { playerRef } = get();
    if (playerRef) {
      playerRef.pause();
      set({ isPlaying: false });
    }
  },

  setVolume: (volume) => {
    const { playerRef } = get();
    if (playerRef) {
      playerRef.changeVolume(volume);
    }
    set({ volume });
  },

  toggleMute: () => {
    const { playerRef, isMuted } = get();
    if (playerRef) {
      playerRef.toggleMuted();
      set({ isMuted: !isMuted });
    }
  },

  seek: (time) => {
    const { playerRef } = get();
    if (playerRef) {
      playerRef.seek(time);
      set({ currentTime: time });
    }
  },

  setTrack: (track) => {
    const { playerRef } = get();
    if (playerRef) {
      // Actualizamos el estado primero
      set({ currentTrack: track, currentTime: 0 });
      // Luego intentamos reproducir
      playerRef.play();
    }
  },

  addToQueue: (track) => {
    set((state) => ({
      queue: [...state.queue, track],
    }));
  },

  removeFromQueue: (trackId) => {
    set((state) => ({
      queue: state.queue.filter((track) => track.id !== trackId),
    }));
  },

  clearQueue: () => {
    set({ queue: [] });
  },

  toggleShuffle: () => {
    set((state) => ({ isShuffle: !state.isShuffle }));
  },

  setRepeatMode: (mode) => {
    set({ repeatMode: mode });
  },

  nextTrack: () => {
    const { currentTrack, queue, isShuffle, repeatMode } = get();
    if (!currentTrack || queue.length === 0) return;

    if (repeatMode === 'one') {
      get().setTrack(currentTrack);
      return;
    }

    const currentIndex = queue.findIndex((track) => track.id === currentTrack.id);
    let nextIndex: number;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }

    get().setTrack(queue[nextIndex]);
  },

  previousTrack: () => {
    const { currentTrack, queue, isShuffle, repeatMode } = get();
    if (!currentTrack || queue.length === 0) return;

    if (repeatMode === 'one') {
      get().setTrack(currentTrack);
      return;
    }

    const currentIndex = queue.findIndex((track) => track.id === currentTrack.id);
    let previousIndex: number;

    if (isShuffle) {
      previousIndex = Math.floor(Math.random() * queue.length);
    } else {
      previousIndex = (currentIndex - 1 + queue.length) % queue.length;
    }

    get().setTrack(queue[previousIndex]);
  },
}));
