import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Find All Jobs');
});

export { router as findAllRouter };
