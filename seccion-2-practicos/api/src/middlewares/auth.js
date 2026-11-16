import { timingSafeEqual } from 'node:crypto';
import env from '../config/env.js';

const expected = Buffer.from(env.apiToken);

/**
 * Autenticación simple con token fijo.
 * Acepta:  Authorization: Bearer <token>   o   x-api-token: <token>
 */
export function auth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ')
    ? header.slice(7).trim()
    : req.get('x-api-token') || '';

  const received = Buffer.from(token);
  const ok = received.length === expected.length && timingSafeEqual(received, expected);

  if (!ok) {
    return res.status(401).json({ message: 'No autorizado: token inválido o ausente' });
  }
  next();
}
