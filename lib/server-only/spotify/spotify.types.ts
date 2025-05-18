interface SpotifyTrack {
  name: string;
  id: string;
  uri: string;
  preview_url: string | null;
  popularity: number;
  external_urls: {
    spotify: string;
  };
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  artists: { name: string }[];
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
  album: string;
  image: string | null;
  url: string;
  previewUrl: string | null;
  popularity: number;
}


export type { SpotifyTrack, SpotifySearchResponse, SimplifiedTrack };
