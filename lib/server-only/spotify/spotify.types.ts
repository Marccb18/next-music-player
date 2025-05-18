interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface SpotifyAlbum {
  album_type: string;
  artists: SpotifyArtist[];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Array<{
    height: number;
    width: number;
    url: string;
  }>;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

interface SimplifiedTrack {
  id: string;
  name: string;
  artist: string;
  collaborators: string[];
  album: string;
  image: string | null;
  url: string;
  duration: number;
  spotifyId: string;
  trackNumber: number;
  isExplicit: boolean;
  albumId: string;
  albumReleaseDate: string;
  albumType: string;
  artistIds: string[];
  isPlayable: boolean;
  previewUrl: string | null;
  popularity: number;
}

export type { SpotifyTrack, SpotifySearchResponse, SimplifiedTrack, SpotifyAlbum, SpotifyArtist };
