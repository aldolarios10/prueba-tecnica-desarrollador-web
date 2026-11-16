import mongoose from 'mongoose';
import multer from 'multer';

export class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export function notFound(_req, res) {
  res.status(404).json({ message: 'Ruta no encontrada' });
}

// Todas las respuestas de error tienen la forma { message, errors? }
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = {};
    for (const [campo, detalle] of Object.entries(err.errors)) {
      errors[campo] =
        detalle instanceof mongoose.Error.CastError
          ? `Valor inválido para "${campo}"`
          : detalle.message;
    }
    return res.status(400).json({ message: 'Datos inválidos', errors });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: `Valor inválido para "${err.path}"` });
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'El archivo supera el tamaño máximo permitido'
        : 'Error al subir el archivo (usa el campo "archivo")';
    return res.status(400).json({ message });
  }

  // JSON mal formado u otros errores del body parser
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'El cuerpo de la petición no es JSON válido' });
  }
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
}
