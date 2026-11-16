import app from './app.js';
import env from './config/env.js';
import { connectDB } from './config/db.js';

try {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`API escuchando en http://localhost:${env.port}`);
  });
} catch (err) {
  console.error('No se pudo iniciar la API:', err.message);
  process.exit(1);
}
