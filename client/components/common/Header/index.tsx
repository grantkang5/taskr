import React from 'react';
import { useMeQuery } from '../../../generated/graphql';
import Link from 'next/link';
import { Button, Layout } from 'antd';
import { Logout } from '../../auth/Logout';
import styles from './Header.module.less';

interface Props {
  dark?: number 
}

export const Header: React.FC<Props> = () => {
  const { data, loading } = useMeQuery();

  if (!data || !data.me) {
    return (
      <Layout.Header className={styles.header}>
        <div className={styles.left}>
          <Link href="/home">
            <a>Home</a>
          </Link>
        </div>
        <div className={styles.right}>
          <Link href="/login">
            <a>Log In</a>
          </Link>

          <Link href="/register">
            <a className={styles.blueLink}>Sign Up</a>
          </Link>
        </div>
      </Layout.Header>
    );
  }

  return (
    <Layout.Header className={styles.header}>
      <div className={styles.left}>
        <Link href="/home">
          <a>Home</a>
        </Link>
      </div>

      <div className={styles.right}>
        <Logout />
      </div>
    </Layout.Header>
  );
};
