import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors';
import jwt from 'jsonwebtoken';

export const notAuthenticated = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  let isValid = false;
  if (!token) return next();

  try {
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);
    isValid = true;
  } catch {
    isValid = false;
  }

  if (isValid) {
    throw new ForbiddenError();
  }

  next();
};
