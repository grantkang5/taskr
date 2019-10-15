import React from 'react';
import { useMeQuery } from '../../../generated/graphql';
import Link from 'next/link';
import { setAccessToken } from '../../../lib/accessToken';
import { Logout } from '../../auth/Logout';
import { useApolloClient } from '@apollo/react-hooks';

import styles from './Header.module.less'

export const Header: React.FC = () => {
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
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/">
          <a>Home</a>
        </Link>
      </div>
      <div className={styles.right}>
        <Link href="/login">
          <a>Log In</a>
        </Link>

        <Link href="/register">
          <a>Sign Up</a>  
        </Link>
      </div>
    </header>
  );
};
