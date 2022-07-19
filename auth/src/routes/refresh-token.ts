import express from 'express';

const router = express.Router();

router.get('/refresh-token', (req, res) => {
  res.send('refresh token');
});

export { router as refreshTokenRouter };
