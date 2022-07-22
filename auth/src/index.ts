import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  const {
    JWT_ACCESS_TOKEN_SECRET: access,
    JWT_REFRESH_TOKEN_SECRET: refresh,
    MONGO_URI: mongo,
    REDIS_URI: redis,
  } = process.env;

  if (!access || !refresh || !mongo || !redis) {
    throw new Error(
      'There are environment variables missing. Please set them up.'
    );
  }

  try {
    await mongoose.connect(mongo);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  const port = 3000;

  app.listen(port, () => {
    console.log(`⚡️[auth]: Server is running on port ${port}`);
  });
};

start();
