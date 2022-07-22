import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@jobsify/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Application, Job } from '../models';
import { natsWrapper } from '../nats-wrapper';
import { ApplicationCreatedPublisher } from '../publishers';

const router = express.Router();

router.post(
  '/',
  requireAuth,
  [
    body('jobId')
      .not()
      .isEmpty()
      .isString()
      .custom((jobId: string) => mongoose.Types.ObjectId.isValid(jobId))
      .withMessage('Job ID must be a valid MongoDB Object ID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { jobId } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      throw new NotFoundError();
    }

    const userId = req.currentUser!.id;
    const isApplied = await job.isApplied(userId);

    if (isApplied) {
      throw new BadRequestError('You have already applied for this job');
    }

    const application = Application.build({
      userId,
      job,
    });

    await application.save();
    await new ApplicationCreatedPublisher(natsWrapper.stan).publish({
      id: application.id,
      userId,
      jobId,
      version: application.version,
    });
    const freshApplication = await Application.findById(
      application.id
    ).populate('job');

    res.status(201).send({ application: freshApplication });
  }
);

export { router as createRouter };
