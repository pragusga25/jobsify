import jwt from 'jsonwebtoken';
import { JWT_PAYLOAD_KEY } from '../constants';

export type PayloadValues = {
  id: string;
  role: string;
  username: string;
};
export interface JwtPayload extends jwt.JwtPayload {
  [JWT_PAYLOAD_KEY]: PayloadValues;
}
