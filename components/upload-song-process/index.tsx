'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

import { searchSpotifySong } from '@/lib/server-only/spotify';
import { SimplifiedTrack } from '@/lib/server-only/spotify/spotify.types';
import { mapSpotifyTrack } from '@/lib/server-only/spotify/spotify.mapper';

import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/primitives/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/primitives/form';

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
    try {
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
        genre: [], // Por ahora no manejamos géneros desde Spotify
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

      toast.success('Canción subida exitosamente');
      setStep(1);
      form.reset();
      setSearchResults(null);
      setSelectedTrack(null);
      setAudioFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al subir la canción');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Subir Nueva Canción</CardTitle>
          <CardDescription>
            {step === 1 && 'Busca la canción en Spotify'}
            {step === 2 && 'Selecciona la canción correcta'}
            {step === 3 && 'Sube el archivo MP3'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título de la canción" {...field} />
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
                      <FormLabel>Artista</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del artista" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <div className="w-6 h-6">
                      <Lottie
                        animationData={require('@/public/animations/loading.json')}
                        loop={true}
                      />
                    </div>
                  ) : (
                    'Buscar'
                  )}
                </Button>
              </form>
            </Form>
          )}

          {step === 2 && searchResults && (
            <div className="space-y-4">
              {searchResults.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer hover:bg-muted"
                  onClick={() => handleTrackSelect(track)}
                >
                  {track.image && (
                    <img
                      src={track.image}
                      alt={track.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{track.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {track.artist}
                      {track.collaborators.length > 0 && ` ft. ${track.collaborators.join(', ')}`}
                    </p>
                    <p className="text-sm text-muted-foreground">{track.album}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && selectedTrack && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                {selectedTrack.image && (
                  <img
                    src={selectedTrack.image}
                    alt={selectedTrack.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{selectedTrack.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedTrack.artist}
                    {selectedTrack.collaborators.length > 0 &&
                      ` ft. ${selectedTrack.collaborators.join(', ')}`}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedTrack.album}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audio">Archivo MP3</Label>
                <Input
                  id="audio"
                  type="file"
                  accept="audio/mpeg,.mp3"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
              </div>

              <Button onClick={handleUpload} disabled={!audioFile || isLoading} className="w-full">
                {isLoading ? (
                  <div className="w-6 h-6">
                    <Lottie
                      animationData={require('@/public/animations/loading.json')}
                      loop={true}
                    />
                  </div>
                ) : (
                  'Subir Canción'
                )}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep((prev) => prev - 1)}
              disabled={isLoading}
            >
              Atrás
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
