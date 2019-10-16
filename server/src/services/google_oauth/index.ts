import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export const createOAuth2Client = async () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH2_CLIENT_ID,
    process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
    process.env.CLIENT_URL
  );
};

export const verify = async (token: string) => {
  const client = new OAuth2Client(process.env.GOOGLE_OAUTH2_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_OAUTH2_CLIENT_ID!
  });
  const payload = ticket.getPayload();

  return payload;
};
