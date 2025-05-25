'use client';

import { Check } from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';

import { uploadFileToS3 } from '@/lib/client/aws/s3';
import {
  createOrUpdateReleaseWithFiles,
  searchSpotifyAlbumBySong,
} from '@/lib/server-only/spotify';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../primitives/alert-dialog';
import { UploadDrawer } from './UploadDrawer';
import { Step1Search } from './steps/Step1Search';
import { Step2Preview } from './steps/Step2Preview';
import { Step3Upload } from './steps/Step3Upload';
import { SpotifyRelease, TrackFile } from './types';

export default function SpotifyUploader() {
  const [currentStep, setCurrentStep] = useState(1);
  const [releaseName, setReleaseName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [spotifyData, setSpotifyData] = useState<SpotifyRelease | null>(null);
  const [trackFiles, setTrackFiles] = useState<TrackFile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTrackForUpload, setSelectedTrackForUpload] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchSpotifyRelease = async () => {
    if (!releaseName || !artistName) return;

    setIsSearching(true);

    try {
      const album = await searchSpotifyAlbumBySong(releaseName, artistName);

      if (!album) {
        toast.error('No se encontraron resultados');
        return;
      }

      // Map the album data for the release info
      const spotifyData: SpotifyRelease = {
        id: album.id,
        name: album.name,
        artist: album.artists[0].name,
        artistId: album.artists[0].id,
        image: album.images[0]?.url || '/placeholder.svg',
        releaseDate: album.release_date,
        albumType: album.album_type,
        totalTracks: album.total_tracks,
        tracks: album.tracks.map((track) => ({
          id: track.id,
          name: track.name,
          duration: formatDuration(track.duration_ms),
          trackNumber: track.track_number,
        })),
      };

      setSpotifyData(spotifyData);

      // Initialize trackFiles with all songs
      const initialTrackFiles = spotifyData.tracks.map((track) => ({
        trackId: track.id,
        file: null,
      }));
      setTrackFiles(initialTrackFiles);

      setCurrentStep(2);
    } catch (error) {
      toast.error('Error al buscar en Spotify');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !selectedTrackForUpload) return;

    const file = files[0];
    if (file && (file.type === 'audio/mp3' || file.type === 'audio/mpeg')) {
      setTrackFiles((prev) =>
        prev.map((trackFile) =>
          trackFile.trackId === selectedTrackForUpload ? { ...trackFile, file: file } : trackFile
        )
      );
      setIsDrawerOpen(false);
      setSelectedTrackForUpload(null);
    }
  };

  const removeTrackFile = (trackId: string) => {
    setTrackFiles((prev) =>
      prev.map((trackFile) =>
        trackFile.trackId === trackId ? { ...trackFile, file: null } : trackFile
      )
    );
  };

  const openUploadDrawer = (trackId: string) => {
    setSelectedTrackForUpload(trackId);
    setIsDrawerOpen(true);
  };

  const getSelectedTrackName = () => {
    if (!selectedTrackForUpload || !spotifyData) return '';
    const track = spotifyData.tracks.find((t) => t.id === selectedTrackForUpload);
    return track ? track.name : '';
  };

  const handleComplete = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmComplete = async () => {
    if (!spotifyData) return;

    setIsSubmitting(true);
    try {
      // Subir archivos a S3 y obtener sus URLs
      const uploadedTracks = await Promise.all(
        trackFiles
          .filter((tf) => tf.file !== null)
          .map(async (tf) => {
            const file = tf.file!;
            const key = `tracks/${spotifyData.id}/${file.name}`;
            const audioUrl = await uploadFileToS3(file, key);

            return {
              trackId: tf.trackId,
              audioUrl,
              fileName: file.name,
            };
          })
      );

      // Crear o actualizar el lanzamiento con los archivos
      await createOrUpdateReleaseWithFiles(spotifyData, uploadedTracks);

      toast.success('Lanzamiento importado correctamente');
      // Resetear el estado
      setCurrentStep(1);
      setReleaseName('');
      setArtistName('');
      setSpotifyData(null);
      setTrackFiles([]);
      setIsConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error al importar el lanzamiento:', error);
      toast.error('Error al importar el lanzamiento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReleaseNameChange = (value: string) => {
    setReleaseName(value);
  };

  const handleArtistNameChange = (value: string) => {
    setArtistName(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Importador de Lanzamientos de Spotify
          </h1>
          <p className="text-slate-600">
            Importa tu música desde Spotify y añade los archivos de audio correspondientes
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    currentStep >= step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                <div className="ml-3 text-sm">
                  <div
                    className={`font-medium ${currentStep >= step ? 'text-blue-600' : 'text-slate-500'}`}
                  >
                    {step === 1 && 'Información'}
                    {step === 2 && 'Previsualización'}
                    {step === 3 && 'Archivos'}
                  </div>
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-0.5 ml-8 transition-all duration-300 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div>
          {currentStep === 1 && (
            <Step1Search
              releaseName={releaseName}
              artistName={artistName}
              isSearching={isSearching}
              onReleaseNameChange={handleReleaseNameChange}
              onArtistNameChange={handleArtistNameChange}
              onSearch={searchSpotifyRelease}
            />
          )}

          {currentStep === 2 && spotifyData && (
            <Step2Preview
              spotifyData={spotifyData}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && spotifyData && (
            <Step3Upload
              spotifyData={spotifyData}
              trackFiles={trackFiles}
              onBack={() => setCurrentStep(2)}
              onComplete={handleComplete}
              onOpenUploadDrawer={openUploadDrawer}
              onRemoveTrackFile={removeTrackFile}
            />
          )}
        </div>

        {/* Upload Drawer */}
        <UploadDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          selectedTrackName={getSelectedTrackName()}
          onFileUpload={handleFileUpload}
        />

        {/* Confirmation Dialog */}
        <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar importación</AlertDialogTitle>
              <AlertDialogDescription>
                Estás a punto de importar {trackFiles.filter((tf) => tf.file !== null).length} de{' '}
                {spotifyData?.totalTracks} canciones. ¿Estás seguro de que deseas continuar con la
                importación?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmComplete} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Importando...
                  </>
                ) : (
                  'Continuar'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
