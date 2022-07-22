import { NotFoundError, requireAuth, UnauthorizedError } from '@jobsify/common';
import express, { Request, Response } from 'express';
import { Application } from '../models';

const router = express.Router();

router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;
  const id = req.params.id;

  const application = await Application.findById(id).populate('job');

  if (!application) {
    throw new NotFoundError();
  }

  if (application.userId !== userId) {
    throw new UnauthorizedError();
  }

  res.send({ application });
});

export { router as findOneRouter };
