import express from 'express';
import * as redis from 'redis';
import { JwtPayload, JWT_PAYLOAD_KEY } from '@jobsify/common';
import jwt from 'jsonwebtoken';

const router = express.Router();
const client = redis.createClient({
  url: process.env.REDIS_URI!,
});

router.post('/signout', async (req, res) => {
  const refreshToken = req.headers.authorization?.replace('Bearer ', '');
  if (!refreshToken) {
    return res.send({});
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET!
    ) as JwtPayload;
    const {
      [JWT_PAYLOAD_KEY]: { id },
    } = payload;
    const key = `${id}__refreshToken__${refreshToken}`;
    await client.connect();
    await client.del(key);
    await client.disconnect();
  } catch {}

  res.status(204).send({});
});

export { router as signoutRouter };
