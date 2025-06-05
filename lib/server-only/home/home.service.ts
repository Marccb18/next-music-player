'use server';

import { connectMongo } from '@/lib/mongo';
import { Playlists } from '@/lib/mongo/models/Playlists';
import { Release } from '@/lib/mongo/models/Releases';
import { Tracks } from '@/lib/mongo/models/Tracks';

export interface HomePageData {
  recentTracks: any[];
  recentPlaylists: any[];
  popularAlbums: any[];
}

export async function getHomePageData(): Promise<HomePageData> {
  await connectMongo();

  // Obtener tracks reproducidos recientemente
  const recentTracks = await Tracks.find()
    .sort({ _createdAt: -1 })
    .limit(6)
    .populate('artists')
    .populate('album');

  // Obtener playlists recientes
  const recentPlaylists = await Playlists.find()
    .sort({ _createdAt: -1 })
    .limit(6)
    .populate('songs.track')
    .populate('songs.track.album')
    .populate('songs.track.artists');

  // Obtener álbumes populares
  const popularAlbums = await Release.find()
    .sort({ popularity: -1 })
    .limit(6)
    .populate('artists')
    .populate('tracks');

  return {
    recentTracks: JSON.parse(JSON.stringify(recentTracks)),
    recentPlaylists: JSON.parse(JSON.stringify(recentPlaylists)),
    popularAlbums: JSON.parse(JSON.stringify(popularAlbums)),
  };
}
