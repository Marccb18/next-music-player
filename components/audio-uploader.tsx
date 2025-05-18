'use client';

import { useState } from 'react';

export default function AudioUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que el archivo sea de audio
    if (!file.type.startsWith('audio/')) {
      setError('Por favor, sube un archivo de audio válido');
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
        throw new Error('Error en la subida del archivo');
      }

      const data = await response.json();
      // Asegurarse de que la URL sea absoluta
      const cloudFrontUrl = data.url.startsWith('http') ? data.url : `https://${data.url}`;
      setUploadedUrl(cloudFrontUrl);
    } catch (err) {
      setError('Error al subir el archivo. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Subir archivo de audio</h2>
      
      <div className="space-y-4">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />

        {isUploading && (
          <p className="text-sm text-gray-600">Subiendo archivo...</p>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {uploadedUrl && (
          <div className="mt-4">
            <p className="text-sm text-green-600">¡Archivo subido con éxito!</p>
            <p className="text-sm text-gray-600 break-all mt-2">
              URL: {uploadedUrl}
            </p>
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