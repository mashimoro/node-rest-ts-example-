import { NextFunction, Request, Response } from 'express';
import { TodoService } from '../services/todo.service';
import { HttpException } from '../utils/http-exception';

export class TodoController {
  constructor(private service: TodoService) {}

  list = async (_req: Request, res: Response) => {
    const data = await this.service.list();
    res.status(200).json({ data });
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    const todo = await this.service.get(req.params.id);
    if (!todo) return next(new HttpException(404, 'Todo not found'));
    res.status(200).json({ data: todo });
  };

  create = async (req: Request, res: Response) => {
    const created = await this.service.create(req.body);
    res.status(201).json({ data: created });
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const updated = await this.service.update(req.params.id, req.body);
    if (!updated) return next(new HttpException(404, 'Todo not found'));
    res.status(200).json({ data: updated });
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    const ok = await this.service.remove(req.params.id);
    if (!ok) return next(new HttpException(404, 'Todo not found'));
    res.status(204).send();
  };
}
