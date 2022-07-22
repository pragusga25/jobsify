import express, { Request, Response } from 'express';
import {
  BadRequestError,
  notAuthenticated,
  validateRequest,
} from '@jobsify/common';
import { body } from 'express-validator';
import { User } from '../models';

const router = express.Router();

router.post(
  '/signup',
  notAuthenticated,
  [
    body('username')
      .isString()
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 32 characters long.'),
    body('password')
      .trim()
      .isString()
      .isLength({ min: 8, max: 32 })
      .withMessage('Password must be between 8 and 64 characters long.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      throw new BadRequestError('Username already exists.');
    }

    const user = User.build({ username, password });
    await user.save();

    res.status(201).send(user);
  }
);

export { router as signupRouter };
