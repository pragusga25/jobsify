import { CustomError } from './custom-error';

export class ForbiddenError extends CustomError {
  statusCode = 403;
  constructor() {
    super('You are not allowed to access this resource');
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
  serializeErrors() {
    return [{ message: 'You are not allowed to access this resource' }];
  }
}
