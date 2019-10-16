import React, { useEffect } from 'react';
import Router from 'next/router';
import { setAccessToken, getAccessToken } from '../lib/accessToken';
import { useAuth_GoogleOAuthMutation } from '../generated/graphql';

interface Props {}

const Google_OAuth: React.FC<Props> = () => {
  const [auth] = useAuth_GoogleOAuthMutation();
  console.log('RENDERED GOOGLEOAUTH PAGE');

  useEffect(() => {
    console.log('USEEFFECT TRIGGERED');
    let didCancel = false;
    const { code }: { code?: string } = Router.query;
    console.log('code is', code);
    if (code) {
      const fetchGoogleUser = async () => {
        console.log('code found. FETCHINGGOOGLEUSER');
        const response = await auth({
          variables: { code }
        });

        console.log('response from server is', response);
        if (response && response.data) {
          setAccessToken(response.data.auth_googleOAuth.accessToken);
          console.log('accessToken right after fetch is', getAccessToken());
          Router.push('/home');
        }
        if (!didCancel) {
          console.log('response is', response);
        }
      };
      fetchGoogleUser();

      return () => {
        didCancel = true;
      };
    }
  }, []);
  return <></>;
};

export default Google_OAuth;
