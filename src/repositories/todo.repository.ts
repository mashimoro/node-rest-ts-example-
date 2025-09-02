import { Todo } from "../models/todo.model";

export class TodoRepository {
  private store = new Map<string, Todo>();

  async findAll(): Promise<Todo[]> {
    return Array.from(this.store.values());
  }

  async findById(id: string): Promise<Todo | null> {
    return this.store.get(id) ?? null;
  }

  async create(todo: Todo): Promise<Todo> {
    this.store.set(todo.id, todo);
    return todo;
  }

  async update(id: string, partial: Partial<Todo>): Promise<Todo | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: Todo = { ...existing, ...partial };
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
}
