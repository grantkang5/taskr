import { sign } from 'jsonwebtoken';
import { User } from '../../entity/User';
type Payload = User | string;

export const createAccessToken = (payload: Payload) => {
  if (typeof payload === 'string') {
    return sign({ googleIdToken: payload }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: process.env.NODE_ENV === 'development' ? '60m' : '15m'
    });
  } else {
    return sign({ userId: payload.id }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: process.env.NODE_ENV === 'development' ? '60m' : '15m'
    });
  }
};

export const createRefreshToken = (payload: Payload) => {
  if (typeof payload === 'string') {
    return sign(
      { googleRefreshToken: payload },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: '7d'
      }
    );
  } else {
    return sign(
      { userId: payload.id, tokenVersion: payload.tokenVersion },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: '7d'
      }
    );
  }
};
