'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, Music, Search, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import dynamic from 'next/dynamic';

import { Alert, AlertDescription, AlertTitle } from '@/components/primitives/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/primitives/alert-dialog';
import { Badge } from '@/components/primitives/badge';
import { Button } from '@/components/primitives/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/primitives/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/primitives/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/primitives/form';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
import { Progress } from '@/components/primitives/progress';
import { Separator } from '@/components/primitives/separator';

import { searchSpotifySong } from '@/lib/server-only/spotify';
import { mapSpotifyTrack } from '@/lib/server-only/spotify/spotify.mapper';
import { SimplifiedTrack } from '@/lib/server-only/spotify/spotify.types';

// Dynamic import of Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const searchSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  artist: z.string().min(1, 'El artista es requerido'),
});

type SearchFormData = z.infer<typeof searchSchema>;

export default function UploadSongProcess() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SimplifiedTrack[] | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<SimplifiedTrack | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      title: '',
      artist: '',
    },
  });

  const onSubmit = async (data: SearchFormData) => {
    setIsLoading(true);
    try {
      const tracks = await searchSpotifySong(data.title, data.artist);
      if (!tracks || tracks.length === 0) {
        toast.error('No se encontraron resultados');
        return;
      }
      const simplifiedTracks = tracks.map(mapSpotifyTrack);
      setSearchResults(simplifiedTracks);
      setStep(2);
    } catch (error) {
      toast.error('Error al buscar la canción');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackSelect = (track: SimplifiedTrack) => {
    setSelectedTrack(track);
    setStep(3);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'audio/mpeg' && !file.name.toLowerCase().endsWith('.mp3')) {
        toast.error('Por favor, sube un archivo MP3 válido');
        return;
      }
      setAudioFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedTrack || !audioFile) {
      toast.error('Por favor, selecciona una canción y sube el archivo MP3');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    try {
      // Simulamos el progreso de subida
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      // Primero subimos el archivo a S3
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('fileName', `${Date.now()}-${audioFile.name}`);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Error al subir el archivo');
      }

      const { url: audioUrl, fileName } = await uploadResponse.json();

      // Mapear los datos de Spotify a nuestro modelo
      const trackData = {
        name: selectedTrack.name,
        group: selectedTrack.artist,
        collaborators: selectedTrack.collaborators,
        album: selectedTrack.album,
        image: selectedTrack.image,
        url: selectedTrack.url,
        duration: selectedTrack.duration,
        spotifyId: selectedTrack.spotifyId,
        trackNumber: selectedTrack.trackNumber,
        isExplicit: selectedTrack.isExplicit,
        genre: [],
        audioUrl,
        fileName,
      };

      // Llamar al servicio de releases para crear el track
      const response = await fetch('/api/releases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trackData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear la canción');
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      toast.success('Canción subida exitosamente');

      // Resetear el estado después de un breve delay
      setTimeout(() => {
        setStep(1);
        form.reset();
        setSearchResults(null);
        setSelectedTrack(null);
        setAudioFile(null);
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al subir la canción');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setShowConfirmDialog(false);
    setStep(1);
    form.reset();
    setSearchResults(null);
    setSelectedTrack(null);
    setAudioFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Music className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Subir Nueva Canción</h1>
            </div>
            {step > 1 && (
              <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancelar Subida
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Si cancelas la subida, perderás todo el progreso actual.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continuar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset}>Cancelar Subida</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {step === 1 && 'Buscar Canción en Spotify'}
                  {step === 2 && 'Seleccionar Canción'}
                  {step === 3 && 'Subir Archivo MP3'}
                </CardTitle>
                <Badge variant="outline" className="text-lg">
                  Paso {step} de 3
                </Badge>
              </div>
              <CardDescription className="text-lg">
                {step === 1 && 'Busca la canción que deseas subir en Spotify'}
                {step === 2 && 'Selecciona la canción correcta de los resultados'}
                {step === 3 && 'Sube el archivo MP3 de la canción seleccionada'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {step === 1 && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Título</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Título de la canción"
                              {...field}
                              className="h-12 text-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="artist"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Artista</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nombre del artista"
                              {...field}
                              className="h-12 text-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 text-lg font-semibold"
                    >
                      {isLoading ? (
                        <div className="w-8 h-8">
                          <Lottie
                            animationData={require('@/public/animations/loading.json')}
                            loop={true}
                          />
                        </div>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Buscar en Spotify
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              {step === 2 && searchResults && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {searchResults.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center space-x-6 p-6 border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                      onClick={() => handleTrackSelect(track)}
                    >
                      {track.image && (
                        <img
                          src={track.image}
                          alt={track.name}
                          className="w-24 h-24 rounded-lg object-cover shadow-md"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{track.name}</h3>
                        <p className="text-base text-muted-foreground mb-1">
                          {track.artist}
                          {track.collaborators.length > 0 &&
                            ` ft. ${track.collaborators.join(', ')}`}
                        </p>
                        <p className="text-sm text-muted-foreground">{track.album}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step === 3 && selectedTrack && (
                <div className="space-y-8">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Información Importante</AlertTitle>
                    <AlertDescription>
                      Asegúrate de que el archivo MP3 que vas a subir corresponda exactamente con la
                      canción seleccionada.
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center space-x-6 p-6 border rounded-xl bg-muted/30">
                    {selectedTrack.image && (
                      <img
                        src={selectedTrack.image}
                        alt={selectedTrack.name}
                        className="w-24 h-24 rounded-lg object-cover shadow-md"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{selectedTrack.name}</h3>
                      <p className="text-base text-muted-foreground mb-1">
                        {selectedTrack.artist}
                        {selectedTrack.collaborators.length > 0 &&
                          ` ft. ${selectedTrack.collaborators.join(', ')}`}
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedTrack.album}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label htmlFor="audio" className="text-lg">
                      Archivo MP3
                    </Label>
                    <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors duration-200">
                      <Input
                        id="audio"
                        type="file"
                        accept="audio/mpeg,.mp3"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="hidden"
                      />
                      <Label
                        htmlFor="audio"
                        className="cursor-pointer text-lg text-muted-foreground hover:text-primary"
                      >
                        {audioFile ? (
                          <div className="flex items-center justify-center gap-2">
                            <Upload className="w-5 h-5" />
                            {audioFile.name}
                          </div>
                        ) : (
                          'Haz clic o arrastra tu archivo MP3 aquí'
                        )}
                      </Label>
                    </div>
                  </div>

                  {uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso de subida</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  <Button
                    onClick={handleUpload}
                    disabled={!audioFile || isLoading}
                    className="w-full h-12 text-lg font-semibold"
                  >
                    {isLoading ? (
                      <div className="w-8 h-8">
                        <Lottie
                          animationData={require('@/public/animations/loading.json')}
                          loop={true}
                        />
                      </div>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Subir Canción
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
