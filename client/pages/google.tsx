import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { setAccessToken, getAccessToken } from '../lib/accessToken';
import { useAuth_GoogleOAuthMutation } from '../generated/graphql';
import Home from './home';

const GoogleOAuth: React.FC = () => {
  console.log('im google!');
  const [auth] = useAuth_GoogleOAuthMutation();
  console.log('i am googleoauth page');
  const [isLogged, handleLog] = useState(false);

  if (isLogged) {
    console.log('im logged dude!');
    Router.push('/login');
  }

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
          console.log('im trying to push to home mannnnnnnnnnn');
          console.log('router is', Router);
          handleLog(true);
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
