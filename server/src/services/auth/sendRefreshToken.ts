import { Response } from 'express';

export const sendRefreshToken = (
  res: Response,
  token: string,
  service?: string
) => {
  let id = 'qid';
  switch (service) {
    case 'google':
      id = 'gid';
      break;
    default:
      break;
  }
  res.cookie(id, token, {
    httpOnly: true,
    /** disable path for next.js server */
    // path: "/refresh_token",
    domain: process.env.NODE_ENV === 'production' ? '.taskr-app.com' : 'localhost',
    expires: new Date(Date.now() + 7 * 24 * 3600000)
  });
};
