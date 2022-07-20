import express from 'express';
import { currentUser } from '@jobsify/common';

const router = express.Router();

router.get('/me', currentUser, (req, res) => {
  res.status(200).send({ currentUser: req.currentUser ?? null });
});

export { router as meRouter };
