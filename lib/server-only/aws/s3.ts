import { S3Client } from '@aws-sdk/client-s3';

const requiredEnvVars = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

// Verificar que todas las variables de entorno estén definidas
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('Variables de entorno faltantes:', missingVars.join(', '));
}

export const s3Client = new S3Client({
  region: requiredEnvVars.region,
  credentials: {
    accessKeyId: requiredEnvVars.accessKeyId!,
    secretAccessKey: requiredEnvVars.secretAccessKey!,
  },
});
