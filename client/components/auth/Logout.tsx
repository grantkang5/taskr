import React from 'react';
import { useLogoutMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { setAccessToken } from '../../lib/accessToken';
import { Button } from 'antd';

export const Logout: React.FC = () => {
  const router = useRouter()
  const [logout, { client }] = useLogoutMutation();

  const handleClick = async () => {
    const logoutResponse = await logout();
    if (logoutResponse) {
      setAccessToken('');
      await client!.resetStore();
      router.push('/');
    }
  };
  return (
    <Button type="primary" onClick={handleClick}>
      Log out
    </Button>
  );
};
