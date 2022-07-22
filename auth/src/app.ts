import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { API_PREFIX } from './constants';
import {
  meRouter,
  refreshTokenRouter,
  signinRouter,
  signoutRouter,
  signupRouter,
} from './routes';
import { errorHandler, NotFoundError } from '@jobsify/common';

const app = express();

app.set('trust proxy', true);

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

export { app };
