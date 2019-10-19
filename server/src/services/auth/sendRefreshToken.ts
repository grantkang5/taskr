import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('qid', token, {
    httpOnly: true,
    /** disable path for next.js server */
    // path: "/refresh_token",
    domain: '.taskr-app.com',
    expires: new Date(Date.now() + 7 * 24 * 3600000)
  });
};
