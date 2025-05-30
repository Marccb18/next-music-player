'use client';

import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog as AlertDialogPrimitives,
  AlertDialogTitle,
} from '@/components/primitives/alert-dialog';
import { Button } from '@/components/primitives/button';
import Spinner from '@/components/primitives/spinner';

import { useAlertDialogStore } from '@/lib/client-only/stores/alertDialogStore';

export const AlertDialog = () => {
  const {
    isOpen,
    title,
    description,
    onContinue,
    onSecondaryContinue,
    secondaryContinueText,
    onCancel,
    close,
    isLoading,
    isSecondaryLoading,
    setLoading,
    setSecondaryLoading,
    customContent,
    customFooter,
  } = useAlertDialogStore();

  const renderCustomContent = () => {
    if (!customContent) return null;

    switch (customContent.type) {
      default:
        return null;
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      await onContinue?.();
    } finally {
      setLoading(false);
      close();
    }
  };

  const handleSecondaryContinue = async () => {
    if (!setSecondaryLoading) return;
    setSecondaryLoading(true);
    try {
      await onSecondaryContinue?.();
    } finally {
      setSecondaryLoading(false);
      close();
    }
  };

  return (
    <AlertDialogPrimitives open={isOpen} onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          {renderCustomContent()}
        </AlertDialogHeader>
        {customFooter || (
          <AlertDialogFooter>
            <Button variant="outline" onClick={close} disabled={isLoading || isSecondaryLoading}>
              Cancelar
            </Button>
            <Button
              onClick={handleContinue}
              disabled={isLoading || isSecondaryLoading}
              className="gap-2"
            >
              Continuar
              {isLoading && <Spinner />}
            </Button>
            {onSecondaryContinue && (
              <Button
                onClick={handleSecondaryContinue}
                disabled={isLoading || isSecondaryLoading}
                className="gap-2"
              >
                {secondaryContinueText}
                {isSecondaryLoading && <Spinner />}
              </Button>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialogPrimitives>
  );
};
