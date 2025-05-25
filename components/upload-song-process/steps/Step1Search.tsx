import { ChevronRight, Search } from 'lucide-react';

import { Button } from '../../primitives/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { Input } from '../../primitives/input';
import { Label } from '../../primitives/label';

interface Step1SearchProps {
  releaseName: string;
  artistName: string;
  isSearching: boolean;
  onReleaseNameChange: (value: string) => void;
  onArtistNameChange: (value: string) => void;
  onSearch: () => void;
}

export function Step1Search({
  releaseName,
  artistName,
  isSearching,
  onReleaseNameChange,
  onArtistNameChange,
  onSearch,
}: Step1SearchProps) {
  const canProceed = releaseName.trim() && artistName.trim();

  return (
    <Card className="max-w-2xl mx-auto transform transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Información del Lanzamiento
        </CardTitle>
        <CardDescription>
          Ingresa el nombre del lanzamiento y del artista para buscar en Spotify
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="release-name">Nombre del Lanzamiento</Label>
          <Input
            id="release-name"
            placeholder="Ej: The Dark Side of the Moon"
            value={releaseName}
            onChange={(e) => onReleaseNameChange(e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="artist-name">Nombre del Artista</Label>
          <Input
            id="artist-name"
            placeholder="Ej: Pink Floyd"
            value={artistName}
            onChange={(e) => onArtistNameChange(e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button
            onClick={onSearch}
            disabled={!canProceed || isSearching}
            className="transition-all duration-200 hover:scale-105"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Buscando...
              </>
            ) : (
              <>
                Buscar en Spotify
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
