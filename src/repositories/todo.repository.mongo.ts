import mongoose, { Schema, Document, Model } from 'mongoose';
import { Todo } from '../models/todo.model';

interface TodoDoc extends Document {
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new Schema<TodoDoc>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const TodoModel: Model<TodoDoc> = mongoose.models.Todo || mongoose.model<TodoDoc>('Todo', TodoSchema);

export class TodoMongoRepository {
  constructor(private model = TodoModel) {}

  private toTodo(doc: TodoDoc): Todo {
    return {
      id: doc._id.toString(),
      title: doc.title,
      completed: doc.completed,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString()
    };
  }

  async findAll(): Promise<Todo[]> {
    const docs = await this.model.find().lean();
    return docs.map(d => this.toTodo(d as TodoDoc));
  }

  async findById(id: string): Promise<Todo | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await this.model.findById(id).lean();
    return doc ? this.toTodo(doc as TodoDoc) : null;
  }

  async create(todo: Omit<Todo, 'id'|'createdAt'|'updatedAt'> & { id?: string }): Promise<Todo> {
    const created = await this.model.create({ title: todo.title, completed: todo.completed });
    return this.toTodo(created as TodoDoc);
  }

  async update(id: string, partial: Partial<Todo>): Promise<Todo | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await this.model.findByIdAndUpdate(id, {
      ...partial
    }, { new: true }).lean();
    return doc ? this.toTodo(doc as TodoDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.isValidObjectId(id)) return false;
    const res = await this.model.findByIdAndDelete(id);
    return res != null;
  }
}
