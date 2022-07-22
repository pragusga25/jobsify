import express from 'express';
import { NotFoundError, requireAdminRole } from '@jobsify/common';
import { Job } from '../models';
import { JobDeletedPublisher } from '../publishers';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/:id', requireAdminRole, async (req, res) => {
  const id = req.params.id;

  const job = await Job.findById(id);

  if (!job) {
    throw new NotFoundError();
  }

  await job.remove();

  await new JobDeletedPublisher(natsWrapper.stan).publish({
    id: job.id,
    version: job.version,
  });

  res.status(204).send({});
});

export { router as deleteRouter };
