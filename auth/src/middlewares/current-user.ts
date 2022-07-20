import { Request, Response, NextFunction } from 'express';
import { JwtPayload, PayloadValues } from '../interfaces';
import jwt from 'jsonwebtoken';
import { JWT_PAYLOAD_KEY } from '../constants';

declare global {
  namespace Express {
    interface Request {
      currentUser?: PayloadValues;
    }
  }
}

export const currentUser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET!
    ) as JwtPayload;
    req.currentUser = payload[JWT_PAYLOAD_KEY];
  } catch {}

  next();
};
