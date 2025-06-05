import { create } from 'zustand';

import {
  addSongToPlaylist as addSongToPlaylistServer,
  createPlaylist as createPlaylistServer,
  deletePlaylist as deletePlaylistServer,
  getPlaylists,
  removeSongFromPlaylist as removeSongFromPlaylistServer,
  updatePlaylist as updatePlaylistServer,
} from '@/lib/server-only/playlists/playlists.service';
import { Track } from '@/lib/types/music';

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
    track: Track;
    position: number;
    addedAt: Date;
  }>;
};

type PlaylistsState = {
  // STATE
  playlists: Playlist[];

  // ACTIONS
  setPlaylists: (playlists: Playlist[]) => void;
  addSongToPlaylist: (playlist: Playlist, trackIds: string | string[]) => Promise<void>;
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

  addSongToPlaylist: async (playlist, trackIds) => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) {
      console.error('No hay usuario autenticado');
      return;
    }

    try {
      const updatedPlaylist = await addSongToPlaylistServer(userId, playlist.id, trackIds);
      if (!updatedPlaylist) {
        throw new Error('No se pudo añadir la(s) canción(es) a la playlist');
      }

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

      console.log('Playlist actualizada exitosamente:', updatedPlaylist);
    } catch (error) {
      console.error('Error al añadir canción(es) a la playlist:', error);
      // Recargar playlists del servidor para revertir cambios
      get().loadPlaylists();
    }
  },

  removeSongFromPlaylist: async (playlist, trackId) => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;

    try {
      const updatedPlaylist = await removeSongFromPlaylistServer(userId, playlist.id, trackId);
      if (!updatedPlaylist) {
        throw new Error('No se pudo eliminar la canción de la playlist');
      }

      set((state) => ({
        playlists: state.playlists.map((p) => {
          if (p.id === playlist.id) {
            return {
              ...p,
              songs: updatedPlaylist.songs,
              totalSongs: updatedPlaylist.totalSongs,
            };
          }
          return p;
        }),
      }));

      console.log('Canción eliminada exitosamente de la playlist');
    } catch (error) {
      console.error('Error al eliminar canción de la playlist:', error);
      // Recargar playlists del servidor para revertir cambios
      get().loadPlaylists();
    }
  },

  createPlaylist: async (playlist) => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) return;

    try {
      const createdPlaylist = await createPlaylistServer(
        userId,
        playlist.name,
        playlist.description
      );

      set((state) => ({
        playlists: [
          ...state.playlists,
          {
            ...createdPlaylist,
            id: createdPlaylist.id || createdPlaylist._id,
          },
        ],
      }));
    } catch (error) {
      console.error('Error creating playlist:', error);
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
      get().loadPlaylists();
    }
  },

  getPlaylists: () => get().playlists,
}));
