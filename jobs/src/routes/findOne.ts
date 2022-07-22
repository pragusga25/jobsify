import express from 'express';
import { NotFoundError } from '@jobsify/common';
import { Job } from '../models';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  const job = await Job.findById(id);

  if (!job) {
    throw new NotFoundError();
  }

  res.status(200).send({ job });
});

export { router as findOneRouter };
