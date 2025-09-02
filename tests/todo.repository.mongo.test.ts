/**
 * This test is a light unit test that mocks mongoose Model methods.
 * It does not require a running MongoDB instance.
 */
import { TodoMongoRepository } from '../src/repositories/todo.repository.mongo';
import mongoose from 'mongoose';

jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    models: {},
    model: jest.fn().mockReturnValue({
      find: jest.fn().mockResolvedValue([{ _id: '507f1f77bcf86cd799439011', title: 'a', completed: false, createdAt: new Date(), updatedAt: new Date() }]),
      findById: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011', title: 'a', completed: false, createdAt: new Date(), updatedAt: new Date() }),
      create: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011', title: 'a', completed: false, createdAt: new Date(), updatedAt: new Date() }),
      findByIdAndUpdate: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011', title: 'b', completed: true, createdAt: new Date(), updatedAt: new Date() }),
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
