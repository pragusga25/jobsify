import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { API_PREFIX } from './constants';
import { errorHandler } from './middlewares';
import {
  meRouter,
  refreshTokenRouter,
  signinRouter,
  signoutRouter,
  signupRouter,
} from './routes';
import { NotFoundError } from './errors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(API_PREFIX, meRouter);
app.use(API_PREFIX, signinRouter);
app.use(API_PREFIX, signoutRouter);
app.use(API_PREFIX, signupRouter);
app.use(API_PREFIX, refreshTokenRouter);

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {
  const { JWT_ACCESS_TOKEN_SECRET: access, JWT_REFRESH_TOKEN_SECRET: refresh } =
    process.env;
  if (!access || !refresh) {
    throw new Error(
      'JWT_ACCESS_TOKEN_SECRET or JWT_REFRESH_TOKEN_SECRET is not defined'
    );
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running on port ${port}`);
  });
};

start();
