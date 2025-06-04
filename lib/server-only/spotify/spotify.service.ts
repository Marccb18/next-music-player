'use server';

import axios from 'axios';
import mongoose from 'mongoose';

import { SpotifyRelease } from '@/components/upload-song-process/types';

import connectMongo from '@/lib/mongo';
import { Artists } from '@/lib/mongo/models/Artists';
import { Genre } from '@/lib/mongo/models/Genres';
import { Release } from '@/lib/mongo/models/Releases';
import { Tracks } from '@/lib/mongo/models/Tracks';

import {
  SpotifyAlbumWithTracks,
  SpotifyArtist,
  SpotifySearchResponse,
  SpotifyTrack,
} from './spotify.types';

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

async function getArtistGenres(artistId: string, token: string): Promise<string[]> {
  const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.genres || [];
}

async function searchSpotifyAlbumBySong(
  titulo: string,
  artista: string
): Promise<SpotifyAlbumWithTracks | null> {
  try {
    const token = await getAccessToken();
    const artistId = await getArtistId(artista, token);
    if (!artistId) return null;

    // Buscar por álbum y artista
    const query = `album:${titulo} artist:${artista}`;
    const response = await axios.get<SpotifySearchResponse>('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'album',
        limit: 1,
        market: 'ES',
      },
    });

    const album = response.data.albums?.items[0];
    if (!album) return null;

    return await getFullAlbum(album.id, token);
  } catch (error) {
    console.error('Error en la búsqueda de álbum:', error);
    return null;
  }
}

interface UploadedTrack {
  trackId: string;
  audioUrl: string;
  fileName: string;
  duration: number;
}

function transformSpotifyReleaseToAlbum(release: SpotifyRelease): SpotifyAlbumWithTracks {
  return {
    id: release.id,
    name: release.name,
    artists: [
      {
        id: release.artistId,
        name: release.artist,
        type: 'artist',
        external_urls: { spotify: '' },
        href: '',
        uri: '',
      },
    ],
    images: [{ url: release.image, height: 300, width: 300 }],
    release_date: release.releaseDate,
    album_type: release.albumType,
    total_tracks: release.totalTracks,
    tracks: release.tracks.map((track) => ({
      id: track.id,
      name: track.name,
      duration_ms: Number(track.duration) || 0,
      track_number: track.trackNumber,
      disc_number: 1,
      explicit: false,
      popularity: 0,
      external_urls: { spotify: `https://open.spotify.com/track/${track.id}` },
      album: {
        id: release.id,
        name: release.name,
        album_type: release.albumType,
        artists: [
          {
            id: release.artistId,
            name: release.artist,
            type: 'artist',
            external_urls: { spotify: '' },
            href: '',
            uri: '',
          },
        ],
        available_markets: [],
        external_urls: { spotify: '' },
        href: '',
        images: [{ url: release.image, height: 300, width: 300 }],
        release_date: release.releaseDate,
        release_date_precision: 'day',
        total_tracks: release.totalTracks,
        type: 'album',
        uri: '',
      },
      artists: [
        {
          id: release.artistId,
          name: release.artist,
          type: 'artist',
          external_urls: { spotify: '' },
          href: '',
          uri: '',
        },
      ],
      available_markets: [],
      external_ids: { isrc: '' },
      href: '',
      is_local: false,
      is_playable: true,
      preview_url: null,
      type: 'track',
      uri: '',
    })),
  };
}

async function getTrackGenres(trackId: string, token: string): Promise<string[]> {
  const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Obtener los géneros de los artistas de la pista
  const artistGenres = await Promise.all(
    response.data.artists.map(async (artist: SpotifyArtist) => {
      const genres = await getArtistGenres(artist.id, token);
      return genres;
    })
  );

  // Combinar y eliminar duplicados
  return [...new Set(artistGenres.flat())];
}

async function createOrUpdateReleaseWithFiles(
  spotifyAlbum: SpotifyAlbumWithTracks | SpotifyRelease,
  uploadedTracks: UploadedTrack[]
) {
  await connectMongo();

  const token = await getAccessToken();
  const album =
    'artists' in spotifyAlbum ? spotifyAlbum : transformSpotifyReleaseToAlbum(spotifyAlbum);

  // 1. Crear o actualizar artistas y obtener sus géneros
  const artistIds = await Promise.all(
    album.artists.map(async (spotifyArtist) => {
      // Buscar artista existente
      let artist = await Artists.findOne({ spotifyId: spotifyArtist.id });

      // Obtener géneros del artista desde Spotify
      const artistGenres = await getArtistGenres(spotifyArtist.id, token);

      // Crear o actualizar géneros
      const genreIds = await Promise.all(
        artistGenres.map(async (genreName) => {
          let genre = await Genre.findOne({ name: genreName });
          if (!genre) {
            try {
              const [newGenre] = await Genre.create([
                {
                  name: genreName,
                  spotifyId: `${spotifyArtist.id}_${genreName}`,
                },
              ]);
              return newGenre.id;
            } catch (error: any) {
              if (error.code === 11000) {
                // Si falla por duplicado, buscar el género existente
                genre = await Genre.findOne({ name: genreName });
                if (genre) return genre.id;
              }
              console.error(`Error al procesar el género ${genreName}:`, error);
              return null;
            }
          }
          return genre.id;
        })
      );

      const validGenreIds = genreIds.filter((id): id is string => id !== null);

      if (!artist) {
        // Crear nuevo artista
        const [newArtist] = await Artists.create([
          {
            name: spotifyArtist.name,
            spotifyId: spotifyArtist.id,
            type: spotifyArtist.type === 'artist' ? 'artist' : 'group',
            images: album.images.map((img) => ({
              url: img.url,
              height: img.height,
              width: img.width,
            })),
            genres: validGenreIds,
          },
        ]);
        return newArtist.id;
      } else {
        // Actualizar artista existente
        await Artists.findOneAndUpdate(
          { spotifyId: spotifyArtist.id },
          {
            $addToSet: {
              genres: { $each: validGenreIds },
            },
          }
        );
        return artist.id;
      }
    })
  );

  // Obtener todos los géneros únicos de los artistas
  const uniqueGenreIds = [
    ...new Set(
      (await Artists.find({ _id: { $in: artistIds } }).select('genres')).flatMap((a) => a.genres)
    ),
  ];

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Crear o actualizar el álbum
    let release = await Release.findOne({ spotifyId: album.id });

    const releaseData = {
      name: album.name,
      spotifyId: album.id,
      artists: artistIds,
      cover: album.images[0]?.url || null,
      releaseDate: new Date(album.release_date),
      type: album.album_type,
      totalTracks: album.total_tracks,
      popularity: 0,
      genres: uniqueGenreIds,
    };

    if (release) {
      release = await Release.findOneAndUpdate(
        { spotifyId: album.id },
        { $set: releaseData },
        { session, new: true }
      );
    } else {
      const [newRelease] = await Release.create([releaseData], { session });
      release = newRelease;
    }

    // 3. Crear o actualizar tracks solo para las canciones subidas
    const trackPromises = album.tracks
      .filter((track) => uploadedTracks.some((ut) => ut.trackId === track.id))
      .map(async (spotifyTrack) => {
        const uploadedTrack = uploadedTracks.find((ut) => ut.trackId === spotifyTrack.id);
        let track = await Tracks.findOne({ spotifyId: spotifyTrack.id });

        // Obtener géneros de la pista
        const trackGenres = await getTrackGenres(spotifyTrack.id, token);

        // Crear o actualizar géneros de la pista
        const trackGenreIds = await Promise.all(
          trackGenres.map(async (genreName) => {
            try {
              let genre = await Genre.findOne({ name: genreName });
              if (!genre) {
                try {
                  const [newGenre] = await Genre.create([
                    {
                      name: genreName,
                      spotifyId: `${spotifyTrack.id}_${genreName}`,
                    },
                  ]);
                  return newGenre.id;
                } catch (error: any) {
                  if (error.code === 11000) {
                    genre = await Genre.findOne({ name: genreName });
                    if (genre) return genre.id;
                  }
                  throw error;
                }
              }
              return genre.id;
            } catch (error) {
              console.error(`Error al procesar el género ${genreName}:`, error);
              return null;
            }
          })
        );

        // Filtrar los IDs nulos
        const validGenreIds = trackGenreIds.filter((id): id is string => id !== null);

        const trackData = {
          name: spotifyTrack.name,
          spotifyId: spotifyTrack.id,
          artists: artistIds,
          album: release.id,
          image: album.images[0]?.url || null,
          url:
            spotifyTrack.external_urls.spotify ||
            `https://open.spotify.com/track/${spotifyTrack.id}`,
          duration: uploadedTrack?.duration || 0,
          trackNumber: spotifyTrack.track_number,
          discNumber: spotifyTrack.disc_number,
          isExplicit: spotifyTrack.explicit,
          popularity: spotifyTrack.popularity,
          audioUrl: uploadedTrack?.audioUrl || '',
          fileName: uploadedTrack?.fileName || '',
          genres: validGenreIds,
        };

        if (track) {
          track = await Tracks.findOneAndUpdate(
            { spotifyId: spotifyTrack.id },
            {
              $set: {
                ...trackData,
                genres: validGenreIds,
              },
            },
            { session, new: true }
          );
          return track.id;
        } else {
          const [newTrack] = await Tracks.create([trackData], { session });

          await Genre.updateMany(
            { _id: { $in: validGenreIds } },
            { $addToSet: { tracks: newTrack.id } },
            { session }
          );

          return newTrack.id;
        }
      });

    const trackIds = await Promise.all(trackPromises);

    // 4. Actualizar el álbum con los IDs de las canciones
    await Release.findOneAndUpdate(
      { spotifyId: album.id },
      { $addToSet: { tracks: { $each: trackIds } } },
      { session }
    );

    // 5. Actualizar los artistas con las referencias al álbum
    await Artists.updateMany(
      { _id: { $in: artistIds } },
      {
        $addToSet: {
          albums: release.id,
        },
      },
      { session }
    );

    await session.commitTransaction();

    // Devolver una versión simplificada del release para evitar referencias circulares
    return {
      id: release.id,
      name: release.name,
      spotifyId: release.spotifyId,
      cover: release.cover,
      type: release.type,
      totalTracks: release.totalTracks,
      tracks: trackIds,
    };
  } catch (error) {
    await session.abortTransaction();
    console.error('Error al crear/actualizar el lanzamiento:', error);
    throw error;
  } finally {
    session.endSession();
  }
}

interface TrackStatus {
  trackId: string;
  spotifyId: string;
  name: string;
  isUploaded: boolean;
  audioUrl?: string;
  fileName?: string;
}

async function getReleaseTracksStatus(spotifyAlbumId: string): Promise<TrackStatus[]> {
  // Asegurar la conexión a MongoDB antes de empezar
  await connectMongo();

  try {
    // 1. Buscar el álbum en nuestra base de datos
    const release = await Release.findOne({ spotifyId: spotifyAlbumId }).populate({
      path: 'tracks',
      select: 'spotifyId name audioUrl fileName',
    });

    if (!release) {
      return [];
    }

    // 2. Mapear el estado de cada canción
    return release.tracks.map((track: any) => ({
      trackId: track._id.toString(),
      spotifyId: track.spotifyId,
      name: track.name,
      isUploaded: Boolean(track.audioUrl && track.fileName),
      audioUrl: track.audioUrl,
      fileName: track.fileName,
    }));
  } catch (error) {
    console.error('Error al obtener el estado de las canciones:', error);
    return [];
  }
}

async function getExistingReleaseTracks(spotifyAlbumId: string): Promise<{
  exists: boolean;
  tracks: Array<{
    spotifyId: string;
    name: string;
    audioUrl: string;
    fileName: string;
  }>;
}> {
  await connectMongo();

  try {
    const release = await Release.findOne({ spotifyId: spotifyAlbumId }).populate({
      path: 'tracks',
      select: 'spotifyId name audioUrl fileName',
    });

    if (!release) {
      return {
        exists: false,
        tracks: [],
      };
    }

    const tracks = release.tracks.map((track: any) => ({
      spotifyId: track.spotifyId,
      name: track.name,
      audioUrl: track.audioUrl,
      fileName: track.fileName,
    }));

    return {
      exists: true,
      tracks,
    };
  } catch (error) {
    console.error('Error al verificar las canciones existentes:', error);
    return {
      exists: false,
      tracks: [],
    };
  }
}

export {
  searchSpotifyAlbumBySong,
  createOrUpdateReleaseWithFiles,
  getReleaseTracksStatus,
  getExistingReleaseTracks,
};
