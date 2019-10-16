import React from "react";
import { useMeQuery } from "../../../generated/graphql";
import Link from "next/link";
import { setAccessToken } from "../../../lib/accessToken";
import { Logout } from "../../auth/Logout";
import { useApolloClient } from "@apollo/react-hooks";

import styles from "./Header.module.less";
import { Button } from "antd";

export const Header: React.FC = () => {
  const { data, loading } = useMeQuery();
  // const [logout, { client }] = useLogoutMutation();

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
            <a className={styles.blueLink}>Sign Up</a>
          </Link>
      </div>
    </header>
  );
};
