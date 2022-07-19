import express from 'express';

const router = express.Router();

router.get('/me', (req, res) => {
  res.send('me');
});

export { router as meRouter };
