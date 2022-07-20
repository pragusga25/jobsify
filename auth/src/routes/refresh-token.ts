import express from 'express';
import * as redis from 'redis';
import { JWT_PAYLOAD_KEY } from '../constants';
import { UnauthorizedError } from '../errors';
import { JwtPayload } from '../interfaces';
import { requireRefreshToken } from '../middlewares';
import { Jwt } from '../services';
import jwt from 'jsonwebtoken';

const router = express.Router();
const client = redis.createClient({
  url: 'redis://auth-redis-srv:6379',
});

router.post('/refresh-token', requireRefreshToken, async (req, res) => {
  const refreshToken = req.headers.authorization?.replace('Bearer ', '');
  if (!refreshToken) {
    throw new UnauthorizedError();
  }

  try {
    const { [JWT_PAYLOAD_KEY]: payloadValues } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;
    const key = `${payloadValues.id}__refreshToken__${refreshToken}`;
    await client.connect();
    const storedRefreshToken = await client.get(key);
    await client.disconnect();

    if (!storedRefreshToken) {
      throw new UnauthorizedError();
    }

    const accessToken = Jwt.createAccessToken(payloadValues);

    res.status(201).send({
      accessToken,
    });
  } catch {
    throw new UnauthorizedError();
  }
});

export { router as refreshTokenRouter };
