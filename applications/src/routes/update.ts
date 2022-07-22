import {
  ApplicationStatus,
  NotFoundError,
  requireAdminRole,
  validateRequest,
} from '@jobsify/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Application } from '../models';

const router = express.Router();

router.patch(
  '/:id',
  requireAdminRole,
  [
    body('status')
      .not()
      .isEmpty()
      .isString()
      .isIn(Object.values(ApplicationStatus))
      .withMessage('Status must be one of reviewed, rejected, accepted'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id);

    if (!application) {
      throw new NotFoundError();
    }

    application.set({ status });
    await application.save();
    res.send({ application });
  }
);

export { router as updateRouter };
