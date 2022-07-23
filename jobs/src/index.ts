import mongoose from 'mongoose';
import { app } from './app';
import {
  ApplicationCreatedListener,
  ApplicationDeletedListener,
} from './listeners';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  console.log('[jobs]: Starting up...');

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
    await natsWrapper.connect('jobsify', '12saas3', 'http://nats-srv:4222');

    natsWrapper.stan.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.stan.close());
    process.on('SIGTERM', () => natsWrapper.stan.close());

    new ApplicationCreatedListener(natsWrapper.stan).listen();
    new ApplicationDeletedListener(natsWrapper.stan).listen();

    await mongoose.connect(mongo);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`⚡️[jobs]: Server is running on port ${port}`);
  });
};

start();
