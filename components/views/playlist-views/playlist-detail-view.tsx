'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { AddToPlaylistDrawer } from '@/components/drawers/add-to-playlist';

import useAudioPlayer from '@/lib/client-only/stores/audioPlayerStore';
import { usePlaylistsStore } from '@/lib/client-only/stores/playlistsStore';
import { Track } from '@/lib/types/music';

import { PlaylistControls } from './playlist-controls';
import { PlaylistHeader } from './playlist-header';
import { PlaylistTrackList } from './playlist-track-list';

interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  coverStyle?: React.CSSProperties;
  trackCount: number;
  duration: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  tracks: Track[];
  isOwner: boolean;
  covers: string[];
  totalDuration: number;
  totalSongs: number;
}

interface PlaylistDetailViewProps {
  playlist: Playlist;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PlaylistDetailView({
  playlist,
  onBack,
  onEdit,
  onDelete,
}: PlaylistDetailViewProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { reproduceAlbum, reproduceShuffleAlbum, queue, play, pause, isPlaying } = useAudioPlayer();
  const router = useRouter();
  const { playlists, removeSongFromPlaylist, addSongToPlaylist } = usePlaylistsStore();
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = React.useState(false);
  const [selectedTrack, setSelectedTrack] = React.useState<Track | null>(null);

  const filteredTracks = playlist.tracks.filter((track) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (track.name?.toLowerCase() || '').includes(searchLower) ||
      (
        track.artists
          ?.map((a) => a.name)
          .join(', ')
          .toLowerCase() || ''
      ).includes(searchLower) ||
      (track.album?.name?.toLowerCase() || '').includes(searchLower)
    );
  });

  const handleAddToPlaylist = (playlistId: string) => {
    if (selectedTrack) {
      addSongToPlaylist(playlists.find((p) => p.id === playlistId)!, selectedTrack.id);
      setIsAddToPlaylistOpen(false);
    }
  };

  const handleTrackClick = (track: Track) => {
    setSelectedTrack(track);
    setIsAddToPlaylistOpen(true);
  };

  return (
    <div className="flex-1">
      <PlaylistHeader playlist={playlist} onBack={onBack} />

      <PlaylistControls
        playlist={playlist}
        isPlaying={isPlaying}
        onPlay={() => reproduceAlbum(playlist.tracks)}
        onPause={pause}
        onShuffle={() => reproduceShuffleAlbum(playlist.tracks)}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="px-6 py-4">
        <PlaylistTrackList
          tracks={filteredTracks}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onTrackClick={handleTrackClick}
        />
      </div>

      <AddToPlaylistDrawer
        open={isAddToPlaylistOpen}
        onOpenChange={setIsAddToPlaylistOpen}
        playlists={playlists}
        onAddToPlaylist={handleAddToPlaylist}
      />
    </div>
  );
}
