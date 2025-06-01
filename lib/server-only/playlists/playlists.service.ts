'use server';

import connectMongo, { Playlists } from '@/lib/mongo';

export const getPlaylists = async (userId: string) => {
  await connectMongo();
  const playlists = await Playlists.find({ owner: userId });
  return playlists;
};

export const createPlaylist = async (
  userId: string,
  name: string,
  description: string,
  cover: string
) => {
  await connectMongo();
  const playlist = await Playlists.create({ owner: userId, name, description, cover });
  return playlist;
};
