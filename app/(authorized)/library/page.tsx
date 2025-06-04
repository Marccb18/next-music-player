'use client';

import { Plus } from 'lucide-react';

import * as React from 'react';

import { CreatePlaylistDialog } from '@/components/dialogs/create-playlist-dialog';
import { DeletePlaylistDialog } from '@/components/dialogs/delete-playlist-dialog';
import { EditPlaylistDialog } from '@/components/dialogs/edit-playlist-dialog';
import { Button } from '@/components/primitives/button';
import { EmptyState } from '@/components/views/playlist-detail-view/empty-state';
import { NoResults } from '@/components/views/playlist-detail-view/no-results';
import { PlaylistsGrid } from '@/components/views/playlist-detail-view/playlists-grid';
import { SearchBar } from '@/components/views/playlist-detail-view/search-bar';

import { usePlaylistsStore } from '@/lib/client-only/stores/playlistsStore';
import { Playlist, PlaylistFormData } from '@/lib/types/playlist';

export default function PlaylistsView() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [editingPlaylist, setEditingPlaylist] = React.useState<Playlist | null>(null);
  const [deletingPlaylist, setDeletingPlaylist] = React.useState<Playlist | null>(null);

  const { playlists, createPlaylist, updatePlaylist, deletePlaylist } = usePlaylistsStore();

  const filteredPlaylists = playlists.filter((playlist) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      playlist.name.toLowerCase().includes(searchLower) ||
      (playlist.description?.toLowerCase() || '').includes(searchLower)
    );
  });

  const handleCreatePlaylist = (data: PlaylistFormData) => {
    createPlaylist({
      name: data.name,
      description: data.description,
      isPublic: data.isPublic,
      covers: [],
      totalSongs: 0,
      totalDuration: 0,
    });
    setShowCreateDialog(false);
  };

  const handleEditPlaylist = (data: PlaylistFormData) => {
    if (!editingPlaylist) return;

    updatePlaylist({
      ...editingPlaylist,
      name: data.name,
      description: data.description,
      isPublic: data.isPublic,
    });
    setEditingPlaylist(null);
  };

  const handleDeletePlaylist = () => {
    if (!deletingPlaylist) return;

    deletePlaylist(deletingPlaylist.id);
    setDeletingPlaylist(null);
  };

  return (
    <div className="flex-1 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Tus Playlists</h1>
            <p className="text-muted-foreground">
              {playlists.length > 0 ? `${playlists.length} playlists` : 'Crea tu primera playlist'}
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Playlist
          </Button>
        </div>

        {/* Búsqueda */}
        {playlists.length > 0 && (
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar en tus playlists..."
          />
        )}

        {/* Estado vacío */}
        {playlists.length === 0 && <EmptyState onCreateClick={() => setShowCreateDialog(true)} />}

        {/* Sin resultados de búsqueda */}
        {playlists.length > 0 && filteredPlaylists.length === 0 && (
          <NoResults searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} />
        )}

        {/* Grid de playlists */}
        {filteredPlaylists.length > 0 && (
          <PlaylistsGrid
            playlists={filteredPlaylists}
            onEdit={setEditingPlaylist}
            onDelete={setDeletingPlaylist}
          />
        )}

        {/* Dialogs */}
        <CreatePlaylistDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreatePlaylist}
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
      </div>
    </div>
  );
}
