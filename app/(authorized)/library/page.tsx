'use client';

import {
  Clock,
  Edit3,
  Globe,
  Lock,
  MoreHorizontal,
  Music,
  Play,
  Plus,
  Search,
  Share,
  Trash2,
} from 'lucide-react';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { CreatePlaylistDialog } from '@/components/dialogs/create-playlist-dialog';
import { DeletePlaylistDialog } from '@/components/dialogs/delete-playlist-dialog';
import { EditPlaylistDialog } from '@/components/dialogs/edit-playlist-dialog';
import { Badge } from '@/components/primitives/badge';
import { Button } from '@/components/primitives/button';
import { Card, CardContent, CardHeader } from '@/components/primitives/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';
import { Input } from '@/components/primitives/input';

import { usePlaylistsStore } from '@/lib/client-only/stores/playlistsStore';

interface Playlist {
  id: string;
  name: string;
  description?: string;
  covers: string[];
  isPublic: boolean;
  totalDuration: number;
  totalSongs: number;
  songs?: Array<{
    track: string;
    position: number;
    addedAt: Date;
  }>;
}

export default function PlaylistsView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [editingPlaylist, setEditingPlaylist] = React.useState<Playlist | null>(null);
  const [deletingPlaylist, setDeletingPlaylist] = React.useState<Playlist | null>(null);

  const { playlists, createPlaylist, updatePlaylist, deletePlaylist } = usePlaylistsStore();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const filteredPlaylists = playlists.filter((playlist) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      playlist.name.toLowerCase().includes(searchLower) ||
      (playlist.description?.toLowerCase() || '').includes(searchLower)
    );
  });

  const handleCreatePlaylist = (data: { name: string; description: string; isPublic: boolean }) => {
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

  const handleEditPlaylist = (data: { name: string; description: string; isPublic: boolean }) => {
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

  const handlePlaylistClick = (playlist: Playlist) => {
    router.push(`/library/playlist/${playlist.id}`);
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
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en tus playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        )}

        {/* Estado vacío */}
        {playlists.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Music className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Tu biblioteca está vacía</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Las playlists te ayudan a organizar tu música. Crea una para empezar a guardar tus
              canciones favoritas y acceder a ellas fácilmente.
            </p>
            <Button onClick={() => setShowCreateDialog(true)} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Crear mi primera playlist
            </Button>
          </div>
        )}

        {/* Sin resultados de búsqueda */}
        {playlists.length > 0 && filteredPlaylists.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No se encontraron playlists</h2>
            <p className="text-muted-foreground mb-6">
              No hay playlists que coincidan con "{searchQuery}"
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Limpiar búsqueda
            </Button>
          </div>
        )}

        {/* Grid de playlists */}
        {filteredPlaylists.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaylists.map((playlist) => (
              <Card key={playlist.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="p-0">
                  <div
                    className="relative aspect-square overflow-hidden rounded-t-lg cursor-pointer"
                    onClick={() => handlePlaylistClick(playlist)}
                  >
                    {playlist.covers.length > 0 &&
                    playlist.covers[0]?.startsWith('linear-gradient') ? (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: playlist.covers[0] }}
                      >
                        <Music className="h-16 w-16 text-primary/40" />
                      </div>
                    ) : playlist.covers.length > 0 ? (
                      <img
                        src={playlist.covers[0] || '/placeholder.svg'}
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Music className="h-16 w-16 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

                    {/* Botón de play que aparece al hover */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button size="sm" className="rounded-full h-12 w-12 shadow-lg">
                        <Play className="h-5 w-5 ml-0.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className="font-semibold text-lg truncate cursor-pointer"
                      onClick={() => handlePlaylistClick(playlist)}
                    >
                      {playlist.name}
                    </h3>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaylistClick(playlist);
                          }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Reproducir
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPlaylist(playlist);
                          }}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingPlaylist(playlist);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {playlist.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Music className="h-3 w-3" />
                        {playlist.totalSongs}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(playlist.totalDuration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {playlist.isPublic ? (
                        <Globe className="h-3 w-3" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                      <Badge
                        variant={playlist.isPublic ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {playlist.isPublic ? 'Pública' : 'Privada'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
            onOpenChange={(open: any) => !open && setEditingPlaylist(null)}
            onSubmit={handleEditPlaylist}
          />
        )}

        {deletingPlaylist && (
          <DeletePlaylistDialog
            playlist={deletingPlaylist}
            open={!!deletingPlaylist}
            onOpenChange={(open: any) => !open && setDeletingPlaylist(null)}
            onConfirm={handleDeletePlaylist}
          />
        )}
      </div>
    </div>
  );
}
