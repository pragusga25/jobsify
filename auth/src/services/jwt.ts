import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';
import { createJwtPayload } from '../helpers';
import { JwtPayload, PayloadValues } from '../interfaces';

type Callback = (payload: string | jwt.JwtPayload | undefined) => unknown;

export class Jwt {
  static createAccessToken(payload: PayloadValues) {
    return jwt.sign(
      createJwtPayload(payload),
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      {
        expiresIn: '15m',
      }
    );
  }

  static createRefreshToken(payload: PayloadValues) {
    return jwt.sign(
      createJwtPayload(payload),
      process.env.JWT_REFRESH_TOKEN_SECRET!,
      {
        expiresIn: '7d',
      }
    );
  }

  static createTokens(payload: PayloadValues) {
    return {
      accessToken: Jwt.createAccessToken(payload),
      refreshToken: Jwt.createRefreshToken(payload),
    };
  }

  static verifyAccessToken(token: string | undefined, callback?: Callback) {
    if (!token) {
      throw new UnauthorizedError();
    }

    return jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      (err, payload) => {
        if (err) {
          throw new UnauthorizedError();
        }
        callback?.(payload);
      }
    );
  }

  static verifyRefreshToken(token: string | undefined, callback?: Callback) {
    if (!token) {
      throw new UnauthorizedError();
    }

    return jwt.verify(
      token,
      process.env.JWT_REFRESH_TOKEN_SECRET!,
      (err, payload) => {
        if (err) {
          throw new UnauthorizedError();
        }
        callback?.(payload);
      }
    );
  }

  static getPayload(token: string | undefined) {
    if (!token) {
      throw new UnauthorizedError();
    }

    return jwt.decode(token) as JwtPayload;
  }
}
