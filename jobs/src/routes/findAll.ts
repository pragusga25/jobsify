import express from 'express';
import { Job } from '../models';
const router = express.Router();

router.get('/', async (_req, res) => {
  const jobs = await Job.find({});
  res.status(200).send({ jobs });
});

export { router as findAllRouter };
