import React from 'react';
import { useMeQuery } from '../generated/graphql';
import Link from 'next/link';
import { setAccessToken } from '../lib/accessToken';
import { Logout } from './Logout';
import { useApolloClient } from '@apollo/react-hooks';

interface Props {}

export const Header: React.FC<Props> = () => {
  const { data, loading } = useMeQuery();
  // const [logout, { client }] = useLogoutMutation();

  let body: any = null;

  if (loading) {
    body = null;
  } else if (data && data.me) {
    body = <div>you are logged in as: {data.me.email}</div>;
  } else {
    body = <div>not logged in</div>;
  }

  return (
    <header>
      <nav>
        <Link href="/">
          <a>LandingPage</a>
        </Link>{' '}
        |{' '}
        <Link href="/home">
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href="/register">
          <a>Register</a>
        </Link>{' '}
        |{' '}
        <Link href="/login">
          <a>Login</a>
        </Link>{' '}
        |{' '}
        <Link href="/bye">
          <a>bye</a>
        </Link>{' '}
        | {!loading && data && data.me && <Logout />}
        {/* {!loading && data && data.me ? (
          <button
            onClick={async () => {
              await logout();
              setAccessToken("");
              await client!.resetStore();
            }}
          >
            logout
          </button>
        ) : null} */}
      </nav>
      {body}
    </header>
  );
};
