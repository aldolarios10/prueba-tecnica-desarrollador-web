import 'dotenv/config';
import path from 'node:path';

const env = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tareas',
  apiToken: process.env.API_TOKEN || '',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  storageDriver: (process.env.STORAGE_DRIVER || 'local').toLowerCase(),
  uploadDir: path.resolve(process.env.UPLOAD_DIR || 'uploads'),
  maxFileSize: (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024,
  publicUrl: (process.env.PUBLIC_URL || '').replace(/\/$/, ''),
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  s3Bucket: process.env.S3_BUCKET || '',
};

if (!env.apiToken) {
  throw new Error('Falta la variable de entorno API_TOKEN');
}
if (env.storageDriver === 's3' && !env.s3Bucket) {
  throw new Error('STORAGE_DRIVER=s3 requiere la variable S3_BUCKET');
}

export default env;
