import express from 'express';
import { requireAdminRole } from '@jobsify/common';

const router = express.Router();

router.delete('/:id', requireAdminRole, (req, res) => {
  res.send('Delete a Job');
});

export { router as deleteRouter };
