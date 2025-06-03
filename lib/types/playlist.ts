export interface Playlist {
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

export interface PlaylistFormData {
  name: string;
  description: string;
  isPublic: boolean;
} 