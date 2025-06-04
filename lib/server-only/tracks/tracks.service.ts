'use server';

import { Tracks } from '@/lib/mongo/models/Tracks';

export async function getTracks() {
  const tracks = await Tracks.find()
    .populate('artists', 'name id')
    .populate('album', 'name id');
  return JSON.parse(JSON.stringify(tracks));
}

export async function getTracksByIds(ids: string[]) {
  const tracks = await Tracks.find({ _id: { $in: ids } })
    .populate('artists', 'name id')
    .populate('album', 'name id');
  return JSON.parse(JSON.stringify(tracks));
}