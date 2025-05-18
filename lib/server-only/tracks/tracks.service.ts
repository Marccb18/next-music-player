'use server';

import { Tracks } from '@/lib/mongo/models/Tracks';

interface getTracksProps {
  limit?: number;
}

export async function getTracks({ limit }: getTracksProps) {
  const tracks = await Tracks.find(
    {},
    {
      limit: limit,
    }
  );
  return tracks;
}
