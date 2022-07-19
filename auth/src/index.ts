import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { API_PREFIX } from './constants';
import { errorHandler } from './middleware';
import { meRouter, signinRouter, signoutRouter, signupRouter } from './routes';
import { NotFoundError } from './errors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(API_PREFIX, meRouter);
app.use(API_PREFIX, signinRouter);
app.use(API_PREFIX, signoutRouter);
app.use(API_PREFIX, signupRouter);

app.get('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
