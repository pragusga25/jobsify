import express from 'express';
import { requireAdminRole } from '@jobsify/common';

const router = express.Router();

router.patch('/:id', requireAdminRole, (req, res) => {
  res.send('Update a Job');
});

export { router as updateRouter };
