'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { AlbumDetailView } from '@/components/views/albums-views/album-detail-view';
import { AlbumDetailSkeleton } from '@/components/views/albums-views/album-detail-skeleton';

import { getReleaseById } from '@/lib/server-only/releases/releases.service';
import type { Album } from '@/lib/types/music';

export default function AlbumDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [album, setAlbum] = React.useState<Album | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const release = await getReleaseById(params.id);
        setAlbum(release);
      } catch (error) {
        console.error('Error al cargar el álbum:', error);
        setError('No se pudo cargar el álbum');
        router.replace('/albums');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbum();
  }, [params.id, router]);

  if (isLoading) {
    return <AlbumDetailSkeleton />;
  }

  if (error || !album) {
    return null;
  }

  return <AlbumDetailView album={album} onBack={() => router.back()} />;
}
