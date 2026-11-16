import multer from 'multer';
import env from '../config/env.js';

// El archivo se recibe en memoria y el servicio de storage decide dónde guardarlo
// (disco local o S3). El campo del formulario se llama "archivo".
export const uploadArchivo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxFileSize, files: 1 },
}).single('archivo');
