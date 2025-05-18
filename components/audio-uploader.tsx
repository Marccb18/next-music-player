'use client';

import { useState } from 'react';

export default function AudioUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que el archivo sea MP3
    if (file.type !== 'audio/mpeg' && !file.name.toLowerCase().endsWith('.mp3')) {
      setError('Por favor, sube un archivo MP3 válido');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Generar un nombre único para el archivo
      const fileName = `${Date.now()}-${file.name}`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la subida del archivo');
      }

      const data = await response.json();
      setUploadedUrl(data.url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al subir el archivo. Por favor, inténtalo de nuevo.'
      );
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Subir archivo MP3</h2>

      <div className="space-y-4">
        <input
          type="file"
          accept="audio/mpeg,.mp3"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />

        {isUploading && <p className="text-sm text-gray-600">Subiendo archivo...</p>}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {uploadedUrl && (
          <div className="mt-4">
            <p className="text-sm text-green-600">¡Archivo subido con éxito!</p>
            <p className="text-sm text-gray-600 break-all mt-2">URL: {uploadedUrl}</p>
            <audio controls className="mt-2 w-full">
              <source src={uploadedUrl} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}
