import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import { auth } from './middlewares/auth.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

app.set('trust proxy', true); // respeta X-Forwarded-Proto detrás de un balanceador o Nginx
app.use(
  cors({
    origin: env.corsOrigin === '*' ? '*' : env.corsOrigin.split(',').map((o) => o.trim()),
  })
);
app.use(express.json({ limit: '100kb' }));

// Ruta pública para comprobar que el servicio está vivo
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Adjuntos en disco local: nombres aleatorios y siempre como descarga,
// para que el navegador nunca los ejecute como HTML.
if (env.storageDriver === 'local') {
  app.use(
    '/uploads',
    express.static(env.uploadDir, {
      index: false,
      setHeaders(res) {
        res.setHeader('Content-Disposition', 'attachment');
        res.setHeader('X-Content-Type-Options', 'nosniff');
      },
    })
  );
}

// Todas las rutas de tareas requieren el token
app.use('/api/tareas', auth, taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
