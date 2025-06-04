'use client';

import { Disc, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import * as React from 'react';

import { EmptyState } from '@/components/primitives/empty-state';
import { Input } from '@/components/primitives/input';
import { AlbumCard } from '@/components/views/albums-views/album-card';
import { AlbumSkeleton } from '@/components/views/albums-views/album-skeleton';

import { getReleases } from '@/lib/server-only/releases/releases.service';
import type { Album, Release } from '@/lib/types/music';

export default function AlbumsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [albums, setAlbums] = React.useState<Album[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const releases = await getReleases();
        console.log('Releases recibidos:', releases);
        const transformedAlbums = releases.map((release: Release) => ({
          id: release.id,
          name: release.name,
          cover: release.cover,
          releaseDate: release.releaseDate ? new Date(release.releaseDate) : new Date(),
          artists: release.artists || [],
          totalTracks: release.totalTracks || 0,
          totalDuration: release.totalDuration || 0,
          type: release.type || 'album',
          tracks: release.tracks || [],
        }));

        setAlbums(transformedAlbums);
      } catch (error) {
        console.error('Error al cargar los álbumes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const filteredAlbums = React.useMemo(() => {
    return albums.filter(
      (album) =>
        album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artists.some((artist) =>
          artist.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [albums, searchQuery]);

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Álbumes</h1>
            <p className="text-muted-foreground">
              {albums.length > 0
                ? `${albums.length} álbumes en tu biblioteca`
                : 'Explora nuevos álbumes'}
            </p>
          </div>
        </div>

        {/* Búsqueda */}
        {albums.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título o artista..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        )}

        {/* Estados de carga */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <AlbumSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Estado vacío */}
        {!isLoading && albums.length === 0 && (
          <EmptyState
            icon={<Disc className="h-12 w-12 text-muted-foreground" />}
            title="No hay álbumes en tu biblioteca"
            description="Explora y añade álbumes a tu biblioteca para verlos aquí."
            actionLabel="Explorar música"
            actionHref="/search"
          />
        )}

        {/* Sin resultados de búsqueda */}
        {!isLoading && albums.length > 0 && filteredAlbums.length === 0 && (
          <EmptyState
            icon={<Search className="h-12 w-12 text-muted-foreground" />}
            title="No se encontraron álbumes"
            description={`No hay álbumes que coincidan con "${searchQuery}"`}
            actionLabel="Limpiar búsqueda"
            onAction={() => setSearchQuery('')}
          />
        )}

        {/* Grid de álbumes */}
        {!isLoading && filteredAlbums.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onClick={() => router.push(`/albums/${album.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
