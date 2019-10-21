import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '../../../entity/User';
import { createAccessToken, createRefreshToken } from './createTokens';
import { sendRefreshToken } from '../sendRefreshToken';

export const refreshAccessToken = async (req: Request, res: Response) => {
  const token = req.cookies.qid;

  if (!token) {
    // Kill access token
    return res.send({
      accessToken: '',
      ok: false
    });
  }

  let payload: any = null;
  let user = null;

  // TODO: dont trycatch
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: '' });
  }

  try {
    user = await User.findOne({ id: payload.userId });
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: '' });
  }

  // user found or not found
  if (!user) {
    return res.send({ ok: false, accessToken: '' });
  }

  sendRefreshToken(res, createRefreshToken(user), 'website');

  return res.send({ ok: false, accessToken: createAccessToken(user) });
};
