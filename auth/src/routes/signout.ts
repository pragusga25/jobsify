import express from 'express';

const router = express.Router();

router.post('/signout', (req, res) => {
  res.send('signout');
});

export { router as signoutRouter };
