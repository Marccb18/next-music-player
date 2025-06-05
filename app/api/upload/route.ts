import { PutObjectCommand } from '@aws-sdk/client-s3';

import { NextResponse } from 'next/server';

import { s3Client } from '@/lib/server-only/aws/s3';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const key = formData.get('key') as string;

    if (!file || !key) {
      return NextResponse.json({ error: 'Archivo y key son requeridos' }, { status: 400 });
    }

    // Validar que el archivo sea MP3
    if (file.type !== 'audio/mpeg' && !file.name.toLowerCase().endsWith('.mp3')) {
      return NextResponse.json({ error: 'Solo se permiten archivos MP3' }, { status: 400 });
    }

    // Subir archivo a S3
    const fileBuffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PRIVATE_AWS_BUCKET_NAME!,
      Key: key,
      Body: Buffer.from(fileBuffer),
      ContentType: 'audio/mpeg',
      CacheControl: 'max-age=31536000',
    });

    await s3Client.send(command);

    // Construir la URL directa de S3
    const fileUrl = `https://${process.env.NEXT_PRIVATE_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PRIVATE_AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({
      url: fileUrl,
      key,
      message: 'Archivo subido exitosamente',
    });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 });
  }
}
