import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Track } from '@/lib/types/music';

interface RecentlyPlayedState {
  tracks: Track[];
  addTrack: (track: Track) => void;
  clearTracks: () => void;
}

export const useRecentlyPlayedStore = create<RecentlyPlayedState>()(
  persist(
    (set) => ({
      tracks: [],
      addTrack: (track) =>
        set((state) => {
          // Eliminar la canción si ya existe para evitar duplicados
          const filteredTracks = state.tracks.filter((t) => t.id !== track.id);
          // Añadir la nueva canción al principio
          const newTracks = [track, ...filteredTracks];
          // Mantener solo las últimas 10 canciones
          return { tracks: newTracks.slice(0, 10) };
        }),
      clearTracks: () => set({ tracks: [] }),
    }),
    {
      name: 'recently-played',
    }
  )
);
