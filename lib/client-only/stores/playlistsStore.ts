import { create } from 'zustand';

import {
  addSongToPlaylist as addSongToPlaylistServer,
  createPlaylist as createPlaylistServer,
  deletePlaylist as deletePlaylistServer,
  getPlaylists,
  updatePlaylist as updatePlaylistServer,
} from '@/lib/server-only/playlists/playlists.service';

import { useUserStore } from './userStore';

type Playlist = {
  id: string;
  name: string;
  description: string;
  covers: string[];
  isPublic: boolean;
  totalDuration: number;
  totalSongs: number;
  songs?: Array<{
    track: string;
    position: number;
    addedAt: Date;
  }>;
};

type PlaylistsState = {
  // STATE
  playlists: Playlist[];

  // ACTIONS
  setPlaylists: (playlists: Playlist[]) => void;
  addSongToPlaylist: (playlist: Playlist, trackId: string) => Promise<void>;
  removeSongFromPlaylist: (playlist: Playlist, trackId: string) => Promise<void>;
  createPlaylist: (playlist: Omit<Playlist, 'id'>) => Promise<void>;
  updatePlaylist: (playlist: Playlist) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  getPlaylists: () => Playlist[];
  loadPlaylists: () => Promise<void>;
};

export const usePlaylistsStore = create<PlaylistsState>()((set, get) => ({
  playlists: [],

  setPlaylists: (playlists) => set({ playlists }),

  loadPlaylists: async () => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;

    const playlists = await getPlaylists(userId);
    set({ playlists });
  },

  addSongToPlaylist: async (playlist, trackId) => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;

    try {
      const updatedPlaylist = await addSongToPlaylistServer(userId, playlist.id, trackId);
      if (!updatedPlaylist) throw new Error('No se pudo añadir la canción a la playlist');

      set((state) => ({
        playlists: state.playlists.map((p) => {
          if (p.id === playlist.id) {
            return {
              ...p,
              songs: updatedPlaylist.songs,
              totalSongs: updatedPlaylist.totalSongs,
              totalDuration: updatedPlaylist.totalDuration,
            };
          }
          return p;
        }),
      }));
    } catch (error) {
      console.error('Error al añadir canción a la playlist:', error);
      // Recargar playlists del servidor para revertir cambios
      get().loadPlaylists();
    }
  },

  removeSongFromPlaylist: async (playlist, trackId) => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;

    set((state) => ({
      playlists: state.playlists.map((p) => {
        if (p.id === playlist.id) {
          const updatedSongs = p.songs?.filter((s) => s.track !== trackId) || [];
          return {
            ...p,
            songs: updatedSongs,
            totalSongs: updatedSongs.length,
          };
        }
        return p;
      }),
    }));

    // TODO: Implementar actualización en servidor
  },

  createPlaylist: async (playlist) => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;

    try {
      // Llama al backend para crear la playlist y espera la respuesta
      const createdPlaylist = await createPlaylistServer(userId, playlist.name, playlist.description);

      // Añade la playlist devuelta por el backend al estado local
      set((state) => ({
        playlists: [...state.playlists, {
          ...createdPlaylist,
          // Si el backend devuelve _id, pero tu frontend espera id:
          id: createdPlaylist.id || createdPlaylist._id,
        }],
      }));
    } catch (error) {
      console.error('Error creating playlist:', error);
      // Aquí podrías mostrar un mensaje de error si quieres
    }
  },

  updatePlaylist: async (playlist) => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;

    set((state) => ({
      playlists: state.playlists.map((p) => (p.id === playlist.id ? playlist : p)),
    }));

    try {
      await updatePlaylistServer(userId, playlist.id, playlist.name, playlist.description);
    } catch (error) {
      console.error('Error updating playlist:', error);
      // Recargar playlists del servidor para revertir cambios
      get().loadPlaylists();
    }
  },

  deletePlaylist: async (playlistId) => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;

    set((state) => ({
      playlists: state.playlists.filter((p) => p.id !== playlistId),
    }));

    try {
      await deletePlaylistServer(userId, playlistId);
    } catch (error) {
      console.error('Error deleting playlist:', error);
      // Recargar playlists del servidor para revertir cambios
      get().loadPlaylists();
    }
  },

  getPlaylists: () => get().playlists,
}));
