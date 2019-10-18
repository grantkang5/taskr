import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('qid', token, {
    httpOnly: true,
    /** disable path for next.js server */
    // path: "/refresh_token",
    domain: process.env.NODE_ENV === 'production' ? 'dorya-api.herokuapp.com' : 'localhost',
    expires: new Date(Date.now() + 7 * 24 * 3600000)
  });
};
