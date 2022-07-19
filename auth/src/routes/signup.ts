import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { DatabaseConnectionError, RequestValidationError } from '../errors';

const router = express.Router();

router.post(
  '/signup',
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
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    console.log('Creating a user...');
    throw new DatabaseConnectionError();

    res.send({});
  }
);

export { router as signupRouter };
