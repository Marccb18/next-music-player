import { Music, Plus } from 'lucide-react';
import { Button } from '@/components/primitives/button';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
        <Music className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Tu biblioteca está vacía</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Las playlists te ayudan a organizar tu música. Crea una para empezar a guardar tus
        canciones favoritas y acceder a ellas fácilmente.
      </p>
      <Button onClick={onCreateClick} size="lg" className="gap-2">
        <Plus className="h-5 w-5" />
        Crear mi primera playlist
      </Button>
    </div>
  );
} 