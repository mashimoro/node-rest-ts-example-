import { NextFunction, Request, Response } from 'express';
export function authGuard(req: Request, res: Response, next: NextFunction) {
  const header = req.headers['authorization'] || '';
  const token = header.toString().replace(/^Bearer\s+/i, '');
  if (token !== 'devtoken') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}
