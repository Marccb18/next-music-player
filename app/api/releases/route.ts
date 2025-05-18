import { NextResponse } from 'next/server';

import { createTrack } from '@/lib/server-only/releases/releases.service';

export async function POST(request: Request) {
  try {
    const trackData = await request.json();
    const result = await createTrack(trackData);

    if (!result.success) {
      return NextResponse.json({ error: result.error, details: result.details }, { status: 400 });
    }

    return NextResponse.json(result.track);
  } catch (error) {
    console.error('Error al crear la canción:', error);
    return NextResponse.json({ error: 'Error al crear la canción' }, { status: 500 });
  }
}
