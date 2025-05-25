import { Check, ChevronLeft, FileAudio, Upload, X } from 'lucide-react';

import { useEffect, useState } from 'react';

import { getExistingReleaseTracks } from '@/lib/server-only/spotify/spotify.service';

import { Button } from '../../primitives/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { SpotifyRelease, TrackFile } from '../types';

interface Step3UploadProps {
  spotifyData: SpotifyRelease;
  trackFiles: TrackFile[];
  onBack: () => void;
  onComplete: () => void;
  onOpenUploadDrawer: (trackId: string) => void;
  onRemoveTrackFile: (trackId: string) => void;
}

export function Step3Upload({
  spotifyData,
  trackFiles,
  onBack,
  onComplete,
  onOpenUploadDrawer,
  onRemoveTrackFile,
}: Step3UploadProps) {
  const [existingTracks, setExistingTracks] = useState<
    Record<string, { audioUrl: string; fileName: string }>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadExistingTracks() {
      try {
        const { exists, tracks } = await getExistingReleaseTracks(spotifyData.id);
        if (exists) {
          const tracksMap = tracks.reduce(
            (acc, track) => ({
              ...acc,
              [track.spotifyId]: {
                audioUrl: track.audioUrl,
                fileName: track.fileName,
              },
            }),
            {}
          );
          setExistingTracks(tracksMap);
        }
      } catch (error) {
        console.error('Error al cargar las canciones existentes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadExistingTracks();
  }, [spotifyData.id]);

  const uploadedFilesCount = trackFiles.filter((tf) => tf.file !== null).length;
  const canComplete = trackFiles.some((tf) => tf.file !== null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTrackFile = (trackId: string) => {
    return trackFiles.find((tf) => tf.trackId === trackId)?.file || null;
  };

  const isTrackUploaded = (trackId: string) => {
    const trackFile = getTrackFile(trackId);
    const existingTrack = existingTracks[trackId];
    return Boolean(existingTrack) || Boolean(trackFile);
  };

  const getTrackFileName = (trackId: string) => {
    const trackFile = getTrackFile(trackId);
    const existingTrack = existingTracks[trackId];

    if (trackFile) {
      return trackFile.name;
    }
    if (existingTrack) {
      return existingTrack.fileName;
    }
    return '';
  };

  const getTrackFileSize = (trackId: string) => {
    const trackFile = getTrackFile(trackId);
    if (trackFile) {
      return formatFileSize(trackFile.size);
    }
    return '';
  };

  return (
    <Card className="max-w-5xl mx-auto transform transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Subir Archivos de Audio
        </CardTitle>
        <CardDescription>
          Añade los archivos .mp3 que desees subir. No es necesario subir todas las canciones (
          {uploadedFilesCount}/{spotifyData.totalTracks} subidos)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(uploadedFilesCount / spotifyData.totalTracks) * 100}%` }}
          />
        </div>

        {/* Track List with Upload */}
        <div className="space-y-3">
          {spotifyData.tracks.map((track) => {
            const isUploaded = isTrackUploaded(track.id);
            const fileName = getTrackFileName(track.id);
            const fileSize = getTrackFileSize(track.id);

            return (
              <div
                key={track.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors duration-150"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500 w-8 text-center">
                    {track.trackNumber}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{track.name}</p>
                    <p className="text-sm text-slate-500">{track.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isUploaded ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                        <FileAudio className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">
                          {fileName.length > 20 ? `${fileName.substring(0, 20)}...` : fileName}
                        </span>
                        {fileSize && <span className="text-xs text-green-600">({fileSize})</span>}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveTrackFile(track.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-8 h-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenUploadDrawer(track.id)}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Subir archivo
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="transition-all duration-200 hover:scale-105"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button
            onClick={onComplete}
            disabled={!canComplete}
            className="transition-all duration-200 hover:scale-105"
          >
            <Check className="w-4 h-4 mr-2" />
            Completar Importación
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
