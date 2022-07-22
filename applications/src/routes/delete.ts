import {
  ApplicationStatus,
  BadRequestError,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from '@jobsify/common';
import express, { Request, Response } from 'express';
import { Application } from '../models';
import { natsWrapper } from '../nats-wrapper';
import { ApplicationDeletedPublisher } from '../publishers';

const router = express.Router();

router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;
  const id = req.params.id;

  const application = await Application.findById(id).populate('job');

  if (!application) {
    throw new NotFoundError();
  }

  if (application.userId !== userId) {
    throw new UnauthorizedError();
  }

  if (application.status !== ApplicationStatus.Pending) {
    throw new BadRequestError('You can only delete pending applications');
  }

  await application.remove();
  new ApplicationDeletedPublisher(natsWrapper.stan).publish({
    id: application.id,
    version: application.version,
    jobId: application.job.id,
    userId,
  });

  res.status(204).send({});
});

export { router as deleteRouter };
