import { PutObjectCommand } from '@aws-sdk/client-s3';

import { NextResponse } from 'next/server';

import { s3Client } from '@/lib/server-only/aws/s3';

const requiredEnvVars = {
  bucketName: process.env.AWS_S3_BUCKET_NAME,
  region: process.env.AWS_REGION,
};

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

    // Subir archivo a S3
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
      fileName,
      message: 'Archivo subido exitosamente',
    });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 });
  }
}
