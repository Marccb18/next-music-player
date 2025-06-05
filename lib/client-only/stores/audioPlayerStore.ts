import { Howl } from 'howler';
import { create } from 'zustand';

import { getTracks, getTracksByIds } from '@/lib/server-only/tracks/tracks.service';

export interface Song {
  id: string;
  name: string;
  spotifyId: string;
  artists: { id: string; name: string }[];
  album?: { id: string; name: string };
  duration: number;
  trackNumber: number;
  isExplicit: boolean;
  image?: string;
  audioUrl?: string;
  fileName?: string;
}

interface AudioPlayerState {
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  repeatMode: 'off' | 'all' | 'one';
  isShuffled: boolean;
  progress: number;
  duration: number;
  howl: Howl | null;
  shouldAutoPlay: boolean;
}

interface AudioPlayerActions {
  setQueue: (queue: Song[]) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (song: Song) => void;
  clearQueue: () => void;
  play: (song?: Song) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setRepeatMode: (mode: 'off' | 'all' | 'one') => void;
  reproduceAlbum: (tracks: Song[] | string[]) => void;
  reproduceShuffleAlbum: (tracks: Song[] | string[]) => void;
  toggleShuffle: () => void;
  seek: (time: number) => void;
}

const useAudioPlayer = create<AudioPlayerState & AudioPlayerActions>((set, get) => ({
  currentSong: null,
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  volume: 1,
  repeatMode: 'off',
  isShuffled: false,
  progress: 0,
  duration: 0,
  howl: null,
  shouldAutoPlay: false,

  setQueue: (queue) => set({ queue }),

  addToQueue: (song) =>
    set((state) => ({
      queue: [...state.queue, song],
    })),

  removeFromQueue: (song) =>
    set((state) => {
      const newQueue = state.queue.filter((s) => s.id !== song.id);
      const newIndex =
        state.currentIndex >= newQueue.length ? newQueue.length - 1 : state.currentIndex;
      return {
        queue: newQueue,
        currentIndex: newIndex,
        currentSong: newQueue[newIndex] || null,
      };
    }),

  clearQueue: () =>
    set({
      queue: [],
      currentSong: null,
      currentIndex: -1,
      howl: null,
      shouldAutoPlay: false,
    }),

  play: (song) => {
    const state = get();

    // Si no se proporciona una canción, intentar reproducir la actual
    if (!song && state.currentSong) {
      song = state.currentSong;
    }

    if (song) {
      // Detener la reproducción actual si existe
      if (state.howl) {
        state.howl.stop();
        state.howl.unload();
      }

      // Crear nuevo Howl
      const howl = new Howl({
        src: [song.audioUrl || ''],
        html5: true,
        volume: state.volume,
        onload: () => {
          set({ duration: howl.duration() });
          // Solo reproducir automáticamente si shouldAutoPlay es true
          if (state.shouldAutoPlay) {
            howl.play();
          }
        },
        onplay: () => {
          set({ isPlaying: true });
          // Iniciar el seguimiento del progreso
          const updateProgress = () => {
            if (howl.playing()) {
              set({ progress: howl.seek() });
              requestAnimationFrame(updateProgress);
            }
          };
          requestAnimationFrame(updateProgress);
        },
        onpause: () => set({ isPlaying: false }),
        onstop: () => set({ isPlaying: false, progress: 0 }),
        onend: () => {
          const { repeatMode, queue, currentIndex } = get();
          if (repeatMode === 'one') {
            howl.play();
          } else if (repeatMode === 'all' && currentIndex === queue.length - 1) {
            set({ currentIndex: 0 });
            get().play(queue[0]);
          } else if (currentIndex < queue.length - 1) {
            get().next();
          }
        },
        onloaderror: (id, error) => {
          console.error('Error loading audio:', error);
        },
        onplayerror: (id, error) => {
          console.error('Error playing audio:', error);
          // Intentar reproducir de nuevo
          howl.once('unlock', () => {
            howl.play();
          });
        },
      });

      // Encontrar el índice de la canción en la cola
      const index = state.queue.findIndex((s) => s.id === song.id);
      set({
        currentSong: song,
        currentIndex: index,
        howl,
      });
    }
  },

  pause: () => {
    const { howl } = get();
    if (howl) {
      howl.pause();
    }
  },

  resume: () => {
    const { howl, currentSong } = get();
    if (howl) {
      howl.play();
    } else if (currentSong) {
      set({ shouldAutoPlay: true });
      get().play(currentSong);
    }
  },

  next: () => {
    const state = get();
    if (state.queue.length === 0) return;

    let nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.queue.length) {
      if (state.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return;
      }
    }

    const nextSong = state.queue[nextIndex];
    if (nextSong) {
      set({ shouldAutoPlay: true });
      get().play(nextSong);
    }
  },

  previous: () => {
    const state = get();
    if (state.queue.length === 0) return;

    // Si estamos en los primeros segundos de la canción actual, ir a la anterior
    const currentTime = state.howl?.seek() || 0;
    if (currentTime > 3) {
      // Si estamos más allá de los 3 segundos, reiniciar la canción actual
      if (state.howl) {
        state.howl.seek(0);
        state.howl.play();
      }
      return;
    }

    // Calcular el índice de la canción anterior
    let prevIndex = state.currentIndex - 1;

    // Manejar el caso cuando estamos en la primera canción
    if (prevIndex < 0) {
      if (state.repeatMode === 'all') {
        prevIndex = state.queue.length - 1;
      } else {
        // Si no estamos en modo repetición y estamos en la primera canción,
        // simplemente reiniciamos la canción actual
        if (state.howl) {
          state.howl.seek(0);
          state.howl.play();
        }
        return;
      }
    }

    // Obtener la canción anterior
    const prevSong = state.queue[prevIndex];
    if (!prevSong) return;

    // Detener la reproducción actual si existe
    if (state.howl) {
      state.howl.stop();
      state.howl.unload();
    }

    // Actualizar el estado y reproducir la nueva canción
    set({
      currentSong: prevSong,
      currentIndex: prevIndex,
      shouldAutoPlay: true,
      howl: null, // Forzar la creación de un nuevo Howl
    });

    // Crear y reproducir la nueva canción
    const howl = new Howl({
      src: [prevSong.audioUrl || ''],
      html5: true,
      volume: state.volume,
      onload: () => {
        set({ duration: howl.duration() });
        howl.play();
      },
      onplay: () => {
        set({ isPlaying: true });
        const updateProgress = () => {
          if (howl.playing()) {
            set({ progress: howl.seek() });
            requestAnimationFrame(updateProgress);
          }
        };
        requestAnimationFrame(updateProgress);
      },
      onpause: () => set({ isPlaying: false }),
      onstop: () => set({ isPlaying: false, progress: 0 }),
      onend: () => {
        const { repeatMode, queue, currentIndex } = get();
        if (repeatMode === 'one') {
          howl.play();
        } else if (repeatMode === 'all' && currentIndex === queue.length - 1) {
          set({ currentIndex: 0 });
          get().play(queue[0]);
        } else if (currentIndex < queue.length - 1) {
          get().next();
        }
      },
    });

    set({ howl });
  },

  setVolume: (volume) => {
    const { howl } = get();
    if (howl) {
      howl.volume(volume);
    }
    set({ volume });
  },

  setRepeatMode: (mode) => set({ repeatMode: mode }),

  toggleShuffle: () =>
    set((state) => {
      if (!state.isShuffled) {
        const originalQueue = [...state.queue];
        const shuffledQueue = [...state.queue].sort(() => Math.random() - 0.5);
        return {
          queue: shuffledQueue,
          isShuffled: true,
        };
      } else {
        return {
          queue: state.queue.sort((a, b) => a.trackNumber - b.trackNumber),
          isShuffled: false,
        };
      }
    }),

  reproduceAlbum: async (tracks: Song[] | string[]) => {
    if (Array.isArray(tracks) && tracks.length > 0 && typeof tracks[0] === 'string') {
      const loadedTracks = await getTracksByIds(tracks as string[]);
      set({ queue: loadedTracks as Song[], shouldAutoPlay: true });
      get().play(loadedTracks[0] as Song);
      return;
    }
    set({ queue: tracks as Song[], shouldAutoPlay: true });
    get().play(tracks[0] as Song);
  },

  reproduceShuffleAlbum: async (tracks: Song[] | string[]) => {
    if (Array.isArray(tracks) && tracks.length > 0 && typeof tracks[0] === 'string') {
      const loadedTracks = await getTracksByIds(tracks as string[]);
      set({ queue: loadedTracks as Song[], shouldAutoPlay: true, isShuffled: true });
      // Mezclar la cola antes de reproducir
      get().toggleShuffle();
      get().play(loadedTracks[0] as Song);
      return;
    }
    set({ queue: tracks as Song[], shouldAutoPlay: true, isShuffled: true });
    // Mezclar la cola antes de reproducir
    get().toggleShuffle();
    get().toggleShuffle();
    get().play(get().queue[0] as Song);
  },

  seek: (time) => {
    const { howl } = get();
    if (howl) {
      howl.seek(time);
      set({ progress: time });
    }
  },
}));

export default useAudioPlayer;
