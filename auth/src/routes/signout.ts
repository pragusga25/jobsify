import express from 'express';
import * as redis from 'redis';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../interfaces';
import { JWT_PAYLOAD_KEY } from '../constants';

const router = express.Router();
const client = redis.createClient({
  url: 'redis://auth-redis-srv:6379',
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

  res.send({});
});

export { router as signoutRouter };
