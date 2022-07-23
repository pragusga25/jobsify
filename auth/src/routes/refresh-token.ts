import express from 'express';
import * as redis from 'redis';
import {
  JWT_PAYLOAD_KEY,
  UnauthorizedError,
  JwtPayload,
  requireRefreshToken,
} from '@jobsify/common';
import { Jwt } from '@jobsify/common';
import jwt from 'jsonwebtoken';

const router = express.Router();
const client = redis.createClient({
  url: process.env.REDIS_URI!,
});

router.post('/refresh-token', requireRefreshToken, async (req, res) => {
  const refreshToken = req.headers.authorization?.split(' ')[1];

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
  } catch (err) {
    console.error(err);
    throw new UnauthorizedError();
  }
});

export { router as refreshTokenRouter };
