import { CustomError } from './custom-error';

export class UnauthorizedError extends CustomError {
  statusCode = 401;
  constructor() {
    super('You are not authorized to access this resource');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
  serializeErrors() {
    return [{ message: 'You are not authorized to access this resource' }];
  }
}
