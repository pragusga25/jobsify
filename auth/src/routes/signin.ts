import express from 'express';

const router = express.Router();

router.post('/signin', (req, res) => {
  res.send('signin');
});

export { router as signinRouter };
