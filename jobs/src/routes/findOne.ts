import express from 'express';
const router = express.Router();

router.get('/:id', (req, res) => {
  res.send('Find one job');
});

export { router as findOneRouter };
