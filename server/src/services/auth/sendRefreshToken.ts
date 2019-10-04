import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('qid', token, {
    httpOnly: true,
    // path: '/refresh_token',
    expires: new Date(Date.now() + 7 * 24 * 3600000)
  });
};
