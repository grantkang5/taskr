import React from 'react';
import { useLogoutMutation } from '../generated/graphql';
import Router from 'next/router';
import { setAccessToken } from '../lib/accessToken';
import { useApolloClient } from '@apollo/react-hooks';

interface Props {}

export const Logout: React.FC<Props> = () => {
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
