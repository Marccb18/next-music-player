import { PutObjectCommand } from '@aws-sdk/client-s3';

import { s3Client } from '@/lib/server-only/aws/s3';

export async function uploadFileToS3(file: File, key: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al subir el archivo');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error al subir archivo a S3:', error);
    throw new Error('Error al subir el archivo');
  }
}
