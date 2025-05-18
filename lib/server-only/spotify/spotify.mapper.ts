import { SimplifiedTrack, SpotifyTrack } from './spotify.types';

function mapSpotifyTrack(track: SpotifyTrack): SimplifiedTrack {
  return {
    id: track.id,
    name: track.name,
    artist: track.artists.map(artist => artist.name).join(', '),
    album: track.album.name,
    image: track.album.images.length > 0 ? track.album.images[0].url : null,
    url: track.external_urls.spotify,
    previewUrl: track.preview_url,
    popularity: track.popularity,
  };
}

export { mapSpotifyTrack };
