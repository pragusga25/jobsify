import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errorHandler, NotFoundError } from '@jobsify/common';

const app = express();

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
