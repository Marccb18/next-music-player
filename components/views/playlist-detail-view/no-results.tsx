import { Search } from 'lucide-react';

import { Button } from '@/components/primitives/button';

interface NoResultsProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export function NoResults({ searchQuery, onClearSearch }: NoResultsProps) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
        <Search className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No se encontraron playlists</h2>
      <p className="text-muted-foreground mb-6">
        No hay playlists que coincidan con "{searchQuery}"
      </p>
      <Button variant="outline" onClick={onClearSearch}>
        Limpiar búsqueda
      </Button>
    </div>
  );
}
