/**
 * This test is a light unit test that mocks mongoose Model methods.
 * It does not require a running MongoDB instance.
 */
import { TodoMongoRepository } from '../src/repositories/todo.repository.mongo';
import mongoose from 'mongoose';


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
    model: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockTodos)
      }),
      findById: jest.fn().mockImplementation((id: string) => ({
        lean: jest.fn().mockResolvedValue(id === '507f1f77bcf86cd799439011' ? mockTodo : null)
      })),

      create: jest.fn().mockResolvedValue({ _id: 'x', title: 'a', completed: false, createdAt: new Date(), updatedAt: new Date() }),
      findByIdAndUpdate: jest.fn().mockImplementation((id: string) => ({
        lean: jest.fn().mockResolvedValue(id === '507f1f77bcf86cd799439011' ? mockTodo : null)
      })),
      findByIdAndDelete: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011' })
    })
  };
});



describe('TodoMongoRepository (mocked)', () => {
  const repo = new TodoMongoRepository();

  it('findAll', async () => {
    const all = await repo.findAll();
    expect(all.length).toBeGreaterThan(0);
  });

  it('findById', async () => {
    const one = await repo.findById('507f1f77bcf86cd799439011');
    expect(one).toBeDefined();
    expect(one?.id).toBe('507f1f77bcf86cd799439011');
  });

  it('create', async () => {
    const created = await repo.create({ id: 'x', title: 'a', completed: false } as any);
    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
  });

  it('update', async () => {
    const updated = await repo.update('507f1f77bcf86cd799439011', { title: 'b' } as any);
    expect(updated).toBeDefined();
    expect(updated?.title).toBe('b');
  });

  it('delete', async () => {
    const ok = await repo.delete('507f1f77bcf86cd799439011');
    expect(ok).toBeTruthy();
  });
});
