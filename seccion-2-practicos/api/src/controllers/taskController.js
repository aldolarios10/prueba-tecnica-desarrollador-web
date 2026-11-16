import mongoose from 'mongoose';
import Task from '../models/Task.js';
import storage from '../services/storage.js';
import { HttpError } from '../middlewares/errorHandler.js';

/* ---------- Utilidades ---------- */

// Convierte el documento a JSON y sustituye la clave interna del adjunto por su URL.
async function serialize(task, req) {
  const json = task.toJSON();
  if (json.adjunto?.key) {
    json.adjunto = {
      nombre: json.adjunto.nombre,
      mimetype: json.adjunto.mimetype,
      size: json.adjunto.size,
      url: await storage.url(json.adjunto.key, req),
    };
  } else {
    json.adjunto = null;
  }
  return json;
}

// Solo se aceptan estos campos del cliente; id, fechas y adjunto no son editables.
function pickBody(body = {}) {
  const data = {};
  for (const campo of ['titulo', 'descripcion', 'completado']) {
    if (body[campo] !== undefined) data[campo] = body[campo];
  }
  return data;
}

async function findTaskOr404(id) {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(404, 'Tarea no encontrada');
  const task = await Task.findById(id);
  if (!task) throw new HttpError(404, 'Tarea no encontrada');
  return task;
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ---------- CRUD ---------- */

// GET /api/tareas?page=1&limit=10&completado=true&q=texto
export async function listTasks(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

  const filter = {};
  if (req.query.completado === 'true') filter.completado = true;
  if (req.query.completado === 'false') filter.completado = false;
  if (typeof req.query.q === 'string' && req.query.q.trim()) {
    filter.titulo = { $regex: escapeRegex(req.query.q.trim()), $options: 'i' };
  }

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort({ fechaCreacion: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  res.json({
    data: await Promise.all(tasks.map((t) => serialize(t, req))),
    pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
  });
}

// GET /api/tareas/:id
export async function getTask(req, res) {
  const task = await findTaskOr404(req.params.id);
  res.json(await serialize(task, req));
}

// POST /api/tareas
export async function createTask(req, res) {
  const task = await Task.create(pickBody(req.body));
  res.status(201).json(await serialize(task, req));
}

// PUT | PATCH /api/tareas/:id  (solo se modifican los campos enviados)
export async function updateTask(req, res) {
  const task = await findTaskOr404(req.params.id);
  task.set(pickBody(req.body));
  await task.save();
  res.json(await serialize(task, req));
}

// DELETE /api/tareas/:id
export async function deleteTask(req, res) {
  const task = await findTaskOr404(req.params.id);
  await task.deleteOne();
  if (task.adjunto?.key) await storage.remove(task.adjunto.key).catch(console.error);
  res.status(204).end();
}

/* ---------- Adjuntos ---------- */

// POST /api/tareas/:id/adjunto   (multipart/form-data, campo "archivo")
export async function uploadAttachment(req, res) {
  const task = await findTaskOr404(req.params.id);
  if (!req.file) throw new HttpError(400, 'Debes enviar un archivo en el campo "archivo"');

  const keyAnterior = task.adjunto?.key;
  const key = await storage.save(req.file);

  task.adjunto = {
    // multer entrega el nombre en latin1; se convierte para conservar acentos
    nombre: Buffer.from(req.file.originalname, 'latin1').toString('utf8'),
    key,
    mimetype: req.file.mimetype,
    size: req.file.size,
  };
  await task.save();

  // Si la tarea ya tenía un adjunto, se reemplaza
  if (keyAnterior) await storage.remove(keyAnterior).catch(console.error);

  res.json(await serialize(task, req));
}

// DELETE /api/tareas/:id/adjunto
export async function deleteAttachment(req, res) {
  const task = await findTaskOr404(req.params.id);
  const key = task.adjunto?.key;
  task.adjunto = null;
  await task.save();
  if (key) await storage.remove(key).catch(console.error);
  res.json(await serialize(task, req));
}
