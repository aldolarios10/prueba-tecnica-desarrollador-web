import { Router } from 'express';
import { uploadArchivo } from '../middlewares/upload.js';
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  uploadAttachment,
  deleteAttachment,
} from '../controllers/taskController.js';

const router = Router();

router.get('/', listTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

router.post('/:id/adjunto', uploadArchivo, uploadAttachment);
router.delete('/:id/adjunto', deleteAttachment);

export default router;
