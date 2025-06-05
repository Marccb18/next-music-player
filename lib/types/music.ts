
import { Release } from '@/lib/mongo/models/Releases';

export type Track = {
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
};

export type Album = {
  id: string;
  name: string;
  spotifyId: string;
  artists: { id: string; name: string }[];
  cover: string | null;
  tracks: Track[];
  releaseDate: Date;
  type: 'album' | 'single' | 'ep';
  totalTracks: number;
  popularity: number;
  genres: string[];
};

export type Release = {
  id: string;
  name: string;
  cover: string;
  releaseDate: Date;
  artists: any[];
  totalTracks?: number;
  totalDuration?: number;
  type?: string;
  tracks: string[] | Track[];
};

export type Artist = {
  id: string;
  name: string;
  spotifyId: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  genres: string[];
  popularity: number;
  type: 'artist' | 'group';
};
