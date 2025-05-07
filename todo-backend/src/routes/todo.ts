import { Router } from 'express';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController';
import { verifyAccessToken } from '../middleware/auth';

const router = Router();

router.use(verifyAccessToken);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router; 