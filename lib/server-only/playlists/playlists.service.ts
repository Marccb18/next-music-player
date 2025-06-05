'use server';

import connectMongo, { Playlists } from '@/lib/mongo';

connectMongo();

export const getPlaylists = async (userId: string) => {
  const playlists = await Playlists.find({ owner: userId })
    .populate({
      path: 'songs.track',
    })
    .populate({
      path: 'songs.track.album',
    })
    .populate({
      path: 'songs.track.artists',
    });
  return JSON.parse(JSON.stringify(playlists));
};

export const createPlaylist = async (userId: string, name: string, description: string) => {
  const playlist = await Playlists.create({
    owner: userId,
    name,
    description,
    isPublic: true,
    covers: [],
    totalSongs: 0,
    totalDuration: 0,
    songs: [],
  });
  return JSON.parse(JSON.stringify(playlist));
};

export const updatePlaylist = async (
  userId: string,
  playlistId: string,
  name: string,
  description: string
) => {
  const playlist = await Playlists.findOneAndUpdate(
    { _id: playlistId, owner: userId },
    { name, description },
    { new: true }
  );
  return JSON.parse(JSON.stringify(playlist));
};

export const deletePlaylist = async (userId: string, playlistId: string) => {
  await Playlists.findOneAndDelete({ _id: playlistId, owner: userId });
};

export const addSongToPlaylist = async (
  userId: string,
  playlistId: string,
  trackIds: string | string[]
) => {
  const playlist = await Playlists.findOne({ _id: playlistId, owner: userId });
  if (!playlist) return null;

  const trackIdsArray = Array.isArray(trackIds) ? trackIds : [trackIds];

  for (const trackId of trackIdsArray) {
    // Verificar si la canción ya existe en la playlist
    const songExists = playlist.songs.some((s: any) => s.track.toString() === trackId);
    if (!songExists) {
      playlist.songs.push({
        track: trackId,
        position: playlist.songs.length + 1,
        addedAt: new Date(),
      });
    }
  }

  playlist.totalSongs = playlist.songs.length;
  await playlist.save();

  return JSON.parse(JSON.stringify(playlist));
};

export const removeSongFromPlaylist = async (
  userId: string,
  playlistId: string,
  trackId: string
) => {
  const playlist = await Playlists.findOne({ _id: playlistId, owner: userId });
  if (!playlist) return null;

  playlist.songs = playlist.songs.filter((s: any) => s.track.toString() !== trackId);
  playlist.totalSongs = playlist.songs.length;
  await playlist.save();

  return JSON.parse(JSON.stringify(playlist));
};

export const getPlaylistDetails = async (playlistId: string) => {
  const playlist = await Playlists.findById(playlistId)
    .populate({
      path: 'songs.track',
      populate: [
        {
          path: 'album',
          select: 'name id'
        },
        {
          path: 'artists',
          select: 'name id'
        }
      ]
    });
  return JSON.parse(JSON.stringify(playlist));
};
