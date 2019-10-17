import React from 'react';
import { useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  console.log('private route check');
  const router = useRouter();
  const { data, loading } = useMeQuery();

  const whitelist = ['/login', '/register', '/home', '/google'];

  if (loading) {
    // TODO: add load screen
    return <></>;
  }
  // not authenticated, redirect unless it's in whitelist
  if (!whitelist.includes(router.route) && !data) {
    console.log('router is', router);
    router.push('/login');
    return <></>;
  }
  console.log('returning children');
  return <>{children}</>;
};

export default PrivateRoute;
