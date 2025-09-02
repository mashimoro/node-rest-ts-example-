import { Router } from 'express';
import { TodoRepository } from '../repositories/todo.repository';
import { TodoService } from '../services/todo.service';
import { TodoController } from '../controllers/todo.controller';
import { validateResource } from '../middlewares/validateResource';
import { authGuard } from '../middlewares/auth.middleware';
import { createTodoSchema, idParamSchema, updateTodoSchema } from '../models/todo.model';
import { TodoMongoRepository } from '../repositories/todo.repository.mongo';

const router = Router();

const useMongo = process.env.USE_MONGO === 'true';
const repo = useMongo ? new TodoMongoRepository() : new TodoRepository();
const service = new TodoService(repo);
const controller = new TodoController(service);

router.get('/', authGuard, controller.list);
router.get('/:id', authGuard, validateResource(idParamSchema), controller.get);
router.post('/', authGuard, validateResource(createTodoSchema), controller.create);
router.patch('/:id', authGuard, validateResource(updateTodoSchema), controller.update);
router.delete('/:id', authGuard, validateResource(idParamSchema), controller.remove);

export default router;
