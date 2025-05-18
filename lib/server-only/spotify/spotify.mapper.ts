import { SimplifiedTrack, SpotifyTrack } from './spotify.types';

function mapSpotifyTrack(track: SpotifyTrack): SimplifiedTrack {
  if (!track || !track.artists || !track.album) {
    throw new Error('Invalid track data');
  }

  return {
    id: track.id,
    name: track.name,
    artist: track.artists[0]?.name || 'Unknown Artist',
    collaborators: track.artists.slice(1).map((artist) => artist.name),
    album: track.album.name || 'Unknown Album',
    image: track.album.images?.[0]?.url || null,
    url: track.external_urls?.spotify || '',
    duration: track.duration_ms || 0,
    spotifyId: track.id,
    trackNumber: track.track_number || 0,
    isExplicit: track.explicit || false,
    albumId: track.album.id,
    albumReleaseDate: track.album.release_date || '',
    albumType: track.album.album_type || 'album',
    artistIds: track.artists.map((artist) => artist.id),
    isPlayable: track.is_playable ?? true,
    previewUrl: track.preview_url,
    popularity: track.popularity || 0,
  };
}

export { mapSpotifyTrack };
