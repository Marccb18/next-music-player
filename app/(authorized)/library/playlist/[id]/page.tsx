'use client';

import { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { DeletePlaylistDialog } from '@/components/dialogs/delete-playlist-dialog';
import { EditPlaylistDialog } from '@/components/dialogs/edit-playlist-dialog';
import { PlaylistDetailView } from '@/components/views/playlist-detail-view';

import { usePlaylistsStore } from '@/lib/client-only/stores/playlistsStore';

export default function PlaylistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { playlists, updatePlaylist, deletePlaylist } = usePlaylistsStore();
  const [playlist, setPlaylist] = useState<any>(null);
  const [editingPlaylist, setEditingPlaylist] = useState<any>(null);
  const [deletingPlaylist, setDeletingPlaylist] = useState<any>(null);

  useEffect(() => {
    const playlist = playlists.find((p) => p.id === params.id);
    if (playlist) {
      const cover = playlist.covers?.[0];
      const isGradient = cover?.startsWith('linear-gradient');
      const adaptedPlaylist = {
        ...playlist,
        trackCount: playlist.totalSongs,
        duration: playlist.totalDuration,
        coverUrl: !isGradient ? cover : undefined,
        coverStyle: isGradient ? { background: cover } : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        tracks: playlist.songs || [],
        isOwner: true,
      };
      setPlaylist(adaptedPlaylist);
    }
  }, [params.id, playlists]);

  const handleEditPlaylist = (data: { name: string; description: string; isPublic: boolean }) => {
    if (!playlist) return;

    updatePlaylist({
      ...playlist,
      name: data.name,
      description: data.description,
      isPublic: data.isPublic,
    });
    setEditingPlaylist(null);
  };

  const handleDeletePlaylist = () => {
    if (!playlist) return;

    deletePlaylist(playlist.id);
    setDeletingPlaylist(null);
    router.push('/library');
  };

  if (!playlist) return null;

  return (
    <>
      <PlaylistDetailView
        playlist={playlist}
        onBack={() => router.back()}
        onEdit={() => setEditingPlaylist(playlist)}
        onDelete={() => setDeletingPlaylist(playlist)}
      />

      {editingPlaylist && (
        <EditPlaylistDialog
          playlist={editingPlaylist}
          open={!!editingPlaylist}
          onOpenChange={(open) => !open && setEditingPlaylist(null)}
          onSubmit={handleEditPlaylist}
        />
      )}

      {deletingPlaylist && (
        <DeletePlaylistDialog
          playlist={deletingPlaylist}
          open={!!deletingPlaylist}
          onOpenChange={(open) => !open && setDeletingPlaylist(null)}
          onConfirm={handleDeletePlaylist}
        />
      )}
    </>
  );
}
