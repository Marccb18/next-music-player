export interface SpotifyTrack {
  id: string;
  name: string;
  duration: string;
  trackNumber: number;
}

export interface SpotifyRelease {
  id: string;
  name: string;
  artist: string;
  image: string;
  releaseDate: string;
  tracks: SpotifyTrack[];
  totalTracks: number;
  albumType: string;
}

export interface TrackFile {
  trackId: string;
  file: File | null;
}
