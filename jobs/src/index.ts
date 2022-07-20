import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  const {
    JWT_ACCESS_TOKEN_SECRET: access,
    JWT_REFRESH_TOKEN_SECRET: refresh,
    MONGO_URI: mongo,
  } = process.env;
  if (!access || !refresh || !mongo) {
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

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running on port ${port}`);
  });
};

start();
