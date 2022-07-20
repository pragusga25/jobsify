import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors';
import jwt from 'jsonwebtoken';

export const requireRefreshToken = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const refreshToken = req.headers.authorization?.split(' ')[1];

  if (!refreshToken) {
    throw new UnauthorizedError();
  }

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    next();
  } catch {
    throw new UnauthorizedError();
  }
};
