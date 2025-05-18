import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { NextResponse } from 'next/server';

// Validar que las variables de entorno necesarias estén presentes
const requiredEnvVars = {
  region: process.env.NEXT_PRIVATE_AWS_REGION,
  accessKeyId: process.env.NEXT_PRIVATE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PRIVATE_AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.NEXT_PRIVATE_AWS_BUCKET_NAME,
};

// Verificar que todas las variables de entorno estén definidas
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('Variables de entorno faltantes:', missingVars.join(', '));
}

const s3Client = new S3Client({
  region: requiredEnvVars.region,
  credentials: {
    accessKeyId: requiredEnvVars.accessKeyId!,
    secretAccessKey: requiredEnvVars.secretAccessKey!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file || !fileName) {
      return NextResponse.json(
        { error: 'Archivo y nombre de archivo son requeridos' },
        { status: 400 }
      );
    }

    // Validar que el archivo sea MP3
    if (file.type !== 'audio/mpeg' && !fileName.toLowerCase().endsWith('.mp3')) {
      return NextResponse.json({ error: 'Solo se permiten archivos MP3' }, { status: 400 });
    }

    if (!requiredEnvVars.bucketName) {
      return NextResponse.json({ error: 'Configuración de AWS incompleta' }, { status: 500 });
    }

    const fileBuffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: requiredEnvVars.bucketName,
      Key: fileName,
      Body: Buffer.from(fileBuffer),
      ContentType: 'audio/mpeg',
      CacheControl: 'max-age=31536000',
    });

    await s3Client.send(command);

    // Construir la URL directa de S3
    const fileUrl = `https://${requiredEnvVars.bucketName}.s3.${requiredEnvVars.region}.amazonaws.com/${fileName}`;

    return NextResponse.json({
      url: fileUrl,
      message: 'Archivo subido exitosamente',
    });
  } catch (error) {
    console.error('Error en la subida:', error);

    // Manejo específico de errores
    if (error instanceof Error) {
      if (error.name === 'AccessDenied') {
        return NextResponse.json(
          { error: 'No tienes permisos para subir archivos' },
          { status: 403 }
        );
      }
      if (error.name === 'NoSuchBucket') {
        return NextResponse.json({ error: 'El bucket de S3 no existe' }, { status: 404 });
      }
      if (error.name === 'AccessControlListNotSupported') {
        return NextResponse.json(
          {
            error:
              'El bucket no soporta ACLs. Por favor, configura los permisos del bucket correctamente.',
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 });
  }
}
