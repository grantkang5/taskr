import React from 'react';
import { useLogoutMutation } from '../../generated/graphql';
import Router from 'next/router';
import { setAccessToken } from '../../lib/accessToken';

export const Logout: React.FC = () => {
  const [logout, { client }] = useLogoutMutation();

  const handleClick = async () => {
    const logoutResponse = await logout();
    if (logoutResponse) {
      setAccessToken('');
      await client!.resetStore();
      Router.push('/');
    }
  };
  return (
    <button onClick={handleClick}>
      <div>Logout</div>
    </button>
  );
};
