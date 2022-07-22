import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { currentUser, errorHandler, NotFoundError } from '@jobsify/common';
import {
  createRouter,
  deleteRouter,
  findAllRouter,
  findOneRouter,
  updateRouter,
} from './routes';
import { API_PREFIX } from './constants';

const app = express();

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(currentUser);

app.use(API_PREFIX, createRouter);
app.use(API_PREFIX, deleteRouter);
app.use(API_PREFIX, findAllRouter);
app.use(API_PREFIX, findOneRouter);
app.use(API_PREFIX, updateRouter);

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
