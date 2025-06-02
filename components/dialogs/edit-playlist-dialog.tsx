'use client';

import { Edit3 } from 'lucide-react';

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
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
import { Switch } from '@/components/primitives/switch';
import { Textarea } from '@/components/primitives/textarea';

interface Playlist {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
}

interface EditPlaylistDialogProps {
  playlist: Playlist;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; description: string; isPublic: boolean }) => void;
}

export function EditPlaylistDialog({
  playlist,
  open,
  onOpenChange,
  onSubmit,
}: EditPlaylistDialogProps) {
  const [name, setName] = React.useState(playlist.name);
  const [description, setDescription] = React.useState(playlist.description || '');
  const [isPublic, setIsPublic] = React.useState(playlist.isPublic);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset form when playlist changes
  React.useEffect(() => {
    setName(playlist.name);
    setDescription(playlist.description || '');
    setIsPublic(playlist.isPublic);
  }, [playlist]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    // Simular delay de actualización
    await new Promise((resolve) => setTimeout(resolve, 800));

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      isPublic,
    });

    setIsSubmitting(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Editar Playlist
          </DialogTitle>
          <DialogDescription>
            Modifica los detalles de tu playlist "{playlist.name}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre de la playlist *</Label>
            <Input
              id="edit-name"
              placeholder="Mi playlist increíble"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              disabled={isSubmitting}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">{name.length}/100 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripción (opcional)</Label>
            <Textarea
              id="edit-description"
              placeholder="Describe tu playlist..."
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
              disabled={isSubmitting}
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{description.length}/500 caracteres</p>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="edit-public">Playlist pública</Label>
              <p className="text-sm text-muted-foreground">
                Permite que otros usuarios vean y sigan tu playlist
              </p>
            </div>
            <Switch
              id="edit-public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Guardando...
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
