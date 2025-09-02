import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../utils/http-exception';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpException) {
    return res.status(err.status).json({ message: err.message, details: err.details });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
}
