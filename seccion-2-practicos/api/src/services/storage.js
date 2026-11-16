import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import env from '../config/env.js';

// Nombre aleatorio + extensión saneada: nunca se usa el nombre original como ruta.
function buildKey(originalName) {
  const ext = path.extname(originalName).toLowerCase().replace(/[^.a-z0-9]/g, '').slice(0, 11);
  return `${randomUUID()}${ext}`;
}

/* ---------- Disco local ---------- */
const localStorage = {
  async save(file) {
    await fs.mkdir(env.uploadDir, { recursive: true });
    const key = buildKey(file.originalname);
    await fs.writeFile(path.join(env.uploadDir, key), file.buffer);
    return key;
  },
  async remove(key) {
    await fs.rm(path.join(env.uploadDir, path.basename(key)), { force: true });
  },
  async url(key, req) {
    const base = env.publicUrl || `${req.protocol}://${req.get('host')}`;
    return `${base}/uploads/${key}`;
  },
};

/* ---------- AWS S3 ---------- */
// El SDK se carga solo si se usa, y toma las credenciales de la cadena estándar
// (rol IAM de la instancia EC2, variables de entorno o ~/.aws).
let s3;
async function getS3() {
  if (!s3) {
    const { S3Client } = await import('@aws-sdk/client-s3');
    s3 = new S3Client({ region: env.awsRegion });
  }
  return s3;
}

const s3Storage = {
  async save(file) {
    const { PutObjectCommand } = await import('@aws-sdk/client-s3');
    const key = `adjuntos/${buildKey(file.originalname)}`;
    await (await getS3()).send(
      new PutObjectCommand({
        Bucket: env.s3Bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );
    return key;
  },
  async remove(key) {
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
    await (await getS3()).send(new DeleteObjectCommand({ Bucket: env.s3Bucket, Key: key }));
  },
  // El bucket permanece privado: se entrega una URL firmada válida por 1 hora.
  async url(key) {
    const { GetObjectCommand } = await import('@aws-sdk/client-s3');
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
    return getSignedUrl(
      await getS3(),
      new GetObjectCommand({
        Bucket: env.s3Bucket,
        Key: key,
        ResponseContentDisposition: 'attachment',
      }),
      { expiresIn: 3600 }
    );
  },
};

export default env.storageDriver === 's3' ? s3Storage : localStorage;
