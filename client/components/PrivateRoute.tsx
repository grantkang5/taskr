import React, { useEffect } from 'react';
import { setAccessToken, getAccessToken } from '../lib/accessToken';
import { useAuth_GoogleOAuthMutation, useMeQuery } from '../generated/graphql';
import Login from '../pages/login';
import { useRouter } from 'next/router';

interface Props {}

const PrivateRoute = (Component: React.FC<Props>) => () => {
  const router = useRouter();
  const { data } = useMeQuery();

  useEffect(() => {
    if (!data) router.push('/login');
  }, []);

  if (data && data.me) {
    return <Component />;
  }

  return <></>;
};

export default PrivateRoute;
