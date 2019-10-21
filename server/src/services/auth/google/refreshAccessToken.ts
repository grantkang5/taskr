import { Request, Response } from 'express';
import { User } from '../../../entity/User';
// import { sendRefreshToken } from '../sendRefreshToken';
import { createOAuth2Client } from '.';

export const refreshAccessToken = async (req: Request, res: Response) => {
  const token = req.cookies.gid;

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
    // send google's refreshtoken for a new accesstoken
    const client = await createOAuth2Client();
    client.setCredentials({ refresh_token: token });
    console.log('accesstoken from google is', client);
    // payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
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

  // get a new refreshtoken from google and resend it to client thru cookie
  // sendRefreshToken(res, createRefreshToken(user), 'google');

  //TODO: get access
  return res.send({ ok: false, accessToken: '' });
};
