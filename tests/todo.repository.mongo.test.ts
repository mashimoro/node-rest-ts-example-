/**
 * This test is a light unit test that mocks mongoose Model methods.
 * It does not require a running MongoDB instance.
 */
jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  const mockTodos = [
    { _id: '507f1f77bcf86cd799439011', title: 'Test 1', completed: false, createdAt: new Date(), updatedAt: new Date() },
    { _id: '507f1f77bcf86cd799439012', title: 'Test 2', completed: true, createdAt: new Date(), updatedAt: new Date() }
  ];
  const mockTodo = { _id: '507f1f77bcf86cd799439011', title: 'b', completed: false, createdAt: new Date(), updatedAt: new Date() };

  return {
    ...actual,
    models: {},
    isValidObjectId: jest.fn().mockImplementation((id: string) => id.startsWith('507f1f77')),
    model: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockTodos)
      }),
      findById: jest.fn().mockImplementation((id: string) => ({
        lean: jest.fn().mockResolvedValue(id === '507f1f77bcf86cd799439011' ? mockTodo : null)
      })),
      create: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011', title: 'a', completed: false, createdAt: new Date(), updatedAt: new Date() }),
      findByIdAndUpdate: jest.fn().mockImplementation((id: string) => ({
        lean: jest.fn().mockResolvedValue(id === '507f1f77bcf86cd799439011' ? mockTodo : null)
      })),
      findByIdAndDelete: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011' })
    })
  };
});

import { TodoMongoRepository } from '../src/repositories/todo.repository.mongo';

describe('TodoMongoRepository (mocked)', () => {
  const repo = new TodoMongoRepository();

  it('findAll', async () => {
    const all = await repo.findAll();
    expect(all.length).toBeGreaterThan(0);
    expect(all[0].title).toBe('Test 1');
    expect(all[1].completed).toBe(true);
  });

  it('findById', async () => {
    const one = await repo.findById('507f1f77bcf86cd799439011');
    expect(one).toBeDefined();
    expect(one?.id).toBe('507f1f77bcf86cd799439011');
    expect(one?.title).toBe('b');
  });

  it('findById returns null for invalid id', async () => {
    const one = await repo.findById('invalid_id');
    expect(one).toBeNull();
  });

  it('create', async () => {
    const created = await repo.create({ id: 'x', title: 'a', completed: false } as any);
    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.title).toBe('a');
    expect(created.completed).toBe(false);
  });

  it('update', async () => {
    const updated = await repo.update('507f1f77bcf86cd799439011', { title: 'b' } as any);
    expect(updated).toBeDefined();
    expect(updated?.title).toBe('b');
  });

  it('update returns null for invalid id', async () => {
    const updated = await repo.update('invalid_id', { title: 'c' } as any);
    expect(updated).toBeNull();
  });

  it('delete', async () => {
    const ok = await repo.delete('507f1f77bcf86cd799439011');
    expect(ok).toBeTruthy();
  });

  it('delete returns false for invalid id', async () => {
    const ok = await repo.delete('invalid_id');
    expect(ok).toBeFalsy();
  });
});
