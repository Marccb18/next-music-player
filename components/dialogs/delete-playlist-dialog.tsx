'use client';

import { AlertTriangle } from 'lucide-react';

import * as React from 'react';

import { Button } from '@/components/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/dialog';

interface Playlist {
  id: string;
  name: string;
  totalSongs: number;
}

interface DeletePlaylistDialogProps {
  playlist: Playlist;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeletePlaylistDialog({
  playlist,
  open,
  onOpenChange,
  onConfirm,
}: DeletePlaylistDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);

    // Simular delay de eliminación
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onConfirm();
    setIsDeleting(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting) {
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Playlist
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar la playlist "{playlist.name}"?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive font-medium mb-2">
              Esta acción no se puede deshacer
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Se eliminarán {playlist.totalSongs} canciones de la playlist</li>
              <li>• Los seguidores perderán acceso a la playlist</li>
              <li>• No podrás recuperar esta playlist después</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Eliminando...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                Eliminar Playlist
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
