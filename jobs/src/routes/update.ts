import express from 'express';
import { currentUser, requireAdminRole } from '@jobsify/common';

const router = express.Router();

router.patch('/:id', currentUser, requireAdminRole, (req, res) => {
  res.send('Update a Job');
});

export { router as updateRouter };
