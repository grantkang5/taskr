import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '../../entity/User';
import { createAccessToken, createRefreshToken } from './createTokens';
import { sendRefreshToken } from './sendRefreshToken';
import axios from 'axios';

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

  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: '' });
  }

  if (payload.userId) {
    // web refreshtoken
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

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: false, accessToken: createAccessToken(user) });
  }

  if (payload.googleRefreshToken) {
    // google refresh_token
    try {
      const response = await axios({
        url: 'https://oauth2.googleapis.com/token',
        method: 'POST',
        withCredentials: true,
        params: {
          client_id: process.env.GOOGLE_OAUTH2_CLIENT_ID!,
          client_secret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET!,
          refresh_token: payload.googleRefreshToken,
          grant_type: 'refresh_token'
        }
      });

      const { id_token }: { id_token: string } = response.data;
      // no use for access_token just yet

      // sign google's id_token as a jwt token and send to client
      return res.send({ ok: false, accessToken: createAccessToken(id_token) });
    } catch (err) {
      console.log(err);
    }
  }

  return res.send({ ok: false, accessToken: '' });
};
