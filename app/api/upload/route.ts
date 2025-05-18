import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Validar que las variables de entorno necesarias estén presentes
const requiredEnvVars = {
  region: process.env.NEXT_PRIVATE_AWS_REGION,
  accessKeyId: process.env.NEXT_PRIVATE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PRIVATE_AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.NEXT_PRIVATE_AWS_BUCKET_NAME,
  cloudFrontUrl: process.env.NEXT_PUBLIC_CLOUDFRONT_URL,
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

    if (!requiredEnvVars.bucketName || !requiredEnvVars.cloudFrontUrl) {
      return NextResponse.json(
        { error: 'Configuración de AWS incompleta' },
        { status: 500 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: requiredEnvVars.bucketName,
      Key: fileName,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
    });

    await s3Client.send(command);

    // Asegurarse de que la URL de CloudFront sea completa
    const cloudFrontUrl = requiredEnvVars.cloudFrontUrl.startsWith('http')
      ? requiredEnvVars.cloudFrontUrl
      : `https://${requiredEnvVars.cloudFrontUrl}`;
    
    const fileUrl = `${cloudFrontUrl}/${fileName}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Error en la subida:', error);
    return NextResponse.json(
      { error: 'Error al subir el archivo' },
      { status: 500 }
    );
  }
} 