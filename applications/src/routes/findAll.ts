import { requireAuth } from '@jobsify/common';
import express, { Request, Response } from 'express';
import { Application } from '../models';

const router = express.Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;

  const applications = await Application.find({ userId }).populate('job');

  res.send({ applications });
});

export { router as findAllRouter };
