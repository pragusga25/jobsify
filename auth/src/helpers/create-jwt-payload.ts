import { JWT_PAYLOAD_KEY } from '../constants';
import { PayloadValues } from '../interfaces';

export const createJwtPayload = (payload: PayloadValues) => ({
  [JWT_PAYLOAD_KEY]: payload,
});
