import React, { useEffect } from 'react';
import Router from 'next/router';
import { setAccessToken, getAccessToken } from '../lib/accessToken';
import { useAuth_GoogleOAuthMutation } from '../generated/graphql';

const GoogleOAuth: React.FC = () => {
  const [auth] = useAuth_GoogleOAuthMutation();

  useEffect(() => {
    let didCancel = false;
    const { code }: { code?: string } = Router.query;
    if (code) {
      const fetchGoogleUser = async () => {
        const response = await auth({
          variables: { code }
        });

        if (response && response.data) {
          setAccessToken(response.data.auth_googleOAuth.accessToken);
          Router.push('/home');
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

export default GoogleOAuth;
