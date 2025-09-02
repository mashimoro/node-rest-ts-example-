import { TodoService } from '../src/services/todo.service';
import { Todo } from '../src/models/todo.model';

describe('TodoService (unit)', () => {
  const sample: Todo = {
    id: '1',
    title: 'test',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const mockRepo: any = {
    findAll: jest.fn().mockResolvedValue([sample]),
    findById: jest.fn().mockResolvedValue(sample),
    create: jest.fn().mockImplementation(async (t: any) => ({ ...t, id: '1' })),
    update: jest.fn().mockResolvedValue({ ...sample, title: 'updated' }),
    delete: jest.fn().mockResolvedValue(true)
  };

  const service = new TodoService(mockRepo);

  it('list returns items', async () => {
    const list = await service.list();
    expect(list).toHaveLength(1);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it('get returns item', async () => {
    const got = await service.get('1');
    expect(got).toBeDefined();
    expect(got?.id).toBe('1');
  });

  it('create creates item', async () => {
    const created = await service.create({ title: 'x' } as any);
    expect(created).toBeDefined();
    expect(mockRepo.create).toHaveBeenCalled();
  });

  it('update updates item', async () => {
    const updated = await service.update('1', { title: 'updated' } as any);
    expect(updated).toBeDefined();
    expect(updated?.title).toBe('updated');
  });

  it('remove deletes item', async () => {
    const ok = await service.remove('1');
    expect(ok).toBeTruthy();
  });
});
