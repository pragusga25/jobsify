import express from 'express';
import {
  body,
  currentUser,
  requireAdminRole,
  validateRequest,
} from '@jobsify/common';

const router = express.Router();

router.post('/', currentUser, requireAdminRole, (req, res) => {
  res.send('Create Job');
});

export { router as createRouter };
