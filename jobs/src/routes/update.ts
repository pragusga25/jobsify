import express, { Request, Response } from 'express';
import {
  NotFoundError,
  requireAdminRole,
  validateRequest,
} from '@jobsify/common';
import { body } from 'express-validator';
import { Job } from '../models';
import { FIELDS } from '../constants';
import { JobUpdatedPublisher } from '../publishers';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.patch(
  '/:id',
  requireAdminRole,
  [
    body('name')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Name must be a string'),
    body('company')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Company must be a string'),
    body('salary')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Salary must be a string'),
    body('location')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Location must be a string'),
    body('description')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Description is required'),
    body('requirements')
      .optional()
      .isArray({ min: 1 })
      .withMessage('Requirements must contain at least one item'),
    body('responsibilities')
      .optional()
      .isArray({ min: 1 })
      .withMessage('Requirements must contain at least one item'),
    body('vacancy')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Vacancy must be an integer and greater than or equal to 0'),
    body('status')
      .optional()
      .isString()
      .isIn(['open', 'closed'])
      .withMessage('Status must be open or closed'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const job = await Job.findById(id);
    if (!job) {
      throw new NotFoundError();
    }

    const dataUpdated = new Map();
    FIELDS.forEach((field) => {
      const val = req.body[field];
      if (val) {
        dataUpdated.set(field, val);
      }
    });

    if (dataUpdated.size > 0) {
      const data = Object.fromEntries(dataUpdated);
      job.set(data);
      await job.save();
      new JobUpdatedPublisher(natsWrapper.stan).publish({
        ...job.toObject(),
        id,
        version: job.version,
      });
    }

    res.status(200).send({ job });
  }
);

export { router as updateRouter };
