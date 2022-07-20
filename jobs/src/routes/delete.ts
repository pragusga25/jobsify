import express from 'express';
import { currentUser, requireAdminRole } from '@jobsify/common';

const router = express.Router();

router.delete('/:id', currentUser, requireAdminRole, (req, res) => {
  res.send('Delete a Job');
});

export { router as deleteRouter };
