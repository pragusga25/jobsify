import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log('Something went wrong', err);

  res.status(500).send({
    message: 'Something went wrong',
  });
};
