'use server';

import { Tracks } from '@/lib/mongo/models/Tracks';

export async function getTracks() {
  const tracks = await Tracks.find()
    .populate('artists', 'name id')
    .populate('album', 'name id');
  return JSON.parse(JSON.stringify(tracks));
}
