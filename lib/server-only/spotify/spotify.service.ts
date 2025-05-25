'use server';

import axios from 'axios';

import { SpotifyAlbumWithTracks, SpotifySearchResponse, SpotifyTrack } from './spotify.types';

const SPOTIFY_CLIENT_ID = process.env.NEXT_PRIVATE_SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.NEXT_PRIVATE_SPOTIFY_CLIENT_SECRET!;

async function getAccessToken(): Promise<string> {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const headers = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
    },
  };

  const response = await axios.post('https://accounts.spotify.com/api/token', params, headers);
  return response.data.access_token;
}

async function getArtistId(nombreArtista: string, token: string): Promise<string | null> {
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: nombreArtista,
      type: 'artist',
      limit: 1,
      market: 'ES',
    },
  });

  const artist = response.data.artists.items[0];
  return artist?.id || null;
}

async function getFullAlbum(albumId: string, token: string): Promise<SpotifyAlbumWithTracks> {
  const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      market: 'ES',
    },
  });

  return {
    id: response.data.id,
    name: response.data.name,
    artists: response.data.artists,
    images: response.data.images,
    release_date: response.data.release_date,
    total_tracks: response.data.total_tracks,
    album_type: response.data.album_type,
    tracks: response.data.tracks.items,
  };
}

async function searchSpotifyAlbumBySong(
  titulo: string,
  artista: string
): Promise<SpotifyAlbumWithTracks | null> {
  try {
    const token = await getAccessToken();
    const artistId = await getArtistId(artista, token);
    if (!artistId) return null;

    const query = `track:${titulo} artist:${artista}`;
    const response = await axios.get<SpotifySearchResponse>('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'track',
        limit: 5,
        market: 'ES',
      },
    });

    const filteredTracks = response.data.tracks.items.filter((track) =>
      track.artists.some((a) => a.id === artistId)
    );

    if (filteredTracks.length === 0) return null;

    const albumId = filteredTracks[0].album.id;

    const albumWithTracks = await getFullAlbum(albumId, token);

    return albumWithTracks;
  } catch (error) {
    console.error('Error en la búsqueda completa de álbum:', error);
    return null;
  }
}

export { searchSpotifyAlbumBySong };
