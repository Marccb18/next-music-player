'use server';

import axios from 'axios';

import { SpotifySearchResponse, SpotifyTrack } from './spotify.types';

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

async function searchSpotifySong(titulo: string, artista: string): Promise<SpotifyTrack[] | null> {
  try {
    const token = await getAccessToken();

    const query = `track:"${titulo}" artist:"${artista}"`;

    const response = await axios.get<SpotifySearchResponse>('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'track',
        limit: 5,
      },
    });

    return response.data.tracks.items;
  } catch (error) {
    console.error('Error en la búsqueda exacta de Spotify:', error);
    return null;
  }
}

export { searchSpotifySong };
