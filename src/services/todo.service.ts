import { randomUUID } from 'crypto';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../models/todo.model';
import { TodoRepository } from '../repositories/todo.repository';

export class TodoService {
  constructor(private repo: any) {} // repo must implement repository methods

  async list(): Promise<Todo[]> {
    return this.repo.findAll();
  }

  async get(id: string): Promise<Todo | null> {
    return this.repo.findById(id);
  }

  async create(input: CreateTodoDTO): Promise<Todo> {
    const now = new Date().toISOString();
    const todo: Todo = {
      id: randomUUID(),
      title: input.title,
      completed: input.completed ?? false,
      createdAt: now,
      updatedAt: now
    };
    // If repo is a mongoose repo that ignores id, it's fine.
    return this.repo.create(todo);
  }

  async update(id: string, input: UpdateTodoDTO): Promise<Todo | null> {
    const updated = await this.repo.update(id, { ...input, updatedAt: new Date().toISOString() });
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
