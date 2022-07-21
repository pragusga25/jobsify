import express, { Request, Response } from 'express';
import { requireAdminRole, body, validateRequest } from '@jobsify/common';
import { Job } from '../models';

const router = express.Router();

router.post(
  '/',
  requireAdminRole,
  [
    body('name').not().isEmpty().withMessage('Company is required'),
    body('company').not().isEmpty().withMessage('Company is required'),
    body('salary').optional().isString().withMessage('Salary must be a string'),
    body('location').not().isEmpty().withMessage('Location is required'),
    body('description').not().isEmpty().withMessage('Description is required'),
    body('requirements')
      .not()
      .isEmpty()
      .isArray({ min: 1 })
      .withMessage('Requirements is required'),
    body('responsibilities')
      .not()
      .isEmpty()
      .isArray({ min: 1 })
      .withMessage('Requirements is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      name,
      company,
      salary = 'disclosed',
      requirements,
      responsibilities,
      location,
      description,
    } = req.body;

    const job = Job.build({
      name,
      company,
      salary,
      requirements,
      responsibilities,
      location,
      description,
    });

    await job.save();

    res.status(201).json({ job });
  }
);

export { router as createRouter };
