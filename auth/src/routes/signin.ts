import express, { Request, Response } from 'express';
import * as redis from 'redis';
import { User } from '../models';
import {
  notAuthenticated,
  validateRequest,
  BadRequestError,
  Jwt,
  Password,
} from '@jobsify/common';
import { body } from 'express-validator';
const router = express.Router();
const client = redis.createClient({
  url: process.env.REDIS_URI!,
});

router.post(
  '/signin',
  notAuthenticated,
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      throw new BadRequestError('Invalid username or password');
    }

    const { password: hashedPassword, id, role } = user;

    const isMatch = await Password.compare(hashedPassword, password);
    if (!isMatch) {
      throw new BadRequestError('Invalid username or password');
    }

    const payload = { id, role, username };

    const tokens = Jwt.createTokens(payload);

    const key = `${id}__refreshToken__${tokens.refreshToken}`;
    await client.connect();
    await client.setEx(key, 60 * 60 * 24 * 7, tokens.refreshToken);
    await client.disconnect();

    res.status(200).send({ tokens });
  }
);

export { router as signinRouter };
