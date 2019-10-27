import React from 'react';
import { useLogoutMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { setAccessToken } from '../../lib/accessToken';

export const Logout: React.FC = ({ children }) => {
  const router = useRouter()
  const [logout, { client }] = useLogoutMutation();

  const handleClick = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const logoutResponse = await logout();
    if (logoutResponse) {
      setAccessToken('');
      await client!.resetStore();
      router.push('/login');
    }
  };
  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
};
